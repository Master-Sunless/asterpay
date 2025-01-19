const axios = require('axios');

/**
 * Converts USDT to USD using a conversion API (e.g., Paxos).
 * @param {number} usdtAmount - Amount in USDT to convert.
 * @returns {Promise<number>} - Converted amount in USD.
 */
async function convertUSDTtoUSD(usdtAmount) {
    try {
        const response = await axios.get('https://api.paxos.com/v2/prices/usdtusd'); // Replace with actual API URL
        const rate = response.data.data.rate;
        console.log(`USDT to USD rate: ${rate}`);
        return usdtAmount * rate;
    } catch (error) {
        console.error('Error fetching USDT to USD conversion rate:', error.message);
        throw new Error('Conversion service unavailable.');
    }
}

module.exports = { convertUSDTtoUSD };
