import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Get overall statistics
  getOverview: async () => {
    const response = await api.get('/overview');
    return response.data;
  },

  // Get facility analytics
  getFacilityAnalytics: async (facility: string) => {
    const response = await api.get(`/facilities/${facility}`);
    return response.data;
  },

  // Get all departments
  getDepartments: async () => {
    const response = await api.get('/departments');
    return response.data;
  },

  // Get department analytics
  getDepartmentAnalytics: async (department: string) => {
    const response = await api.get(`/departments/${department}`);
    return response.data;
  },

  // Get student details
  getStudent: async (id: string) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },

  // Get filtered students
  getStudents: async (filters?: {
    department?: string;
    year?: string;
    riskLevel?: string;
    needsImprovement?: boolean;
    minSatisfaction?: number;
    maxSatisfaction?: number;
  }) => {
    const response = await api.get('/students', { params: filters });
    return response.data;
  },

  // Get risk analysis
  getRiskAnalysis: async () => {
    const response = await api.get('/risk-analysis');
    return response.data;
  },

  // Get trends
  getTrends: async () => {
    const response = await api.get('/trends');
    return response.data;
  },

  // Get all data
  getAllData: async () => {
    const response = await api.get('/data');
    return response.data;
  },
};

export default api;
