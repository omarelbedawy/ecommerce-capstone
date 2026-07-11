import { Link } from 'react-router-dom';
import { useCart, useUpdateCartItem, useRemoveFromCart } from '../hooks/useCart';

export default function Cart() {
  const { data: cart, isLoading } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveFromCart();

  if (isLoading) return <p className="status-msg">Loading cart...</p>;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="cart-page">
        <p className="status-msg">Your cart is empty.</p>
        <Link to="/products">Browse products</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>

      {cart.items.map((item) => (
        <div key={item.id} className="cart-row">
          <span>{item.product.name}</span>
          <input
            type="number"
            min={0}
            value={item.quantity}
            onChange={(e) => updateItem.mutate({ id: item.id, quantity: Number(e.target.value) })}
          />
          <span>${(item.product.price * item.quantity).toFixed(2)}</span>
          <button onClick={() => removeItem.mutate(item.id)}>Remove</button>
        </div>
      ))}

      <div className="cart-total">Total: ${cart.total.toFixed(2)}</div>
      <Link to="/checkout" className="btn-primary">Proceed to Checkout</Link>
    </div>
  );
}
