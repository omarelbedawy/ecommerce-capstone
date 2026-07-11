import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="home-page">
      <h1>Welcome to ShopNow</h1>
      <p>Everything you need, all in one place.</p>
      <Link to="/products" className="btn-primary">Browse Products</Link>
    </div>
  );
}
