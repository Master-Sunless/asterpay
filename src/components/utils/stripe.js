const Stripe = require('stripe');
require('dotenv').config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (amountUSD, currency = 'usd') => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountUSD * 100, // Stripe expects amounts in cents
      currency,
      payment_method_types: ['card'],
    });
    return paymentIntent;
  } catch (error) {
    console.error('Stripe Error:', error);
    throw new Error('Failed to create payment intent');
  }
};
async function handlePayment(userAddress, serviceId) {
    // Step 1: Fetch subscription details from the contract
    const subscription = await getSubscriptionDetails(userAddress, serviceId);

    // Step 2: Convert USDT to USD
    const amountUSD = await convertUSDTtoUSD(subscription.lastPriceUSD);
    console.log(`Converted ${subscription.lastPriceUSD} USDT to ${amountUSD} USD`);

    // Step 3: Create Stripe Payment Intent
    const paymentIntent = await createStripePaymentIntent(amountUSD);
    console.log('Stripe Payment Intent:', paymentIntent);

    // Step 4: Process payment in smart contract
    await processPayment(userAddress, serviceId);

    return {
        paymentIntent,
        status: 'success',
    };
}


module.exports = { createPaymentIntent };
