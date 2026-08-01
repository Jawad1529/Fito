import apiClient from './client';

export const fetchAppUsers = async () => {
    const { data } = await apiClient.get('/admin/users');
    return data.users;
};

export const updateAppUserStatus = async (id, status) => {
    const { data } = await apiClient.patch(`/admin/users/${id}/status`, { status });
    return data.user;
};
