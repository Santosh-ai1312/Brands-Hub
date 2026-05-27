import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ProductCard from '../components/shop/ProductCard';
import { productAPI } from '../services/api';

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [f, n] = await Promise.all([
          productAPI.getFeatured(),
          productAPI.getNewArrivals()
        ]);
        setFeatured(f.data.data || []);
        setNewArrivals(n.data.data || []);
      } catch (err) {}
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '68px' }}>

        {/* HERO */}
        <section style={{
          minHeight: 'calc(100vh - 68px)',
          display: 'grid', gridTemplateColumns: '1fr 1fr'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '4rem 3rem 4rem 5rem' }}>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--yellow)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ width: 40, height: 1, background: 'var(--yellow)', display: 'inline-block' }}></span>
              New Collection 2024
            </div>
            <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(4rem,8vw,8rem)', lineHeight: 0.9, marginBottom: '1.5rem' }}>
              DRESS TO<br />
              <span style={{ color: 'var(--yellow)' }}>IMPRESS</span>
            </h1>
            <p style={{ color: 'var(--muted)', maxWidth: 360, marginBottom: '2.5rem', fontWeight: 300, lineHeight: 1.7 }}>
              Discover premium men's fashion crafted for the bold, the modern, and the unstoppable. Style that speaks before you do.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link to="/shop" className="btn btn-primary btn-lg">Shop Now</Link>
              <Link to="/shop?category=JACKETS" className="btn btn-secondary btn-lg">New Arrivals</Link>
            </div>
          </div>
          <div style={{ background: 'var(--gray)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '12rem', color: 'rgba(255,214,0,0.04)', letterSpacing: '-0.05em' }}>BH</div>
            <div style={{ position: 'absolute', bottom: '3rem', left: '-1rem', background: 'var(--yellow)', color: 'var(--black)', padding: '0.8rem 1.5rem', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Free Shipping Over ₹999
            </div>
          </div>
        </section>

        {/* MARQUEE */}
        <div style={{ background: 'var(--yellow)', overflow: 'hidden', height: 40, display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '2rem', whiteSpace: 'nowrap', animation: 'marquee 18s linear infinite', fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.15em', color: 'var(--black)', padding: '0 2rem' }}>
            {[...Array(2)].map((_, i) => (
              <React.Fragment key={i}>
                <span>NEW ARRIVALS</span><span>✦</span>
                <span>FREE SHIPPING OVER ₹999</span><span>✦</span>
                <span>PREMIUM QUALITY</span><span>✦</span>
                <span>EASY RETURNS</span><span>✦</span>
              </React.Fragment>
            ))}
          </div>
        </div>
        <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>

        {/* CATEGORIES */}
        <section className="section">
          <div className="container">
            <div className="section-label">Browse By Category</div>
            <h2 className="section-title" style={{ marginBottom: '2.5rem' }}>SHOP THE COLLECTION</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, background: 'var(--border)' }}>
              {[
                { name: 'Shirts', cat: 'SHIRTS', sub: 'Formal & Casual', icon: '👔' },
                { name: 'T-Shirts', cat: 'T_SHIRTS', sub: 'Graphic & Plain', icon: '👕' },
                { name: 'Jeans', cat: 'JEANS', sub: 'Slim & Relaxed Fit', icon: '👖' },
                { name: 'Jackets', cat: 'JACKETS', sub: 'Bomber & Leather', icon: '🧥' },
              ].map(cat => (
                <Link key={cat.cat} to={`/shop?category=${cat.cat}`}
                  style={{ background: 'var(--gray)', aspectRatio: '3/4', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '1.5rem', position: 'relative', overflow: 'hidden', transition: 'transform 0.3s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-60%)', fontSize: '5rem', opacity: 0.06 }}>{cat.icon}</div>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%)' }}></div>
                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.8rem' }}>{cat.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--yellow)', fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: '0.1em' }}>{cat.sub}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED PRODUCTS */}
        {featured.length > 0 && (
          <section className="section" style={{ paddingTop: 0 }}>
            <div className="container">
              <div className="section-label">Hand Picked</div>
              <h2 className="section-title" style={{ marginBottom: '2.5rem' }}>FEATURED PIECES</h2>
              <div className="products-grid">
                {featured.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
              </div>
              <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                <Link to="/shop" className="btn btn-outline btn-lg">View All Products →</Link>
              </div>
            </div>
          </section>
        )}

        {/* PROMO BANNER */}
        <section style={{ padding: '0 0 4rem' }}>
          <div className="container">
            <div style={{ background: 'var(--yellow)', display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 280, overflow: 'hidden' }}>
              <div style={{ padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '3.5rem', color: 'var(--black)', lineHeight: 1, marginBottom: '0.75rem' }}>SEASON SALE UP TO 50% OFF</h2>
                <p style={{ color: 'rgba(0,0,0,0.6)', marginBottom: '1.5rem', fontWeight: 300 }}>Limited time offer on premium men's wear. Don't miss out.</p>
                <Link to="/shop" className="btn btn-dark" style={{ width: 'fit-content' }}>Shop the Sale</Link>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '8rem', color: 'rgba(0,0,0,0.08)' }}>50%</div>
              </div>
            </div>
          </div>
        </section>

        {/* NEW ARRIVALS */}
        {newArrivals.length > 0 && (
          <section className="section" style={{ paddingTop: 0 }}>
            <div className="container">
              <div className="section-label">Just Landed</div>
              <h2 className="section-title" style={{ marginBottom: '2.5rem' }}>NEW ARRIVALS</h2>
              <div className="products-grid">
                {newArrivals.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          </section>
        )}

        {/* TESTIMONIALS */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="section-label">What Customers Say</div>
            <h2 className="section-title" style={{ marginBottom: '2.5rem' }}>REVIEWS</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem' }}>
              {[
                { name: 'Rahul Sharma', loc: 'Bangalore', text: 'Amazing quality! The shirt fits perfectly and fabric is top-notch. Will order again.', stars: 5 },
                { name: 'Arjun Patel', loc: 'Mumbai', text: 'Fast delivery and great packaging. The jeans are exactly as described. Love it!', stars: 5 },
                { name: 'Vikram Singh', loc: 'Delhi', text: 'Great collection and affordable prices. The jacket is my go-to piece this winter.', stars: 4 },
              ].map((t, i) => (
                <div key={i} style={{ background: 'var(--gray)', padding: '2rem', borderLeft: '3px solid var(--yellow)' }}>
                  <div style={{ color: 'var(--yellow)', marginBottom: '1rem', letterSpacing: '0.1em' }}>{'★'.repeat(t.stars)}{'☆'.repeat(5 - t.stars)}</div>
                  <p style={{ color: 'rgba(245,245,240,0.65)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.5rem', fontStyle: 'italic' }}>"{t.text}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--gray2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Bebas Neue',sans-serif", color: 'var(--yellow)', border: '1px solid rgba(255,214,0,0.3)' }}>{t.name[0]}</div>
                    <div>
                      <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase' }}>{t.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{t.loc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
};

export default Home;
