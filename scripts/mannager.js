const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { Web3 } = require('web3');
const { verifySignature, createVirtualCard } = require('../utils/crypto');
const ServiceSubscriptionSystem = require('../contracts/ServiceSubscriptionSystem.json');
const router = express.Router();
const prisma = new PrismaClient();

// Initialize Web3 with your provider
const web3 = new Web3(process.env.WEB3_PROVIDER_URL);
const contract = new web3.eth.Contract(
  ServiceSubscriptionSystem.abi,
  process.env.CONTRACT_ADDRESS
);

class SubscriptionController {
  async createSubscription(req, res) {
    const { userId, providerId, planId, signature } = req.body;
    
    try {
      // Verify user's signature
      const isValidSignature = await verifySignature(signature, req.body);
      if (!isValidSignature) {
        return res.status(401).json({ error: 'Invalid signature' });
      }

      // Start transaction
      const result = await prisma.$transaction(async (prisma) => {
        // Get plan details
        const plan = await prisma.servicePlan.findUnique({
          where: { id: planId },
          include: { provider: true }
        });
        
        if (!plan || !plan.isActive) {
          throw new Error('Invalid or inactive plan');
        }

        // Create virtual card
        const virtualCard = await createVirtualCard({
          amount: plan.priceUSD,
          description: `Subscription to ${plan.provider.name}`
        });

        // Create subscription on blockchain
        const tx = await contract.methods.subscribe(
          providerId,
          planId,
          web3.utils.soliditySha3(virtualCard.id)
        ).send({
          from: req.body.walletAddress,
          gas: process.env.GAS_LIMIT
        });

        // Create subscription in database
        const subscription = await prisma.subscription.create({
          data: {
            userId,
            providerId,
            planId,
            virtualCardId: virtualCard.id,
            cardHash: web3.utils.soliditySha3(virtualCard.id),
            status: 'ACTIVE',
            lastPriceUSD: plan.priceUSD,
            nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            metadata: {
              transactionHash: tx.transactionHash,
              virtualCardLast4: virtualCard.last4
            }
          },
          include: {
            plan: true,
            provider: true
          }
        });

        // Create initial payment transaction record
        await prisma.paymentTransaction.create({
          data: {
            subscriptionId: subscription.id,
            amountUSD: plan.priceUSD,
            amountToken: tx.events.PaymentProcessed.returnValues.amountToken,
            tokenAddress: process.env.PAYMENT_TOKEN_ADDRESS,
            txHash: tx.transactionHash,
            status: 'COMPLETED'
          }
        });

        return subscription;
      });

      res.status(201).json(result);
    } catch (error) {
      console.error('Subscription creation failed:', error);
      res.status(500).json({
        error: 'Failed to create subscription',
        details: error.message
      });
    }
  }

  async processRenewal(subscriptionId) {
    try {
      const subscription = await prisma.subscription.findUnique({
        where: { id: subscriptionId },
        include: {
          user: true,
          plan: true
        }
      });

      if (!subscription.autoRenew || subscription.status !== 'ACTIVE') {
        return;
      }

      // Get latest token price and calculate amount
      const tokenAmount = await contract.methods.getTokenAmount(
        subscription.lastPriceUSD
      ).call();

      // Process blockchain payment
      const tx = await contract.methods.processPayment(
        subscription.user.walletAddress,
        subscription.providerId
      ).send({
        from: process.env.SYSTEM_WALLET_ADDRESS,
        gas: process.env.GAS_LIMIT
      });

      // Update subscription and create payment record
      await prisma.$transaction([
        prisma.subscription.update({
          where: { id: subscriptionId },
          data: {
            lastBillingDate: new Date(),
            nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          }
        }),
        prisma.paymentTransaction.create({
          data: {
            subscriptionId,
            amountUSD: subscription.lastPriceUSD,
            amountToken: tokenAmount.toString(),
            tokenAddress: process.env.PAYMENT_TOKEN_ADDRESS,
            txHash: tx.transactionHash,
            status: 'COMPLETED'
          }
        })
      ]);

      return true;
    } catch (error) {
      console.error('Renewal failed:', error);
      
      // Mark subscription as payment pending
      await prisma.subscription.update({
        where: { id: subscriptionId },
        data: {
          status: 'PAYMENT_PENDING'
        }
      });

      throw error;
    }
  }
}

module.exports = new SubscriptionController();