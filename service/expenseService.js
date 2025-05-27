
import axios from 'axios';

const BASE_URL = 'https://67ac71475853dfff53dab929.mockapi.io/api/v1/expenses';

export const createExpense = async (expenseData) => {
  try {
    if (!expenseData.name || !expenseData.amount || !expenseData.description) {
      throw new Error('All fields (name, amount, description) are required');
    }
    if (isNaN(expenseData.amount) || Number(expenseData.amount) <= 0) {
      throw new Error('Amount must be a valid positive number');
    }
    const response = await axios.post(BASE_URL, expenseData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create expense');
  }
};

export const getExpenses = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch expenses');
  }
};

export const getExpenseById = async (expenseId) => {
  try {
    if (!expenseId) {
      throw new Error('Expense ID is required');
    }
    const response = await axios.get(`${BASE_URL}/${expenseId}`); // Fixed template literal
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch expense');
  }
};

export const deleteExpense = async (expenseId) => {
  try {
    if (!expenseId) {
      throw new Error('Expense ID is required');
    }
    const response = await axios.delete(`${BASE_URL}/${expenseId}`); // Fixed template literal
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete expense');
  }
};