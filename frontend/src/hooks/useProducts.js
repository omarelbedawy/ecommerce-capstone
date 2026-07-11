import { useQuery } from '@tanstack/react-query';
import { productApi, categoryApi } from '../api/productApi';

export function useProducts(filters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productApi.getAll(filters),
    keepPreviousData: true, // avoids flicker when paging
  });
}

export function useProduct(id) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getById(id),
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: categoryApi.getAll,
    staleTime: 1000 * 60 * 10, // categories barely change, cache for 10 min
  });
}
