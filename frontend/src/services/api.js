import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL
});

api.interceptors.request.use((config) => {
  const user = localStorage.getItem('user');
  if (user) {
    const { token } = JSON.parse(user);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const jobAPI = {
  getAllJobs: (params) => api.get('/jobs', { params }),
  getJobById: (id) => api.get(`/jobs/${id}`),
  createJob: (jobData) => api.post('/jobs', jobData),
  updateJob: (id, jobData) => api.put(`/jobs/${id}`, jobData),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  getRecruiterJobs: () => api.get('/jobs/my-jobs'),
  getJobApplications: (id) => api.get(`/jobs/${id}/applications`)
};

export const applicationAPI = {
  createApplication: (formData) => api.post('/applications', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getCandidateApplications: () => api.get('/applications/my-applications'),
  getApplicationById: (id) => api.get(`/applications/${id}`),
  updateApplicationStatus: (id, status, notes) =>
    api.put(`/applications/${id}/status`, { status, notes }),
  getRecommendedJobs: () => api.get('/applications/recommendations')
};

export const interviewAPI = {
  scheduleInterview: (data) => api.post('/interviews/schedule', data),
  getInterviewById: (id) => api.get(`/interviews/${id}`),
  getRecruiterInterviews: () => api.get('/interviews/recruiter-interviews'),
  getCandidateInterviews: () => api.get('/interviews/candidate-interviews'),
  updateInterviewStatus: (id, data) => api.put(`/interviews/${id}/status`, data),
  regenerateQuestions: (id) => api.post(`/interviews/${id}/regenerate-questions`)
};

export default api;
