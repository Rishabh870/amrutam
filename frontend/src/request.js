import axios from "axios";

const API_BASE_URL = "http://localhost:5000"; // Replace with your actual backend URL

// Generic function to make an HTTP request
export const request = async (method, url, data = null) => {
  try {
    const token = localStorage.getItem("userToken");

    // const token = localStorage.getItem("user"); // Get the token from local storage
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await axios({
      method,
      url: `${API_BASE_URL}/${url}`,
      data,
      headers,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
