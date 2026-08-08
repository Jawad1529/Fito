import apiClient from './client';

export const loginAdmin = async (email, password) => {
    const { data } = await apiClient.post('/admin/auth/login', { email, password });
    return data.admin ? { ...data.admin, token: data.token } : null;
};

export const signupAdmin = async ({ name, email, password }) => {
    const { data } = await apiClient.post('/admin/auth/signup', { name, email, password });
    return data;
};

export const fetchAdmins = async () => {
    const { data } = await apiClient.get('/admin/auth');
    return data.admins;
};

export const updateAdminStatus = async (id, status) => {
    const { data } = await apiClient.patch(`/admin/auth/${id}/status`, { status });
    return data.admin;
};
