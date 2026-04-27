import axios, { AxiosInstance } from 'axios';
import { ClientData, OnboardingProgress, StepFormData } from '../types/index.js';

const API_URL = process.env.VITE_API_URL || 'http://localhost:5000/api';

const client: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const apiClient = {
  // Create a new client (start onboarding)
  createClient: async (email: string, company?: string, name?: string, phone?: string) => {
    const response = await client.post('/clients', { email, company, name, phone });
    return response.data;
  },

  // Get client data and progress
  getClient: async (uuid: string) => {
    const response = await client.get(`/clients/${uuid}`);
    return response.data;
  },

  // Get progress only
  getProgress: async (uuid: string) => {
    const response = await client.get(`/clients/${uuid}/progress`);
    return response.data as OnboardingProgress;
  },

  // Submit step data
  submitStep: async (uuid: string, step: number, formData: StepFormData) => {
    const response = await client.post(`/clients/${uuid}/step/${step}`, { formData });
    return response.data;
  }
};

export default apiClient;
