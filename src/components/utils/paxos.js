const axios = require('axios');

// Replace with your Paxos API endpoint and API key
const PAXOS_API_URL = 'https://api.paxos.com/v1/';
const PAXOS_API_KEY = 'your_paxos_api_key';

// Function to convert USDT to USD via Paxos
async function convertUSDTtoUSD(usdtAmount) {
    try {
        // Request to Paxos API to convert USDT to USD
        const response = await axios.post(`${PAXOS_API_URL}/convert`, {
            amount: usdtAmount, // amount in USDT
            from_currency: 'USDT',
            to_currency: 'USD',
        }, {
            headers: {
                'Authorization': `Bearer ${PAXOS_API_KEY}`,
            }
        });

        // Extract converted USD amount from the response
        const usdAmount = response.data.amount_in_usd;

        return usdAmount;
    } catch (error) {
        console.error('Error converting USDT to USD:', error);
        throw new Error('Conversion failed');
    }
}

// Function to transfer USD to Stripe (using Stripe API)
async function transferToStripe(usdAmount) {
    try {
        // Call Stripe API to create a payment or transfer (depending on your use case)
        const stripe = require('stripe')('your_stripe_secret_key');

        const paymentIntent = await stripe.paymentIntents.create({
            amount: usdAmount * 100, // Stripe requires the amount in cents
            currency: 'usd',
            payment_method_types: ['card'],
        });

        return paymentIntent;
    } catch (error) {
        console.error('Error transferring USD to Stripe:', error);
        throw new Error('Stripe transfer failed');
    }
}

// Main logic: convert USDT to USD and then transfer to Stripe
async function processPaymentAndTransfer(usdtAmount) {
    try {
        const usdAmount = await convertUSDTtoUSD(usdtAmount);
        console.log('Converted USD Amount:', usdAmount);

        // Transfer the converted USD amount to Stripe
        const stripePayment = await transferToStripe(usdAmount);
        console.log('Stripe Payment Intent:', stripePayment);
    } catch (error) {
        console.error('Payment processing failed:', error);
    }
}

// Example usage (USDT amount passed)
processPaymentAndTransfer(100); // Convert 100 USDT to USD and transfer to Stripe
