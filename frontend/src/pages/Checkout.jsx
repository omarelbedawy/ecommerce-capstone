import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useCheckout } from '../hooks/useOrders';
import { useState } from 'react';

export default function Checkout() {
  const { data: cart } = useCart();
  const checkout = useCheckout();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  function handleConfirm() {
    setError('');
    checkout.mutate(undefined, {
      onSuccess: (order) => navigate(`/orders/${order.id}`),
      onError: (err) => setError(err.response?.data?.message || 'Checkout failed'),
    });
  }

  if (!cart || cart.items.length === 0) {
    return <p className="status-msg">Nothing to check out.</p>;
  }

  return (
    <div className="checkout-page">
      <h2>Confirm Your Order</h2>

      {cart.items.map((item) => (
        <div key={item.id} className="cart-row">
          <span>{item.product.name} x{item.quantity}</span>
          <span>${(item.product.price * item.quantity).toFixed(2)}</span>
        </div>
      ))}

      <div className="cart-total">Total: ${cart.total.toFixed(2)}</div>

      {error && <p className="form-error">{error}</p>}

      <button onClick={handleConfirm} disabled={checkout.isPending} className="btn-primary">
        {checkout.isPending ? 'Placing order...' : 'Place Order'}
      </button>
    </div>
  );
}
