import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_ADMIN_URL || 'http://localhost:5000/api/admin'
});

export const fetchAllTasks = (token: string) =>
  API.get('/tasks', { headers: { Authorization: `Bearer ${token}` } });

export const fetchPendingUsers = (token: string) =>
  API.get('/pending-users', { headers: { Authorization: `Bearer ${token}` } });

export const approveUser = (id: string, token: string) =>
  API.put(`/approve-user/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });

export const rejectUser = (id: string, token: string) =>
  API.put(`/reject-user/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });

export const fetchApprovedUsers = (token: string) =>
  API.get('/approved-users', { headers: { Authorization: `Bearer ${token}` } });

export const createTask = (data: any, token: string) =>
  API.post('/create-task', data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateTask = (id: string, data: any, token: string) =>
  API.put(`/update-task/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });