import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useCart } from '../context/CartContext';
import { FiTrash2, FiShoppingBag, FiArrowRight } from 'react-icons/fi';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();
  const items = cart?.items || [];
  const shipping = cartTotal >= 999 ? 0 : 79;
  const grandTotal = cartTotal + shipping;

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 'calc(68px + 3rem)', paddingBottom: '4rem', minHeight: '100vh' }}>
        <div className="container">
          <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '3rem', marginBottom: '2rem' }}>YOUR CART</h1>

          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--muted)' }}>
              <FiShoppingBag style={{ fontSize: '4rem', marginBottom: '1rem', display: 'block', margin: '0 auto 1rem' }} />
              <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Your cart is empty</p>
              <Link to="/shop" className="btn btn-primary btn-lg">Start Shopping</Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>

              {/* Cart Items */}
              <div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Product', 'Price', 'Quantity', 'Subtotal', ''].map(h => (
                        <th key={h} style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', padding: '0 0 1rem', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(item => (
                      <tr key={item.id}>
                        <td style={{ padding: '1.25rem 0', borderBottom: '1px solid var(--border)', verticalAlign: 'middle' }}>
                          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ width: 70, height: 90, background: 'var(--gray2)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                              {item.product.imageUrl
                                ? <img src={item.product.imageUrl} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                : <FiShoppingBag style={{ color: 'rgba(255,214,0,0.15)', fontSize: '1.5rem' }} />
                              }
                            </div>
                            <div>
                              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: '0.95rem', textTransform: 'uppercase', marginBottom: '0.3rem' }}>{item.product.name}</div>
                              <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
                                {item.selectedSize && `Size: ${item.selectedSize}`}
                                {item.selectedSize && item.selectedColor && ' | '}
                                {item.selectedColor && `Color: ${item.selectedColor}`}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '1.25rem 0', borderBottom: '1px solid var(--border)', verticalAlign: 'middle', color: 'var(--yellow)' }}>
                          ₹{item.product.price?.toLocaleString()}
                        </td>
                        <td style={{ padding: '1.25rem 0', borderBottom: '1px solid var(--border)', verticalAlign: 'middle' }}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              style={{ width: 30, height: 30, background: 'var(--gray2)', border: '1px solid var(--border)', color: 'var(--white)', cursor: 'pointer', fontSize: '1rem' }}>−</button>
                            <div style={{ width: 40, height: 30, background: 'var(--gray)', border: '1px solid var(--border)', borderLeft: 'none', borderRight: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>{item.quantity}</div>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              style={{ width: 30, height: 30, background: 'var(--gray2)', border: '1px solid var(--border)', color: 'var(--white)', cursor: 'pointer', fontSize: '1rem' }}>+</button>
                          </div>
                        </td>
                        <td style={{ padding: '1.25rem 0', borderBottom: '1px solid var(--border)', verticalAlign: 'middle', color: 'var(--yellow)', fontWeight: 600 }}>
                          ₹{(item.product.price * item.quantity).toLocaleString()}
                        </td>
                        <td style={{ padding: '1.25rem 0', borderBottom: '1px solid var(--border)', verticalAlign: 'middle' }}>
                          <button onClick={() => removeFromCart(item.id)}
                            style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '1.1rem', transition: 'color 0.2s' }}
                            onMouseEnter={e => e.target.style.color = 'var(--error)'}
                            onMouseLeave={e => e.target.style.color = 'var(--muted)'}>
                            <FiTrash2 />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ marginTop: '1.5rem' }}>
                  <Link to="/shop" style={{ color: 'var(--muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>← Continue Shopping</Link>
                </div>
              </div>

              {/* Summary */}
              <div style={{ background: 'var(--gray)', padding: '1.75rem', position: 'sticky', top: 88 }}>
                <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.5rem', marginBottom: '1.5rem' }}>ORDER SUMMARY</h3>
                {[
                  { label: 'Subtotal', value: `₹${cartTotal.toLocaleString()}` },
                  { label: 'Shipping', value: shipping === 0 ? 'FREE' : `₹${shipping}` },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--muted)' }}>{row.label}</span>
                    <span style={{ color: row.value === 'FREE' ? 'var(--success)' : 'var(--white)' }}>{row.value}</span>
                  </div>
                ))}
                {shipping > 0 && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: '1rem' }}>
                    Add ₹{(999 - cartTotal).toLocaleString()} more for free shipping
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '0.5rem', marginBottom: '1.25rem' }}>
                  <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total</span>
                  <span style={{ color: 'var(--yellow)', fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.4rem' }}>₹{grandTotal.toLocaleString()}</span>
                </div>
                <button className="btn btn-primary btn-full btn-lg" onClick={() => navigate('/checkout')}>
                  Proceed to Checkout <FiArrowRight />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Cart;
