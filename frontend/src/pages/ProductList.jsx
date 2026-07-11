import { useProducts } from '../hooks/useProducts';
import { useUiStore } from '../store/uiStore';
import ProductCard from '../components/ProductCard';
import Filters from '../components/Filters';
import Pagination from '../components/Pagination';

export default function ProductList() {
  const { filters, setFilters } = useUiStore();
  const { data, isLoading, isError } = useProducts(filters);

  if (isLoading) return <p className="status-msg">Loading products...</p>;
  if (isError) return <p className="status-msg error">Couldn't load products, try refreshing.</p>;

  return (
    <div className="product-list-page">
      <Filters filters={filters} onChange={setFilters} />

      {data.data.length === 0 ? (
        <p className="status-msg">No products match your filters.</p>
      ) : (
        <div className="product-grid">
          {data.data.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      <Pagination
        page={data.page}
        totalPages={data.totalPages}
        onPageChange={(page) => setFilters({ page })}
      />
    </div>
  );
}
