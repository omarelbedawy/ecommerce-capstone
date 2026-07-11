import { useParams } from 'react-router-dom';
import { useOrder } from '../hooks/useOrders';

export default function OrderDetail() {
  const { id } = useParams();
  const { data: order, isLoading } = useOrder(id);

  if (isLoading) return <p className="status-msg">Loading order...</p>;
  if (!order) return <p className="status-msg">Order not found.</p>;

  return (
    <div className="order-detail-page">
      <h2>Order #{order.id}</h2>
      <p>Status: {order.status}</p>
      <p>Placed on {new Date(order.createdAt).toLocaleString()}</p>

      {order.items.map((item) => (
        <div key={item.id} className="cart-row">
          <span>{item.product.name} x{item.quantity}</span>
          <span>${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      ))}

      <div className="cart-total">Total: ${order.total.toFixed(2)}</div>
      <p className="order-confirmation-note">A confirmation email was sent to your inbox.</p>
    </div>
  );
}
