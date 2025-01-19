import axios from 'axios';

const API_BASE_URL = 'http://localhost:5432/api'; // Update to match your backend URL

export const fetchStats = async () => {
    const response = await axios.get(`${API_BASE_URL}/stats`);
    return response.data;
};

export const fetchTransactions = async () => {
    const response = await axios.get(`${API_BASE_URL}/transactions`);
    return response.data;
};

export const createTransaction = async (transactionData) => {
    const response = await axios.post(`${API_BASE_URL}/transactions/new`, transactionData);
    return response.data;
};
