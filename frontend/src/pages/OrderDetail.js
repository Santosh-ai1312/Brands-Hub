import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { orderAPI } from '../services/api';

const statusColors = {
  PENDING: 'badge-pending', CONFIRMED: 'badge-confirmed',
  SHIPPED: 'badge-shipped', DELIVERED: 'badge-delivered', CANCELLED: 'badge-cancelled',
};

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getOrder(id).then(res => setOrder(res.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <><Navbar /><div className="spinner" style={{ marginTop: 200 }} /></>;
  if (!order) return <><Navbar /><div style={{ textAlign: 'center', marginTop: 200, color: 'var(--muted)' }}>Order not found</div></>;

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 'calc(68px + 3rem)', paddingBottom: '4rem', minHeight: '100vh' }}>
        <div className="container" style={{ maxWidth: 900 }}>

          {/* Success banner */}
          {window.location.search.includes('success') && (
            <div className="alert alert-success" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              ✅ <div><strong>Order Placed Successfully!</strong><div style={{ fontSize: '0.85rem', marginTop: '0.2rem' }}>Thank you for shopping with BRANDS HUB!</div></div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '2.5rem' }}>ORDER DETAILS</h1>
              <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>#{order.orderNumber} · {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
            </div>
            <span className={`badge ${statusColors[order.status]}`} style={{ fontSize: '0.85rem', padding: '0.4rem 1rem' }}>{order.status}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start' }}>
            <div>
              {/* Items */}
              <div style={{ background: 'var(--gray)', padding: '1.5rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.3rem', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                  ITEMS ({order.items?.length})
                </h3>
                {order.items?.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: '1rem', padding: '1rem 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ width: 65, height: 85, background: 'var(--gray2)', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {item.productImage ? <img src={item.productImage} alt={item.productName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span>👕</span>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.3rem' }}>{item.productName}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
                        {item.selectedSize && `Size: ${item.selectedSize}`} {item.selectedColor && `| Color: ${item.selectedColor}`} | Qty: {item.quantity}
                      </div>
                    </div>
                    <div style={{ color: 'var(--yellow)', fontWeight: 600 }}>₹{(item.unitPrice * item.quantity).toLocaleString()}</div>
                  </div>
                ))}
              </div>

              {/* Shipping */}
              <div style={{ background: 'var(--gray)', padding: '1.5rem' }}>
                <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.3rem', marginBottom: '1rem' }}>SHIPPING ADDRESS</h3>
                <div style={{ color: 'rgba(245,245,240,0.7)', lineHeight: 1.8 }}>
                  <strong>{order.shippingName}</strong><br />
                  {order.shippingAddress}<br />
                  {order.shippingCity} – {order.shippingPincode}<br />
                  📞 {order.shippingPhone}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div style={{ background: 'var(--gray)', padding: '1.5rem', position: 'sticky', top: 88 }}>
              <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.3rem', marginBottom: '1.5rem' }}>PAYMENT SUMMARY</h3>
              {[
                { label: 'Subtotal', value: `₹${order.totalAmount?.toLocaleString()}` },
                { label: 'Shipping', value: order.shippingCharge === 0 ? 'FREE' : `₹${order.shippingCharge}` },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--muted)' }}>{row.label}</span>
                  <span>{row.value}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
                <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700 }}>Total</span>
                <span style={{ color: 'var(--yellow)', fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.3rem' }}>₹{(order.totalAmount + order.shippingCharge).toLocaleString()}</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                <div>Payment: <span style={{ color: 'var(--white)' }}>{order.paymentMethod}</span></div>
                <div style={{ marginTop: '0.3rem' }}>Status: <span className={`badge ${order.paymentStatus === 'PAID' ? 'badge-paid' : 'badge-pending'}`}>{order.paymentStatus}</span></div>
              </div>
              <Link to="/orders" className="btn btn-secondary btn-full" style={{ marginTop: '1.5rem' }}>← All Orders</Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default OrderDetail;
