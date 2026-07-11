import axiosClient from './axiosClient';

export const orderApi = {
  checkout: () => axiosClient.post('/orders/checkout').then((r) => r.data),
  getMine: () => axiosClient.get('/orders/mine').then((r) => r.data),
  getById: (id) => axiosClient.get(`/orders/${id}`).then((r) => r.data),
  getAll: () => axiosClient.get('/orders/all').then((r) => r.data),
  updateStatus: (id, status) => axiosClient.patch(`/orders/${id}/status`, { status }).then((r) => r.data),
};
