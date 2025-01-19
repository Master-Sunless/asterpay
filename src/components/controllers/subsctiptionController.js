const { sequelize } = require('../../models');
const { ethers } = require('ethers');
const ServiceProvider = sequelize.models.ServiceProvider;
const Subscription = sequelize.models.Subscription;
const { contract } = require('../utils/web3Provider');

const { createPaymentIntent } = require('../utils/stripe');

// const createSubscription = async (req, res) => {
//   const { userId, serviceId, planId, virtualCardId } = req.body;

//   try {
//     // Verify service and plan existence
//     const service = await ServiceProvider.findByPk(serviceId);
//     if (!service || !service.active) {
//       return res.status(404).json({ message: 'Service not found or inactive' });
//     }

//     // Create subscription
//     const newSubscription = await Subscription.create({
//       userId,
//       serviceId,
//       planId,
//       virtualCardId,
//       status: 'ACTIVE',
//       nextPaymentTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Example: 30 days
//     });

//     res.status(201).json(newSubscription);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };


const createSmartContractSubscription = async (userId, serviceId, planId, priceUSD) => {
  try {
    const tx = await contract.subscribe(userId, serviceId, planId, priceUSD);
    const receipt = await tx.wait();
    return receipt.transactionHash;
  } catch (error) {
    console.error('Smart Contract Error:', error);
    throw new Error('Failed to create subscription on-chain');
  }
};
// const createSubscription = async (req, res) => {
//   const { userId, serviceId, planId, virtualCardId } = req.body;

//   try {
//     // Verify service and plan existence
//     const service = await ServiceProvider.findByPk(serviceId);
//     if (!service || !service.active) {
//       return res.status(404).json({ message: 'Service not found or inactive' });
//     }

//     // Calculate price in USD (get from database or config)
//     const plan = await Plan.findByPk(planId);
//     if (!plan || !plan.active) {
//       return res.status(404).json({ message: 'Plan not found or inactive' });
//     }

//     const priceUSD = plan.priceUSD;

//     // Interact with smart contract
//     const transactionHash = await createSmartContractSubscription(userId, serviceId, planId, priceUSD);

//     // Create subscription in database
//     const newSubscription = await Subscription.create({
//       userId,
//       serviceId,
//       planId,
//       virtualCardId,
//       status: 'ACTIVE',
//       nextPaymentTime: new Date(Date.now() + plan.duration * 1000), // Assuming duration is in seconds
//     });

//     res.status(201).json({ subscription: newSubscription, transactionHash });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error', error: error.message });
//   }
// };
const getSubscriptionDetails = async (req, res) => {
  const { userId, serviceId } = req.params;

  try {
    const subscription = await Subscription.findOne({ where: { userId, serviceId } });

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    res.status(200).json(subscription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createSubscription = async (req, res) => {
  const { userId, serviceId, planId, virtualCardId } = req.body;

  try {
    // Verify service and plan existence
    const service = await ServiceProvider.findByPk(serviceId);
    if (!service || !service.active) {
      return res.status(404).json({ message: 'Service not found or inactive' });
    }

    const plan = await Plan.findByPk(planId);
    if (!plan || !plan.active) {
      return res.status(404).json({ message: 'Plan not found or inactive' });
    }

    const priceUSD = plan.priceUSD;

    // Create Stripe Payment Intent
    const paymentIntent = await createPaymentIntent(priceUSD);

    // Interact with smart contract
    const transactionHash = await createSmartContractSubscription(userId, serviceId, planId, priceUSD);

    // Create subscription in database
    const newSubscription = await Subscription.create({
      userId,
      serviceId,
      planId,
      virtualCardId,
      status: 'ACTIVE',
      nextPaymentTime: new Date(Date.now() + plan.duration * 1000),
    });

    res.status(201).json({ subscription: newSubscription, paymentIntent, transactionHash });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};



module.exports = { createSubscription, getSubscriptionDetails };


