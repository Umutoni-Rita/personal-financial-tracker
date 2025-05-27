import axios from 'axios';

const BASE_URL = 'https://67ac71475853dfff53dab929.mockapi.io/api/v1/users';

export const fetchUserByUsername = async (username) => {
  try {
    const response = await axios.get(`${BASE_URL}?username=${username}`);
    return response.data[0]; // returns first user with that username
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching username');
  }
};
export const fetchUserById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data[0]; // returns first user with that username
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching user id');
  }
};
