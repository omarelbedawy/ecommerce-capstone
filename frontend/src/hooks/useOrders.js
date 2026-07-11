import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { orderApi } from '../api/orderApi';

export function useOrder(id) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => orderApi.getById(id),
    enabled: !!id,
  });
}

export function useMyOrders() {
  return useQuery({ queryKey: ['orders', 'mine'], queryFn: orderApi.getMine });
}

export function useAllOrders() {
  return useQuery({ queryKey: ['orders', 'all'], queryFn: orderApi.getAll });
}

export function useCheckout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: orderApi.checkout,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cart'] });
      qc.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
