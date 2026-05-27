import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminAPI } from '../../services/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getUsers()
      .then(res => setUsers(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout title="Customers">
      {loading ? <div className="spinner" /> : (
        <div style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.04)', fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.8rem', color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Total: {users.length} customers
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['', 'Name', 'Email', 'Phone', 'Role', 'Joined', 'Status'].map(h => (
                  <th key={h} style={{ background: '#111', fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#555', padding: '0.85rem 1.25rem', textAlign: 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#555' }}>No customers yet</td></tr>
              ) : users.map(user => (
                <tr key={user.id}>
                  <td style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#1e1e1e', border: '1px solid rgba(255,214,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Bebas Neue',sans-serif", color: 'var(--yellow)', fontSize: '1rem' }}>
                      {user.fullName?.[0]?.toUpperCase()}
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.88rem' }}>{user.fullName}</td>
                  <td style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.85rem', color: 'rgba(245,245,240,0.6)' }}>{user.email}</td>
                  <td style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.85rem', color: 'rgba(245,245,240,0.6)' }}>{user.phone || '—'}</td>
                  <td style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <span style={{ background: user.role === 'ADMIN' ? 'rgba(255,214,0,0.12)' : 'rgba(33,150,243,0.12)', color: user.role === 'ADMIN' ? 'var(--yellow)' : '#2196f3', fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', padding: '0.2rem 0.65rem', textTransform: 'uppercase' }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.82rem', color: '#555' }}>
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                  </td>
                  <td style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <span style={{ background: user.enabled ? 'rgba(76,175,80,0.15)' : 'rgba(158,158,158,0.15)', color: user.enabled ? '#4caf50' : '#9e9e9e', fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', padding: '0.2rem 0.65rem', textTransform: 'uppercase' }}>
                      {user.enabled ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default Users;
