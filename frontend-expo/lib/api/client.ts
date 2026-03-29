import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.100.171:5000', // Update to your local IP address for physical devices
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add bearer token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token && config.headers) {  
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // Ignore error
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - can clear token or logout
      await AsyncStorage.removeItem('token');
      // Expo Router redirect could be used here if outside React lifecycle using a singleton store/event
    }
    return Promise.reject(error);
  }
);

export default apiClient;