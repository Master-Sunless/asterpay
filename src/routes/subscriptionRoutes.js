const express = require('express');
const { createSubscription, getSubscriptionDetails } = require('../controllers/subscriptionController');

const router = express.Router();

router.post('/create', createSubscription);
router.get('/:userId/:serviceId', getSubscriptionDetails);
const {
    getStats,
    getTransactions,
    initiateTransaction,
} = require('../controllers/transactionController');

// Fetch dashboard stats
router.get('/stats', getStats);

// Fetch recent transactions
router.get('/transactions', getTransactions);

// Initiate a new transaction
router.post('/transactions/new', initiateTransaction);



module.exports = router;
