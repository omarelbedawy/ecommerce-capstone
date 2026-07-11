import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCart } from '../hooks/useCart';
import '../styles/Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { data: cart } = useCart();

  const itemCount = cart?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">ShopNow</Link>

      <div className="navbar-links">
        <Link to="/products">Products</Link>

        {user ? (
          <>
            <Link to="/cart">Cart ({itemCount})</Link>
            <Link to="/orders">My Orders</Link>
            {user.role === 'ADMIN' && <Link to="/admin">Admin</Link>}
            <span className="navbar-user">Hi, {user.name}</span>
            <button onClick={handleLogout} className="btn-link">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
