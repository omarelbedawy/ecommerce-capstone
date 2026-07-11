import { useQueryClient } from '@tanstack/react-query';
import { useAllOrders } from '../../hooks/useOrders';
import { orderApi } from '../../api/orderApi';

const STATUSES = ['PENDING', 'PAID', 'SHIPPED', 'CANCELLED'];

export default function AdminOrders() {
  const { data: orders, isLoading } = useAllOrders();
  const qc = useQueryClient();

  async function handleStatusChange(id, status) {
    await orderApi.updateStatus(id, status);
    qc.invalidateQueries({ queryKey: ['orders'] });
  }

  if (isLoading) return <p className="status-msg">Loading orders...</p>;

  return (
    <div className="admin-orders-page">
      <h2>All Orders</h2>
      <table className="admin-table">
        <thead>
          <tr><th>ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>#{order.id}</td>
              <td>{order.user?.name} ({order.user?.email})</td>
              <td>${order.total.toFixed(2)}</td>
              <td>
                <select value={order.status} onChange={(e) => handleStatusChange(order.id, e.target.value)}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
