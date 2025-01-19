// src/services/VirtualCardManager.js
const { Privacy } = require('privacy-com');
const axios = require('axios');
const crypto = require('crypto');
const Web3 = require('web3');
const { configDotenv } = require('dotenv');

class VirtualCardManager {
  constructor(config) {
    this.privacy = new Privacy(config.privacyApiKey);
    this.web3 = new Web3(config.web3Provider);
    this.usdtContract = new this.web3.eth.Contract(
      config.usdtAbi,
      config.usdtAddress
    );
    this.decimals = 6; // USDT decimals
  }

  async getUsdtToUsdRate() {
    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd'
      );
      return response.data.tether.usd;
    } catch (error) {
      throw new Error(`Failed to fetch USDT/USD rate: ${error.message}`);
    }
  }

  async convertUsdtToUsd(usdtAmount) {
    const rate = await this.getUsdtToUsdRate();
    const usdtInDecimal = usdtAmount / (10 ** this.decimals);
    return usdtInDecimal * rate;
  }

  async createVirtualCard({ 
    memo, 
    spendLimit, 
    usdtAmount,
    merchantId = null 
  }) {
    try {
      // Convert USDT amount to USD
      const usdAmount = await this.convertUsdtToUsd(usdtAmount);
      
      // Create card configuration
      const cardConfig = {
        type: 'SINGLE_USE',
        spendLimit: Math.floor(usdAmount * 100), // Convert to cents
        memo: memo,
        state: 'ACTIVE'
      };

      if (merchantId) {
        cardConfig.merchant_id = merchantId;
      }

      // Create virtual card
      const card = await this.privacy.createCard(cardConfig);

      // Generate card hash for blockchain
      const cardHash = this.web3.utils.soliditySha3(
        card.token,
        card.last4,
        spendLimit
      );

      return {
        cardId: card.token,
        last4: card.last4,
        cardHash: cardHash,
        spendLimit: card.spend_limit,
        state: card.state,
        memo: card.memo
      };
    } catch (error) {
      throw new Error(`Failed to create virtual card: ${error.message}`);
    }
  }

  async fundCard(cardToken, usdtAmount, fromAddress) {
    try {
      // Get current USDT/USD rate
      const usdAmount = await this.convertUsdtToUsd(usdtAmount);
      
      // Update card spending limit
      await this.privacy.updateCard(cardToken, {
        spend_limit: Math.floor(usdAmount * 100) // Convert to cents
      });

      // Return funding transaction data
      return {
        cardToken,
        usdtAmount,
        usdAmount,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Failed to fund card: ${error.message}`);
    }
  }

  async getCardTransactions(cardToken) {
    try {
      const transactions = await this.privacy.listTransactions({
        card_token: cardToken
      });

      return transactions.map(tx => ({
        id: tx.token,
        amount: tx.amount,
        status: tx.status,
        date: tx.created,
        merchant: tx.merchant.descriptor
      }));
    } catch (error) {
      throw new Error(`Failed to fetch card transactions: ${error.message}`);
    }
  }
}

module.exports = VirtualCardManager;