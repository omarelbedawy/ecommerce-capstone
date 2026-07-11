import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useProducts, useCategories } from '../../hooks/useProducts';
import { useUiStore } from '../../store/uiStore';
import { productApi } from '../../api/productApi';

export default function AdminProducts() {
  const { filters, setFilters } = useUiStore();
  const { data, isLoading } = useProducts(filters);
  const { data: categories } = useCategories();
  const qc = useQueryClient();

  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '', categoryId: '', image: null });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  function handleChange(e) {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  }

  function resetForm() {
    setForm({ name: '', description: '', price: '', stock: '', categoryId: '', image: null });
    setEditingId(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');

    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('description', form.description);
    fd.append('price', form.price);
    fd.append('stock', form.stock);
    fd.append('categoryId', form.categoryId);
    if (form.image) fd.append('image', form.image);

    try {
      if (editingId) {
        await productApi.update(editingId, fd);
        setMessage('Product updated');
      } else {
        await productApi.create(fd);
        setMessage('Product created');
      }
      qc.invalidateQueries({ queryKey: ['products'] });
      resetForm();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong');
    }
  }

  function startEdit(product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
      image: null,
    });
  }

  async function handleDelete(id) {
    if (!confirm('Delete this product?')) return;
    await productApi.remove(id);
    qc.invalidateQueries({ queryKey: ['products'] });
  }

  return (
    <div className="admin-products-page">
      <h2>Manage Products</h2>

      <form onSubmit={handleSubmit} className="admin-product-form">
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <input name="price" type="number" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} required />
        <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} required />
        <select name="categoryId" value={form.categoryId} onChange={handleChange} required>
          <option value="">Select category</option>
          {categories?.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <input name="image" type="file" accept="image/*" onChange={handleChange} />
        <button type="submit">{editingId ? 'Update Product' : 'Create Product'}</button>
        {editingId && <button type="button" onClick={resetForm}>Cancel</button>}
      </form>

      {message && <p className="form-msg">{message}</p>}

      {isLoading ? (
        <p className="status-msg">Loading...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr><th>Name</th><th>Price</th><th>Stock</th><th>Category</th><th></th></tr>
          </thead>
          <tbody>
            {data.data.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>${p.price.toFixed(2)}</td>
                <td>{p.stock}</td>
                <td>{p.category?.name}</td>
                <td>
                  <button onClick={() => startEdit(p)}>Edit</button>
                  <button onClick={() => handleDelete(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
