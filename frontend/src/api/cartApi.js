import axiosClient from './axiosClient';

export const cartApi = {
  get: () => axiosClient.get('/cart').then((r) => r.data),
  add: (productId, quantity = 1) => axiosClient.post('/cart', { productId, quantity }).then((r) => r.data),
  update: (id, quantity) => axiosClient.put(`/cart/${id}`, { quantity }).then((r) => r.data),
  remove: (id) => axiosClient.delete(`/cart/${id}`),
};
