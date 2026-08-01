import axios from 'axios';

const AUTH_STORAGE_KEY = 'Fito_admin_auth';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

apiClient.interceptors.request.use((config) => {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    const token = raw ? JSON.parse(raw)?.token : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiClient;
