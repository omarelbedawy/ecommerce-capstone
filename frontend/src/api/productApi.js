import axiosClient from './axiosClient';

export const productApi = {
  getAll: (params) => axiosClient.get('/products', { params }).then((r) => r.data),
  getById: (id) => axiosClient.get(`/products/${id}`).then((r) => r.data),
  create: (formData) =>
    axiosClient
      .post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data),
  update: (id, formData) =>
    axiosClient
      .put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data),
  remove: (id) => axiosClient.delete(`/products/${id}`),
};

export const categoryApi = {
  getAll: () => axiosClient.get('/categories').then((r) => r.data),
};
