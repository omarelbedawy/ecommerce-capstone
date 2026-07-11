import { Link } from 'react-router-dom';
import { useMyOrders } from '../hooks/useOrders';

export default function OrderHistory() {
  const { data: orders, isLoading } = useMyOrders();

  if (isLoading) return <p className="status-msg">Loading orders...</p>;
  if (!orders || orders.length === 0) return <p className="status-msg">No orders yet.</p>;

  return (
    <div className="order-history-page">
      <h2>My Orders</h2>
      {orders.map((order) => (
        <Link to={`/orders/${order.id}`} key={order.id} className="order-row">
          <span>Order #{order.id}</span>
          <span>{order.status}</span>
          <span>${order.total.toFixed(2)}</span>
          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
        </Link>
      ))}
    </div>
  );
}
