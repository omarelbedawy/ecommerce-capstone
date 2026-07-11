import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '../api/cartApi';
import { useAuthStore } from '../store/authStore';

export function useCart() {
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: ['cart'],
    queryFn: cartApi.get,
    enabled: !!user, // guests don't have a cart on the server, skip the request
  });
}

export function useAddToCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, quantity }) => cartApi.add(productId, quantity),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cart'] }),
  });
}

export function useUpdateCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, quantity }) => cartApi.update(id, quantity),
    // optimistic update so the UI feels instant instead of waiting on the server
    onMutate: async ({ id, quantity }) => {
      await qc.cancelQueries({ queryKey: ['cart'] });
      const previous = qc.getQueryData(['cart']);

      qc.setQueryData(['cart'], (old) => {
        if (!old) return old;
        const items = old.items.map((i) => (i.id === id ? { ...i, quantity } : i));
        return { ...old, items };
      });

      return { previous };
    },
    onError: (err, vars, context) => {
      if (context?.previous) qc.setQueryData(['cart'], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['cart'] }),
  });
}

export function useRemoveFromCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => cartApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cart'] }),
  });
}
