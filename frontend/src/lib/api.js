import { axiosInstance } from '../lib/axios.js';

const signup =async (userData) => {
    console.log('Sending signup data:', userData);
    const response = await axiosInstance.post('/auth/signup', userData);
    return response.data;
  }

const getAuthUser=async () => {
    try {
      const response = await axiosInstance.get('/auth/me');
      console.log('Auth check response:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.log('Auth check failed:', error.response?.status); // Debug log
      // If the request fails (like 401 Unauthorized), return null
      if (error.response?.status === 401) {
        return { user: null };
      }
      throw error;
    }
  }

  const completeOnboarding = async (userData) => {
    const response = await axiosInstance.post("/auth/onboarding", userData);
    return response.data;
  };
export {completeOnboarding,signup,getAuthUser};
