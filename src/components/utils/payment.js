const { ethers } = require('ethers');

// Initialize contract details
const provider = new ethers.providers.JsonRpcProvider('YOUR_RPC_URL');
const wallet = new ethers.Wallet('YOUR_PRIVATE_KEY', provider);
const contractAddress = 'YOUR_SMART_CONTRACT_ADDRESS';
const abi = require('./abi.json'); // ABI of your smart contract
const contract = new ethers.Contract(contractAddress, abi, wallet);

// Function to get subscription details
async function getSubscriptionDetails(userAddress, serviceId) {
    try {
        const details = await contract.getSubscriptionDetails(userAddress, serviceId);
        console.log('Subscription Details:', details);
        return details;
    } catch (error) {
        console.error('Error fetching subscription details:', error);
    }
}

// Function to process payment
async function processPayment(userAddress, serviceId) {
    try {
        const tx = await contract.processPayment(userAddress, serviceId);
        await tx.wait();
        console.log('Payment processed successfully');
    } catch (error) {
        console.error('Error processing payment:', error);
    }
}
