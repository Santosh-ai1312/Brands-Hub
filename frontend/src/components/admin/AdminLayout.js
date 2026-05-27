import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiGrid, FiPackage, FiShoppingBag, FiUsers, FiLogOut, FiExternalLink } from 'react-icons/fi';

const AdminLayout = ({ children, title }) => {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: <FiGrid /> },
    { path: '/admin/products', label: 'Products', icon: <FiPackage /> },
    { path: '/admin/orders', label: 'Orders', icon: <FiShoppingBag /> },
    { path: '/admin/users', label: 'Customers', icon: <FiUsers /> },
  ];

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: '100vh', background: '#0d0d0d' }}>

      {/* Sidebar */}
      <aside style={{ background: '#111', borderRight: '1px solid rgba(255,214,0,0.08)', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,214,0,0.08)' }}>
          <Link to="/" className="logo" style={{ fontSize: '1.5rem' }}>
            <span style={{ color: 'var(--yellow)' }}>BRANDS</span><span>HUB</span>
          </Link>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#444', marginTop: '0.25rem' }}>Admin Panel</div>
        </div>
        <nav style={{ padding: '1rem 0', flex: 1 }}>
          {navItems.map(item => (
            <Link key={item.path} to={item.path}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1.5rem', fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: location.pathname === item.path ? 'var(--yellow)' : 'rgba(245,245,240,0.45)', background: location.pathname === item.path ? 'rgba(255,214,0,0.05)' : 'transparent', borderLeft: location.pathname === item.path ? '3px solid var(--yellow)' : '3px solid transparent', transition: 'all 0.2s' }}>
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>
        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(245,245,240,0.4)', marginBottom: '0.5rem' }}>
            <FiExternalLink /> View Store
          </Link>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#f44336', background: 'transparent', border: 'none', cursor: 'pointer', width: '100%' }}>
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ padding: '2rem 2.5rem', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '2.5rem' }}>{title}</h1>
          <span style={{ color: '#444', fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.8rem', letterSpacing: '0.1em' }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
