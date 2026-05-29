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
<section
  style={{
    minHeight: '90vh',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr'
  }}
>
  {/* LEFT SIDE */}
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '4rem 5rem',
      background: '#000'
    }}
  >
    <div
      style={{
        color: '#FFD600',
        letterSpacing: '0.3em',
        marginBottom: '1rem',
        fontSize: '0.8rem'
      }}
    >
      NEW COLLECTION 2026
    </div>

    <h1
      style={{
        fontSize: '6rem',
        lineHeight: '0.9',
        fontWeight: 'bold',
        marginBottom: '1.5rem'
      }}
    >
      DRESS TO
      <br />
      <span style={{ color: '#FFD600' }}>
        IMPRESS
      </span>
    </h1>

    <p
      style={{
        color: '#999',
        maxWidth: '500px',
        marginBottom: '2rem'
      }}
    >
      Premium men's fashion crafted for the bold.
      Style that speaks before you do.
    </p>

    <div style={{ display: 'flex', gap: '1rem' }}>
      <Link to="/shop" className="btn btn-primary">
        SHOP NOW
      </Link>

      <Link to="/shop" className="btn btn-outline">
        NEW ARRIVALS
      </Link>
    </div>
  </div>

  {/* RIGHT SIDE */}
  <div
    style={{
      position: 'relative',
      overflow: 'hidden'
    }}
  >
      <img
        src="https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg"
        alt="Fashion Model"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to top, rgba(0,0,0,.4), transparent)'
        }}
      />

      <div
        style={{
          position: 'absolute',
          bottom: '30px',
          left: '30px',
          background: '#FFD600',
          color: '#000',
          padding: '10px 20px',
          fontWeight: 'bold'
        }}
      >
        FREE SHIPPING OVER ₹999
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

    <h2
      className="section-title"
      style={{ marginBottom: '2.5rem' }}
    >
      SHOP THE COLLECTION
    </h2>

    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4,1fr)',
        gap: '1px',
        background: 'var(--border)'
      }}
    >
      {[
        {
          name: 'Shirts',
          cat: 'SHIRTS',
          sub: 'Formal & Casual',
          image:
            'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf'
        },
        {
          name: 'T-Shirts',
          cat: 'T_SHIRTS',
          sub: 'Graphic & Plain',
          image:
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab'
        },
        {
          name: 'Jeans',
          cat: 'JEANS',
          sub: 'Slim & Relaxed Fit',
          image:
            'https://images.unsplash.com/photo-1542272604-787c3835535d'
        },
        {
          name: 'Jackets',
          cat: 'JACKETS',
          sub: 'Bomber & Leather',
          image:
            'https://images.unsplash.com/photo-1551028719-00167b16eac5'
        }
      ].map((cat) => (
        <Link
          key={cat.cat}
          to={`/shop?category=${cat.cat}`}
          style={{
            background: 'var(--gray)',
            aspectRatio: '3/4',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '1.5rem',
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.3s'
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = 'scale(1.02)')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = 'scale(1)')
          }
        >
          <img
            src={cat.image}
            alt={cat.name}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />

          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 100%)'
            }}
          />

          <div
            style={{
              position: 'relative',
              zIndex: 2
            }}
          >
            <div
              style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: '1.8rem'
              }}
            >
              {cat.name}
            </div>

            <div
              style={{
                fontSize: '0.75rem',
                color: 'var(--yellow)',
                fontFamily: "'Barlow Condensed',sans-serif",
                letterSpacing: '0.1em'
              }}
            >
              {cat.sub}
            </div>
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
