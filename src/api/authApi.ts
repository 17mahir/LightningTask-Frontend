import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_AUTH_URL || 'http://localhost:5000/api/auth'
});

export const signupUser = (formData: any) => API.post('/signup', formData);
export const loginUser = (formData: any) => API.post('/login', formData);
export const forgotPassword = (data: any) => API.post('/forgot-password', data);
export const verifyOtp = (data: any) => API.post('/verify-otp', data);
export const resetPassword = (data: any) => API.post('/reset-password', data);