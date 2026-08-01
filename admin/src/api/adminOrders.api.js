import apiClient from './client';

export const fetchOrders = async () => {
    const { data } = await apiClient.get('/admin/orders');
    return data.orders;
};

export const updateOrderStatus = async (id, status) => {
    const { data } = await apiClient.patch(`/admin/orders/${id}/status`, { status });
    return data.order;
};
