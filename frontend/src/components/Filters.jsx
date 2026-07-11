import { useCategories } from '../hooks/useProducts';

export default function Filters({ filters, onChange }) {
  const { data: categories } = useCategories();

  function update(partial) {
    onChange({ ...partial, page: 1 }); // any filter change resets to page 1
  }

  return (
    <div className="filters-bar">
      <input
        type="text"
        placeholder="Search products..."
        value={filters.search}
        onChange={(e) => update({ search: e.target.value })}
      />

      <select value={filters.category} onChange={(e) => update({ category: e.target.value })}>
        <option value="">All categories</option>
        {categories?.map((c) => (
          <option key={c.id} value={c.name}>{c.name}</option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Min price"
        value={filters.minPrice}
        onChange={(e) => update({ minPrice: e.target.value })}
      />

      <input
        type="number"
        placeholder="Max price"
        value={filters.maxPrice}
        onChange={(e) => update({ maxPrice: e.target.value })}
      />

      <select value={filters.sort} onChange={(e) => update({ sort: e.target.value })}>
        <option value="">Newest</option>
        <option value="price_asc">Price: low to high</option>
        <option value="price_desc">Price: high to low</option>
        <option value="name_asc">Name: A-Z</option>
      </select>
    </div>
  );
}
