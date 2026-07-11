import { Link } from 'react-router-dom';
import '../styles/ProductCard.css';

export default function ProductCard({ product }) {
  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`}>
        <div className="product-card-img">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} />
          ) : (
            <div className="product-card-placeholder">No image</div>
          )}
        </div>
        <h3>{product.name}</h3>
      </Link>
      <p className="product-card-category">{product.category?.name}</p>
      <p className="product-card-price">${product.price.toFixed(2)}</p>
      {product.stock === 0 && <p className="product-card-oos">Out of stock</p>}
    </div>
  );
}
