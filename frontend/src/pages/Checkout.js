import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import toast from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('RAZORPAY');

  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
  });

  const items = cart?.items || [];
  const shipping = cartTotal >= 999 ? 0 : 79;
  const grandTotal = cartTotal + shipping;

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const loadRazorpayScript = () => {
    return new Promise(resolve => {
      if (window.Razorpay) { resolve(true); return; }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async (orderData) => {
    const loaded = await loadRazorpayScript();
    if (!loaded) { toast.error('Razorpay SDK failed to load'); return; }

    const options = {
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'BRANDS HUB',
      description: `Order #${orderData.order.orderNumber}`,
      order_id: orderData.razorpayOrderId,
  handler: async (response) => {

  console.log("FULL RAZORPAY RESPONSE:", response);

  console.log("ORDER ID:", response.razorpay_order_id);

  console.log("PAYMENT ID:", response.razorpay_payment_id);

  console.log("SIGNATURE:", response.razorpay_signature);

  try {

    const verifyPayload = {
      razorpayOrderId: response.razorpay_order_id,
      razorpayPaymentId: response.razorpay_payment_id,
      razorpaySignature: response.razorpay_signature,
    };

    console.log("VERIFY PAYLOAD:", verifyPayload);

    const verifyRes = await orderAPI.verifyPayment(verifyPayload);

    console.log("VERIFY RESPONSE:", verifyRes.data);

    await clearCart();

    toast.success("Payment successful!");

    navigate(`/orders/${orderData.order.id}`);

  } catch (err) {

    console.log("VERIFY ERROR:", err);

    console.log("VERIFY ERROR RESPONSE:", err.response);

    toast.error("Payment verification failed");
  }
},
      prefill: {
        name: form.fullName,
        contact: form.phone,
      },
      theme: { color: '#FFD600' },
      modal: {
        ondismiss: () => toast('Payment cancelled', { icon: 'ℹ️' }),
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.address || !form.city || !form.pincode) {
      toast.error('Please fill all fields'); return;
    }
    setLoading(true);
    try {
      const res = await orderAPI.checkout({ ...form, paymentMethod });
      const data = res.data.data;

      if (paymentMethod === 'RAZORPAY') {
        await handleRazorpayPayment(data);
      } else {
        await clearCart();
        toast.success('Order placed successfully!');
        navigate(`/orders/${data.id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 'calc(68px + 3rem)', paddingBottom: '4rem', minHeight: '100vh' }}>
        <div className="container">
          <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '3rem', marginBottom: '2rem' }}>CHECKOUT</h1>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2.5rem', alignItems: 'start' }}>
            <form onSubmit={handleSubmit}>

              {/* Shipping */}
              <div style={{ background: 'var(--gray)', padding: '2rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.5rem', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>SHIPPING DETAILS</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input className="form-input" name="fullName" value={form.fullName} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input className="form-input" name="phone" value={form.phone} onChange={handleChange} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input className="form-input" name="address" value={form.address} onChange={handleChange} placeholder="Street, Flat/House No." required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input className="form-input" name="city" value={form.city} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pincode</label>
                    <input className="form-input" name="pincode" value={form.pincode} onChange={handleChange} maxLength={6} required />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div style={{ background: 'var(--gray)', padding: '2rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.5rem', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>PAYMENT METHOD</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    { value: 'RAZORPAY', label: 'Pay Online (UPI / Card / Netbanking)', icon: '💳', desc: 'Powered by Razorpay — 100% secure' },
                    { value: 'COD', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when your order arrives' },
                  ].map(opt => (
                    <label key={opt.value} onClick={() => setPaymentMethod(opt.value)}
                      style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: `1px solid ${paymentMethod === opt.value ? 'var(--yellow)' : 'var(--border)'}`, cursor: 'pointer', background: paymentMethod === opt.value ? 'var(--yellow-light)' : 'transparent', transition: 'all 0.2s' }}>
                      <input type="radio" name="paymentMethod" value={opt.value} checked={paymentMethod === opt.value} onChange={() => setPaymentMethod(opt.value)} style={{ accentColor: 'var(--yellow)' }} />
                      <span style={{ fontSize: '1.4rem' }}>{opt.icon}</span>
                      <div>
                        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: '0.95rem', letterSpacing: '0.05em' }}>{opt.label}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: '0.2rem' }}>{opt.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
                {loading ? 'Processing...' : paymentMethod === 'RAZORPAY' ? '💳 Pay ₹' + grandTotal.toLocaleString() : '✅ Place Order (COD)'}
              </button>
            </form>

            {/* Order Summary */}
            <div style={{ background: 'var(--gray)', padding: '1.75rem', position: 'sticky', top: 88 }}>
              <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.5rem', marginBottom: '1.5rem' }}>ORDER SUMMARY</h3>

              <div style={{ maxHeight: 300, overflowY: 'auto', marginBottom: '1.5rem' }}>
                {items.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ width: 55, height: 70, background: 'var(--gray2)', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {item.product.imageUrl
                        ? <img src={item.product.imageUrl} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <span style={{ fontSize: '1.5rem', color: 'rgba(255,214,0,0.1)' }}>👕</span>
                      }
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>{item.product.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)', margin: '0.2rem 0' }}>Qty: {item.quantity}</div>
                      <div style={{ color: 'var(--yellow)', fontSize: '0.9rem' }}>₹{(item.product.price * item.quantity).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>

              {[
                { label: 'Subtotal', value: `₹${cartTotal.toLocaleString()}` },
                { label: 'Shipping', value: shipping === 0 ? 'FREE' : `₹${shipping}` },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--muted)' }}>{row.label}</span>
                  <span style={{ color: row.value === 'FREE' ? 'var(--success)' : 'var(--white)' }}>{row.value}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, textTransform: 'uppercase' }}>Grand Total</span>
                <span style={{ color: 'var(--yellow)', fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.4rem' }}>₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Checkout;
