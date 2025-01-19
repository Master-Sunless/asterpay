require('dotenv').config();
const axios = require('axios');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const { convertUSDTtoUSD } = require('./conversionService'); // Assuming you have this function for Paxos integration

/**
 * Handles the full conversion flow: USDT to USD, Stripe payment, and logging.
 * @param {number} usdtAmount - Amount in USDT to convert.
 * @param {string} stripeCustomerId - Stripe customer ID for payment.
 * @param {string} description - Description for the payment.
 */
async function handleConversion(usdtAmount, stripeCustomerId, description) {
    try {
        console.log('Starting USDT to USD conversion process...');

        // Step 1: Convert USDT to USD
        const usdAmount = await convertUSDTtoUSD(usdtAmount);
        console.log(`Converted ${usdtAmount} USDT to ${usdAmount.toFixed(2)} USD.`);

        // Step 2: Create Stripe Payment Intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(usdAmount * 100), // Stripe works with cents
            currency: 'usd',
            customer: stripeCustomerId,
            description,
            payment_method_types: ['card'],
        });

        console.log('Stripe Payment Intent created:', paymentIntent.id);

        // Step 3: Log the transaction
        await logTransaction({
            usdtAmount,
            usdAmount,
            stripePaymentId: paymentIntent.id,
            status: 'SUCCESS',
        });

        console.log('Transaction logged successfully.');
        return paymentIntent;
    } catch (error) {
        console.error('Error during conversion process:', error.message);
        await logTransaction({
            usdtAmount,
            usdAmount: 0,
            stripePaymentId: null,
            status: 'FAILED',
            error: error.message,
        });
        throw error;
    }
}

/**
 * Logs the transaction details (simulated database logging).
 * @param {object} transaction - Transaction details to log.
 */
async function logTransaction(transaction) {
    // Simulated database interaction
    console.log('Logging transaction:', transaction);
    // Example: Save to your database here
}

module.exports = { handleConversion };
