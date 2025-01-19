// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

interface IPriceFeed {
    function getLatestPrice() external view returns (int256);
}

contract ServiceSubscriptionSystem is ReentrancyGuard, Ownable, Pausable {
    struct ServiceProvider {
        string name;           // e.g., "Netflix", "Spotify"
        bool active;
        address priceUpdater;  // Authorized address to update service prices
        mapping(uint256 => ServicePlan) plans;
        uint256 planCount;
    }

    struct ServicePlan {
        string name;          // e.g., "Basic", "Premium"
        uint256 priceUSD;    // Price in USD cents
        bool active;
        uint256 planDuration;
    }

    struct Subscription {
        uint256 serviceId;
        uint256 planId;
        uint256 startTime;
        uint256 nextPaymentTime;
        bytes32 virtualCardId;
        uint256 lastPriceUSD;
        SubscriptionStatus status;
        bool autoRenew;
    }

    enum SubscriptionStatus {
        INACTIVE,
        ACTIVE,
        PAYMENT_PENDING,
        SUSPENDED,
        CANCELLED
    }

    // State variables
    mapping(uint256 => ServiceProvider) public serviceProviders;
    mapping(address => mapping(uint256 => Subscription)) public userSubscriptions; // user -> serviceId -> subscription
    mapping(bytes32 => bool) public virtualCards;
    
    uint256 public serviceProviderCount;
    IERC20 public paymentToken;
    IPriceFeed public priceFeed;
    
    uint256 public constant PRICE_PRECISION = 1e8;
    uint256 public serviceFeePercent = 100; // 1% fee in basis points
    
    // Events
    event ServiceProviderAdded(uint256 indexed serviceId, string name);
    event PlanAdded(uint256 indexed serviceId, uint256 planId, string name, uint256 priceUSD, uint256 planDuration);
    event PriceUpdated(uint256 indexed serviceId, uint256 planId, uint256 newPriceUSD);
    event SubscriptionCreated(address indexed user, uint256 serviceId, uint256 planId, bytes32 virtualCardId);
    event SubscriptionUpgraded(address indexed user, uint256 serviceId, uint256 oldPlanId, uint256 newPlanId);
    event PaymentProcessed(address indexed user, uint256 serviceId, uint256 amountUSD, uint256 amountToken);
    event VirtualCardFunded(bytes32 indexed virtualCardId, uint256 amountUSD);

    constructor(address _paymentToken, address _priceFeed) Ownable(msg.sender) {
        paymentToken = IERC20(_paymentToken);
        priceFeed = IPriceFeed(_priceFeed);
    }

    // Service Provider Management
    function addServiceProvider(string memory _name, address _priceUpdater) external onlyOwner {
        ++serviceProviderCount;
        ServiceProvider storage provider = serviceProviders[serviceProviderCount];
        provider.name = _name;
        provider.priceUpdater = _priceUpdater;
        provider.active = true;
        
        emit ServiceProviderAdded(serviceProviderCount, _name);
    }

    function addServicePlan(
    uint256 _serviceId,
    string memory _planName,
    uint256 _priceUSD,
    uint256 _planDuration
) external {
    ServiceProvider storage provider = serviceProviders[_serviceId];
    require(msg.sender == provider.priceUpdater || msg.sender == owner(), "Unauthorized");
    ++provider.planCount;
    provider.plans[provider.planCount] = ServicePlan({
        name: _planName,
        priceUSD: _priceUSD,
        active: true,
        planDuration: _planDuration
    });
    
    emit PlanAdded(_serviceId, provider.planCount, _planName, _priceUSD, _planDuration);
}


    function updatePlanPrice(
        uint256 _serviceId,
        uint256 _planId,
        uint256 _newPriceUSD
    ) external {
        ServiceProvider storage provider = serviceProviders[_serviceId];
        require(msg.sender == provider.priceUpdater || msg.sender == owner(), "Unauthorized");
        
        provider.plans[_planId -1 ].priceUSD = _newPriceUSD; //same as service id, use literal, 1 is 0.
        emit PriceUpdated(_serviceId, _planId, _newPriceUSD);
    }

    // Subscription Management
    function subscribe(uint256 _serviceId,uint256 _planId,bytes32 _virtualCardId) external nonReentrant whenNotPaused {
        require(!virtualCards[_virtualCardId], "Card already in use");
        ServiceProvider storage provider = serviceProviders[_serviceId];
        ServicePlan storage plan = provider.plans[_planId];
        require(provider.active && plan.active, "Invalid service/plan");

        uint256 tokenAmount = getTokenAmount(plan.priceUSD);
        require(paymentToken.transferFrom(msg.sender, address(this), tokenAmount), "Payment failed");

        virtualCards[_virtualCardId] = true;
        userSubscriptions[msg.sender][_serviceId] = Subscription({
            serviceId: _serviceId,
            planId: _planId,
            startTime: block.timestamp,
            nextPaymentTime: block.timestamp + plan.planDuration,
            virtualCardId: _virtualCardId,
            lastPriceUSD: plan.priceUSD,
            status: SubscriptionStatus.ACTIVE,
            autoRenew: true
        });

        emit SubscriptionCreated(msg.sender, _serviceId, _planId, _virtualCardId);
        emit PaymentProcessed(msg.sender, _serviceId, plan.priceUSD, tokenAmount);
    }

    function changePlan(
    uint256 _serviceId,
    uint256 _newPlanId,
    bytes32 _virtualCardId
) external nonReentrant whenNotPaused {
    Subscription storage sub = userSubscriptions[msg.sender][_serviceId];
    require(sub.status == SubscriptionStatus.ACTIVE, "Invalid subscription");
    require(!virtualCards[_virtualCardId], "Card already in use");
    
    ServiceProvider storage provider = serviceProviders[_serviceId];
    ServicePlan storage newPlan = provider.plans[_newPlanId];
    require(newPlan.active, "Invalid plan");
    
    // Handle payment difference
    uint256 oldPriceUSD = serviceProviders[_serviceId].plans[sub.planId].priceUSD;
    uint256 newPriceUSD = newPlan.priceUSD;
    uint256 priceDifference = newPriceUSD > oldPriceUSD
        ? getTokenAmount(newPriceUSD - oldPriceUSD)
        : 0;

    if (priceDifference > 0) {
        require(paymentToken.transferFrom(msg.sender, address(this), priceDifference), "Payment failed");
    }

    // Update subscription
    virtualCards[sub.virtualCardId] = false; // Release old card
    virtualCards[_virtualCardId] = true;    // Lock new card
    sub.planId = _newPlanId;
    sub.virtualCardId = _virtualCardId;
    sub.lastPriceUSD = newPriceUSD;

    emit SubscriptionUpgraded(msg.sender, _serviceId, sub.planId, _newPlanId);
}


    function processPayment(address _user,uint256 _serviceId) external nonReentrant whenNotPaused {
        Subscription storage sub = userSubscriptions[_user][_serviceId];
        require(sub.status == SubscriptionStatus.ACTIVE, "Invalid subscription");
        require(block.timestamp >= sub.nextPaymentTime, "Payment not due");

        ServicePlan storage plan = serviceProviders[_serviceId].plans[sub.planId];
        uint256 tokenAmount = getTokenAmount(plan.priceUSD);

        if (paymentToken.transferFrom(_user, address(this), tokenAmount)) {
            sub.nextPaymentTime = block.timestamp + plan.planDuration;
            sub.lastPriceUSD = plan.priceUSD;
            emit PaymentProcessed(_user, _serviceId, plan.priceUSD, tokenAmount);
        } else {
            sub.status = SubscriptionStatus.PAYMENT_PENDING;
        }
    }

    // Utility Functions
    function getTokenAmount(uint256 _usdAmount) public view returns (uint256) {
        int256 price = priceFeed.getLatestPrice();
        require(price > 0, "Invalid price feed");
        
        uint256 tokenAmount = (_usdAmount * PRICE_PRECISION) / uint256(price);
        uint256 fee = (tokenAmount * serviceFeePercent) / 10000;
        return tokenAmount + fee;
    }

    function getSubscriptionDetails(
        address _user,
        uint256 _serviceId
    ) external view returns (
        uint256 planId,
        uint256 nextPayment,
        uint256 priceUSD,
        SubscriptionStatus status
    ) {
        Subscription storage sub = userSubscriptions[_user][_serviceId];
        return (
            sub.planId,
            sub.nextPaymentTime,
            serviceProviders[_serviceId].plans[sub.planId].priceUSD,
            sub.status
        );
    }

    // Admin Functions
    function setServiceFee(uint256 _newFeePercent) external onlyOwner {
        require(_newFeePercent <= 1000, "Fee too high"); // Max 10%
        serviceFeePercent = _newFeePercent;
    }

    function withdrawFees(address _token, uint256 _amount) external onlyOwner {
        IERC20(_token).transfer(owner(), _amount);
    }
}