// userService.js
import axios from 'axios';

const BASE_URL = 'https://67ac71475853dfff53dab929.mockapi.io/api/v1/users';

export const fetchUserByUsername = async (username) => {
  try {
    const response = await axios.get(`${BASE_URL}?username=${username}`);
    return response.data[0]; // Returns the first user matching the username (MockAPI returns an array for queries)
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching user by username');
  }
};

export const fetchUserById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data; // Returns the user object (MockAPI returns a single object for ID-based requests)
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching user by ID');
  }
};