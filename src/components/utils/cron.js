const cron = require('node-cron');
const { Subscription, Plan } = require('../models');
const { createPaymentIntent } = require('./stripe');
const { contract } = require('./web3Provider');

cron.schedule('0 0 * * *', async () => {
  const subscriptions = await Subscription.findAll({ where: { status: 'ACTIVE' } });

  for (const sub of subscriptions) {
    if (Date.now() >= sub.nextPaymentTime) {
      try {
        const plan = await Plan.findByPk(sub.planId);
        const priceUSD = plan.priceUSD;

        // Charge using Stripe
        await createPaymentIntent(priceUSD);

        // Interact with contract
        await contract.processPayment(sub.userId, sub.serviceId);

        // Update subscription
        sub.nextPaymentTime = new Date(Date.now() + plan.duration * 1000);
        await sub.save();
      } catch (error) {
        console.error(`Failed to renew subscription ${sub.id}:`, error);
        sub.status = 'PAYMENT_PENDING';
        await sub.save();
      }
    }
  }
});
