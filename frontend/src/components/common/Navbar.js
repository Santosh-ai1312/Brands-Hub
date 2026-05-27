import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiShoppingBag, FiUser, FiSearch, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/shop?keyword=${encodeURIComponent(search)}`);
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <Link to="/" className="logo" style={{ fontSize: '1.8rem' }}>
          <span className="yellow">BRANDS</span><span className="white">HUB</span>
        </Link>

        <ul className="nav-links">
          <li><Link to="/" className={isActive('/')}>Home</Link></li>
          <li><Link to="/shop" className={isActive('/shop')}>Shop</Link></li>
          <li><Link to="/shop?category=SHIRTS">Shirts</Link></li>
          <li><Link to="/shop?category=JEANS">Jeans</Link></li>
          <li><Link to="/shop?category=JACKETS">Jackets</Link></li>
          {isAdmin() && <li><Link to="/admin" style={{ color: 'var(--yellow)' }}>Admin</Link></li>}
        </ul>

        <div className="nav-actions">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text" value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..." className="search-input"
            />
            <button type="submit" className="search-btn"><FiSearch /></button>
          </form>

          {user ? (
            <>
              <Link to="/cart" className="icon-btn">
                <FiShoppingBag />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>
              <div className="dropdown">
                <button className="icon-btn"><FiUser /></button>
                <div className="dropdown-menu">
                  <Link to="/profile" className="dropdown-item">My Profile</Link>
                  <Link to="/orders" className="dropdown-item">My Orders</Link>
                  {isAdmin() && <Link to="/admin" className="dropdown-item">Admin Panel</Link>}
                  <button className="dropdown-item" onClick={logout}>Logout</button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
