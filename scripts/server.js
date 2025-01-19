const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();
app.use(express.json()); // Parse JSON request bodies

const PORT = process.env.PORT || 3000;

// User Registration
app.post('/register', async (req, res) => {
  const { walletAddress, email } = req.body;
  
  try {
    const user = await prisma.user.create({
      data: {
        walletAddress,
        email,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Fetch Subscriptions for a User
app.get('/subscriptions/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const subscriptions = await prisma.subscription.findMany({
      where: { userId: parseInt(userId) },
    });
    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subscriptions' });
  }
});

// Subscribe to a Service Plan
app.post('/subscribe', async (req, res) => {
  const { userId, providerId, planId, virtualCardId, cardHash } = req.body;

  try {
    const subscription = await prisma.subscription.create({
      data: {
        userId,
        providerId,
        planId,
        virtualCardId,
        cardHash,
        status: 'ACTIVE', // Initial status
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        lastPriceUSD: 1000, // Assuming a fixed amount; replace with dynamic pricing logic
      },
    });
    res.status(201).json(subscription);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create subscription' });
  }
});

// Cancel a Subscription
app.patch('/cancel-subscription/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const subscription = await prisma.subscription.update({
      where: { id: parseInt(id) },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
      },
    });
    res.status(200).json(subscription);
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
