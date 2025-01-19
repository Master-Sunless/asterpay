// src/utils/crypto.js
const { Web3 } = require('web3');
const crypto = require('crypto');
const { Privacy } = require('privacy-com');
const { ethers } = require('ethers');

class CryptoUtils {
  constructor(config = {}) {
    this.web3 = new Web3(config.web3Provider || process.env.WEB3_PROVIDER_URL);
    this.privacy = new Privacy(config.privacyApiKey || process.env.PRIVACY_API_KEY);
    this.chainId = config.chainId || process.env.CHAIN_ID;
  }

  /**
   * Verify an Ethereum signature
   * @param {string} signature - The signature to verify
   * @param {Object} data - The original data that was signed
   * @param {string} expectedAddress - The expected signer's address
   * @returns {Promise<boolean>} - Whether the signature is valid
   */
  async verifySignature(signature, data, expectedAddress) {
    try {
      // Create the message hash
      const messageHash = this.createMessageHash(data);
      
      // Recover the signer's address from the signature
      const recoveredAddress = await this.recoverSigner(messageHash, signature);
      
      // Compare with the expected address
      return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
    } catch (error) {
      console.error('Signature verification failed:', error);
      return false;
    }
  }

  /**
   * Create a hash of the message data
   * @param {Object} data - The data to hash
   * @returns {string} - The message hash
   */
  createMessageHash(data) {
    // Create a deterministic message from the data
    const message = JSON.stringify(this.sortObject(data));
    
    // Create an Ethereum signed message
    const messageBuffer = Buffer.from(message);
    const prefix = Buffer.from(`\x19Ethereum Signed Message:\n${messageBuffer.length}`);
    const finalMessage = Buffer.concat([prefix, messageBuffer]);
    
    return this.web3.utils.sha3(finalMessage);
  }

  /**
   * Recover the signer's address from a signature
   * @param {string} messageHash - The hash of the original message
   * @param {string} signature - The signature to recover from
   * @returns {Promise<string>} - The signer's address
   */
  async recoverSigner(messageHash, signature) {
    try {
      // Split signature into components
      const r = signature.slice(0, 66);
      const s = '0x' + signature.slice(66, 130);
      const v = parseInt(signature.slice(130, 132), 16);
      
      // Recover the public key
      const publicKey = this.web3.eth.accounts.recover(
        messageHash,
        v,
        r,
        s
      );
      
      return publicKey;
    } catch (error) {
      throw new Error(`Failed to recover signer: ${error.message}`);
    }
  }

  /**
   * Create a virtual card with Privacy.com
   * @param {Object} params - Card creation parameters
   * @returns {Promise<Object>} - The created card details and its hash
   */
  async createVirtualCard(params) {
    try {
      // Generate a unique identifier for the card
      const cardNonce = crypto.randomBytes(32).toString('hex');
      
      // Create the card using Privacy.com API
      const card = await this.privacy.createCard({
        type: params.type || 'SINGLE_USE',
        spend_limit: params.spendLimit,
        memo: params.memo,
        merchant_id: params.merchantId
      });

      // Generate card hash for blockchain
      const cardHash = this.generateCardHash(card.token, cardNonce, params.spendLimit);

      // Return card details with hash
      return {
        cardId: card.token,
        last4: card.last4,
        cardHash,
        spendLimit: card.spend_limit,
        state: card.state,
        nonce: cardNonce,
        memo: card.memo
      };
    } catch (error) {
      throw new Error(`Failed to create virtual card: ${error.message}`);
    }
  }

  /**
   * Generate a deterministic hash for a virtual card
   * @param {string} cardToken - The card token from Privacy.com
   * @param {string} nonce - A unique nonce for the card
   * @param {number} spendLimit - The card's spend limit
   * @returns {string} - The card hash
   */
  generateCardHash(cardToken, nonce, spendLimit) {
    return this.web3.utils.soliditySha3(
      { t: 'string', v: cardToken },
      { t: 'string', v: nonce },
      { t: 'uint256', v: spendLimit }
    );
  }

  /**
   * Sort object keys for deterministic stringification
   * @param {Object} obj - The object to sort
   * @returns {Object} - A new object with sorted keys
   */
  sortObject(obj) {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }
    
    if (Array.isArray(obj)) {
      return obj.map(this.sortObject.bind(this));
    }
    
    return Object.keys(obj)
      .sort()
      .reduce((sorted, key) => {
        sorted[key] = this.sortObject(obj[key]);
        return sorted;
      }, {});
  }

  /**
   * Create a typed data signature (EIP-712)
   * @param {Object} data - The data to sign
   * @param {string} privateKey - The private key to sign with
   * @returns {Promise<string>} - The signature
   */
  async createTypedSignature(data, privateKey) {
    const domain = {
      name: 'Crypto Subscription System',
      version: '1',
      chainId: this.chainId,
      verifyingContract: process.env.CONTRACT_ADDRESS
    };

    const types = {
      Subscription: [
        { name: 'userId', type: 'uint256' },
        { name: 'providerId', type: 'uint256' },
        { name: 'planId', type: 'uint256' },
        { name: 'timestamp', type: 'uint256' }
      ]
    };

    const wallet = new ethers.Wallet(privateKey);
    return wallet._signTypedData(domain, types, data);
  }
}

// Export an instance with default configuration
const cryptoUtils = new CryptoUtils();

module.exports = {
  verifySignature: cryptoUtils.verifySignature.bind(cryptoUtils),
  createVirtualCard: cryptoUtils.createVirtualCard.bind(cryptoUtils),
  CryptoUtils // Export class for custom initialization
};