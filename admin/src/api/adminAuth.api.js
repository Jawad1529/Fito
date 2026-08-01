import apiClient from './client';

export const loginAdmin = async (email, password) => {
    const { data } = await apiClient.post('/admin/auth/login', { email, password });
    return data.admin ? { ...data.admin, token: data.token } : null;
};
