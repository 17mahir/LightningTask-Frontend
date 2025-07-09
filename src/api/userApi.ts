import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_USER_URL || 'http://localhost:5000/api/user',
});

export const fetchUserTasks = (token: string) =>
  API.get('/tasks', { headers: { Authorization: `Bearer ${token}` } });

export const updateTaskStatus = (id: string, status: string, token: string) =>
  API.put(`/tasks-status/${id}`, { status }, { headers: { Authorization: `Bearer ${token}` } });