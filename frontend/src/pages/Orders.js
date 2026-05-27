import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { orderAPI } from '../services/api';
import { FiPackage } from 'react-icons/fi';

const statusColors = {
  PENDING: 'badge-pending', CONFIRMED: 'badge-confirmed',
  PROCESSING: 'badge-confirmed', SHIPPED: 'badge-shipped',
  DELIVERED: 'badge-delivered', CANCELLED: 'badge-cancelled',
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getMyOrders().then(res => {
      setOrders(res.data.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 'calc(68px + 3rem)', paddingBottom: '4rem', minHeight: '100vh' }}>
        <div className="container" style={{ maxWidth: 900 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '3rem' }}>MY ORDERS</h1>
            <Link to="/shop" className="btn btn-outline">Continue Shopping</Link>
          </div>

          {loading ? <div className="spinner" /> :
           orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--muted)' }}>
              <FiPackage style={{ fontSize: '4rem', marginBottom: '1rem', display: 'block', margin: '0 auto 1rem' }} />
              <p style={{ marginBottom: '1.5rem' }}>No orders yet</p>
              <Link to="/shop" className="btn btn-primary btn-lg">Start Shopping</Link>
            </div>
          ) : (
            orders.map(order => (
              <div key={order.id} style={{ background: 'var(--gray)', marginBottom: '1rem', border: '1px solid var(--border)', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.3rem' }}>#{order.orderNumber}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span className={`badge ${statusColors[order.status]}`}>{order.status}</span>
                    <Link to={`/orders/${order.id}`} className="btn btn-secondary btn-sm">View Details</Link>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem' }}>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    {order.items?.slice(0, 3).map(item => (
                      <div key={item.id} style={{ width: 50, height: 65, background: 'var(--gray2)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        {item.productImage
                          ? <img src={item.productImage} alt={item.productName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <span style={{ fontSize: '1.2rem', color: 'rgba(255,214,0,0.1)' }}>👕</span>
                        }
                      </div>
                    ))}
                    {order.items?.length > 3 && <div style={{ display: 'flex', alignItems: 'center', color: 'var(--muted)', fontSize: '0.8rem' }}>+{order.items.length - 3} more</div>}
                  </div>
                  <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.5rem', color: 'var(--yellow)' }}>
                    ₹{(order.totalAmount + order.shippingCharge).toLocaleString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Orders;
