import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 'calc(68px + 3rem)', paddingBottom: '4rem', minHeight: '100vh' }}>
        <div className="container" style={{ maxWidth: 700 }}>
          <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '3rem', marginBottom: '2rem' }}>MY PROFILE</h1>

          <div style={{ background: 'var(--gray)', padding: '2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--gray2)', border: '2px solid var(--yellow)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Bebas Neue',sans-serif", fontSize: '2rem', color: 'var(--yellow)', flexShrink: 0 }}>
              {user?.fullName?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.8rem' }}>{user?.fullName}</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{user?.email}</div>
              <div style={{ display: 'inline-block', background: 'var(--yellow-light)', color: 'var(--yellow)', fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '0.2rem 0.6rem', marginTop: '0.4rem' }}>{user?.role}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            {[
              { label: 'My Orders', desc: 'Track and manage orders', link: '/orders', icon: '📦' },
              { label: 'Shop', desc: 'Browse our collection', link: '/shop', icon: '🛍️' },
            ].map(card => (
              <Link key={card.label} to={card.link}
                style={{ background: 'var(--gray)', padding: '1.5rem', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--yellow)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                <span style={{ fontSize: '2rem' }}>{card.icon}</span>
                <div>
                  <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.label}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{card.desc}</div>
                </div>
              </Link>
            ))}
          </div>

          <button className="btn btn-secondary" onClick={logout}>Logout →</button>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Profile;
