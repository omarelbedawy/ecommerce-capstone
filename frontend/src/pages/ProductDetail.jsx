import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useProduct } from '../hooks/useProducts';
import { useAddToCart } from '../hooks/useCart';
import { useAuthStore } from '../store/authStore';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading } = useProduct(id);
  const addToCart = useAddToCart();
  const user = useAuthStore((s) => s.user);
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState('');

  if (isLoading) return <p className="status-msg">Loading...</p>;
  if (!product) return <p className="status-msg">Product not found.</p>;

  function handleAdd() {
    if (!user) {
      navigate('/login');
      return;
    }

    addToCart.mutate(
      { productId: product.id, quantity: qty },
      {
        onSuccess: () => setMessage('Added to cart!'),
        onError: (err) => setMessage(err.response?.data?.message || 'Could not add to cart'),
      }
    );
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail-img">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} />
        ) : (
          <div className="product-card-placeholder">No image</div>
        )}
      </div>

      <div className="product-detail-info">
        <h2>{product.name}</h2>
        <p className="product-card-category">{product.category?.name}</p>
        <p className="product-detail-price">${product.price.toFixed(2)}</p>
        <p>{product.description}</p>
        <p>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>

        {product.stock > 0 && (
          <div className="add-to-cart-row">
            <input
              type="number"
              min={1}
              max={product.stock}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
            />
            <button onClick={handleAdd} disabled={addToCart.isPending}>
              {addToCart.isPending ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        )}

        {message && <p className="form-msg">{message}</p>}
      </div>
    </div>
  );
}
