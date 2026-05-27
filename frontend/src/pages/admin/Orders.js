import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

const statusColors = {
  PENDING: 'badge-pending', CONFIRMED: 'badge-confirmed',
  PROCESSING: 'badge-confirmed', SHIPPED: 'badge-shipped',
  DELIVERED: 'badge-delivered', CANCELLED: 'badge-cancelled',
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selected, setSelected] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  useEffect(() => {
    adminAPI.getOrders({ page, size: 15 }).then(res => {
      setOrders(res.data.data?.content || []);
      setTotalPages(res.data.data?.totalPages || 0);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [page]);

  const handleUpdateStatus = async (orderId) => {
    if (!newStatus) return;
    try {
      await adminAPI.updateOrderStatus(orderId, newStatus);
      toast.success('Status updated!');
      setSelected(null);
      const res = await adminAPI.getOrders({ page, size: 15 });
      setOrders(res.data.data?.content || []);
    } catch { toast.error('Failed to update'); }
  };

  return (
    <AdminLayout title="Orders">
      {loading ? <div className="spinner" /> : (
        <div style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.04)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>{['Order #', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Action'].map(h => (
                <th key={h} style={{ background: '#111', fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#555', padding: '0.85rem 1.25rem', textAlign: 'left' }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: '#555' }}>No orders yet</td></tr>
              ) : orders.map(order => (
                <React.Fragment key={order.id}>
                  <tr style={{ background: selected === order.id ? 'rgba(255,214,0,0.02)' : 'transparent' }}>
                    <td style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.85rem' }}><strong>{order.orderNumber}</strong></td>
                    <td style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.85rem' }}>
                      <div>{order.user?.fullName}</div>
                      <div style={{ color: '#555', fontSize: '0.75rem' }}>{order.user?.email}</div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.85rem', color: 'rgba(245,245,240,0.6)' }}>{order.items?.length}</td>
                    <td style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.03)', color: 'var(--yellow)', fontSize: '0.9rem' }}>₹{(order.totalAmount + order.shippingCharge).toLocaleString()}</td>
                    <td style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <span className={`badge ${order.paymentStatus === 'PAID' ? 'badge-paid' : 'badge-pending'}`}>{order.paymentStatus}</span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <span className={`badge ${statusColors[order.status]}`}>{order.status}</span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.8rem', color: '#555' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <button onClick={() => { setSelected(selected === order.id ? null : order.id); setNewStatus(order.status); }}
                        style={{ background: '#242424', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(245,245,240,0.7)', padding: '0.35rem 0.75rem', fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>
                        Update
                      </button>
                    </td>
                  </tr>
                  {selected === order.id && (
                    <tr>
                      <td colSpan={8} style={{ padding: '1rem 1.25rem', background: 'rgba(255,214,0,0.03)', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)' }}>Update Status:</span>
                          <select value={newStatus} onChange={e => setNewStatus(e.target.value)}
                            style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--white)', padding: '0.5rem 0.75rem', fontFamily: "'Barlow',sans-serif", fontSize: '0.85rem' }}>
                            {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <button className="btn btn-primary btn-sm" onClick={() => handleUpdateStatus(order.id)}>Apply</button>
                          <button className="btn btn-secondary btn-sm" onClick={() => setSelected(null)}>Cancel</button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="pagination" style={{ padding: '1rem 1.5rem' }}>
              {[...Array(totalPages)].map((_, i) => <button key={i} className={page === i ? 'active' : ''} onClick={() => setPage(i)}>{i + 1}</button>)}
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export default Orders;
