import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminAPI } from '../../services/api';
import { FiBox, FiShoppingBag, FiClock, FiUsers } from 'react-icons/fi';

const statusColors = {
  PENDING: 'badge-pending', CONFIRMED: 'badge-confirmed',
  SHIPPED: 'badge-shipped', DELIVERED: 'badge-delivered', CANCELLED: 'badge-cancelled',
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getDashboard().then(res => setStats(res.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: 'Total Products', value: stats.totalProducts, icon: <FiBox />, color: 'rgba(255,214,0,0.12)', iconColor: 'var(--yellow)' },
    { label: 'Total Orders', value: stats.totalOrders, icon: <FiShoppingBag />, color: 'rgba(76,175,80,0.12)', iconColor: '#4caf50' },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: <FiClock />, color: 'rgba(255,152,0,0.12)', iconColor: '#ff9800' },
    { label: 'Customers', value: stats.totalUsers, icon: <FiUsers />, color: 'rgba(33,150,243,0.12)', iconColor: '#2196f3' },
  ] : [];

  return (
    <AdminLayout title="Dashboard">
      {loading ? <div className="spinner" /> : (
        <>
          {/* Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.25rem', marginBottom: '1.25rem' }}>
            {statCards.map(card => (
              <div key={card.label} style={{ background: '#161616', padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', border: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ width: 48, height: 48, background: card.color, color: card.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                  {card.icon}
                </div>
                <div>
                  <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '2rem', lineHeight: 1 }}>{card.value}</div>
                  <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#555', marginTop: '0.2rem' }}>{card.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Revenue */}
          <div style={{ background: 'linear-gradient(135deg,#1a1400,#0d0d0d)', border: '1px solid rgba(255,214,0,0.2)', padding: '2rem', marginBottom: '1.25rem' }}>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,214,0,0.6)', marginBottom: '0.5rem' }}>Total Revenue (Paid Orders)</div>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '3rem', color: 'var(--yellow)' }}>₹{Number(stats?.totalRevenue || 0).toLocaleString()}</div>
          </div>

          {/* Recent Orders */}
          <div style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <h3 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '1rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Recent Orders</h3>
              <Link to="/admin/orders" style={{ background: 'var(--yellow)', color: 'var(--black)', padding: '0.35rem 0.8rem', fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>View All</Link>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Order #', 'Customer', 'Amount', 'Status', 'Date', 'Action'].map(h => (
                    <th key={h} style={{ background: '#111', fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#555', padding: '0.85rem 1.5rem', textAlign: 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats?.recentOrders?.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#555' }}>No orders yet</td></tr>
                ) : stats?.recentOrders?.map(order => (
                  <tr key={order.id}>
                    <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.88rem', color: 'rgba(245,245,240,0.75)' }}><strong>{order.orderNumber}</strong></td>
                    <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.88rem', color: 'rgba(245,245,240,0.75)' }}>{order.user?.fullName}</td>
                    <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.88rem', color: 'rgba(245,245,240,0.75)' }}>₹{(order.totalAmount + order.shippingCharge).toLocaleString()}</td>
                    <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.03)' }}><span className={`badge ${statusColors[order.status]}`}>{order.status}</span></td>
                    <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.88rem', color: '#555' }}>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                    <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <Link to={`/admin/orders`} style={{ background: '#242424', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(245,245,240,0.7)', padding: '0.35rem 0.75rem', fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default Dashboard;
