import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <div className="admin-links">
        <Link to="/admin/products" className="btn-primary">Manage Products</Link>
        <Link to="/admin/orders" className="btn-primary">Manage Orders</Link>
      </div>
    </div>
  );
}
