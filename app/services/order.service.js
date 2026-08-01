import apiClient from './api';

export const createOrder = async (orderPayload) => {
  const { data } = await apiClient.post('/orders', orderPayload);
  return data.order;
};

export const getMyOrders = async () => {
  const { data } = await apiClient.get('/orders/my');
  return data.orders;
};
