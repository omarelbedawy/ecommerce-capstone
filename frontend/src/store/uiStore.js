import { create } from 'zustand';

export const useUiStore = create((set) => ({
  filters: { search: '', category: '', minPrice: '', maxPrice: '', sort: '', page: 1 },
  setFilters: (partial) =>
    set((state) => ({ filters: { ...state.filters, ...partial } })),
  resetFilters: () =>
    set({ filters: { search: '', category: '', minPrice: '', maxPrice: '', sort: '', page: 1 } }),
}));
