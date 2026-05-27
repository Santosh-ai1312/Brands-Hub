import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminAPI, productAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const emptyForm = { name: '', description: '', price: '', originalPrice: '', stock: '', category: '', brand: '', sizes: '', colors: '', featured: false, newArrival: false, active: true };
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchProducts();
    productAPI.getCategories().then(r => setCategories(r.data.data || []));
  }, [page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getProducts({ page, size: 10 });
      setProducts(res.data.data?.content || []);
      setTotalPages(res.data.data?.totalPages || 0);
    } finally { setLoading(false); }
  };

  const openAdd = () => { setForm(emptyForm); setEditProduct(null); setImageFile(null); setShowModal(true); };
  const openEdit = (p) => {
    setEditProduct(p);
    setForm({ name: p.name, description: p.description || '', price: p.price, originalPrice: p.originalPrice || '', stock: p.stock, category: p.category, brand: p.brand || '', sizes: p.sizes?.join(',') || '', colors: p.colors?.join(',') || '', featured: p.featured, newArrival: p.newArrival, active: p.active });
    setImageFile(null); setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (imageFile) fd.append('image', imageFile);
    try {
      if (editProduct) { await adminAPI.updateProduct(editProduct.id, fd); toast.success('Product updated!'); }
      else { await adminAPI.createProduct(fd); toast.success('Product added!'); }
      setShowModal(false); fetchProducts();
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving product'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try { await adminAPI.deleteProduct(id); toast.success('Deleted'); fetchProducts(); }
    catch { toast.error('Failed to delete'); }
  };

  return (
    <AdminLayout title="Products">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.25rem' }}>
        <button className="btn btn-primary" onClick={openAdd}><FiPlus /> Add Product</button>
      </div>

      {loading ? <div className="spinner" /> : (
        <div style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.04)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>{['#', 'Name', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ background: '#111', fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#555', padding: '0.85rem 1.25rem', textAlign: 'left' }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.03)', color: '#555', fontSize: '0.8rem' }}>{p.id}</td>
                  <td style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{p.name}</div>
                    <div style={{ color: '#555', fontSize: '0.78rem' }}>{p.brand}</div>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.03)', color: 'rgba(245,245,240,0.6)', fontSize: '0.85rem' }}>{p.category?.replace('_', ' ')}</td>
                  <td style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.03)', color: 'var(--yellow)', fontSize: '0.9rem' }}>
                    ₹{p.price?.toLocaleString()}
                    {p.onSale && <div style={{ color: '#555', fontSize: '0.75rem', textDecoration: 'line-through' }}>₹{p.originalPrice?.toLocaleString()}</div>}
                  </td>
                  <td style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.88rem' }}>{p.stock}</td>
                  <td style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <span style={{ display: 'inline-block', padding: '0.2rem 0.65rem', fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', background: p.active ? 'rgba(76,175,80,0.15)' : 'rgba(158,158,158,0.15)', color: p.active ? '#4caf50' : '#9e9e9e' }}>{p.active ? 'Active' : 'Inactive'}</span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => openEdit(p)} style={{ background: '#242424', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(245,245,240,0.7)', padding: '0.35rem 0.65rem', cursor: 'pointer', fontSize: '0.85rem', transition: 'all 0.2s' }}><FiEdit2 /></button>
                      <button onClick={() => handleDelete(p.id)} style={{ background: '#242424', border: '1px solid rgba(244,67,54,0.3)', color: '#f44336', padding: '0.35rem 0.65rem', cursor: 'pointer', fontSize: '0.85rem' }}><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
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

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div style={{ background: '#161616', width: '100%', maxWidth: 700, maxHeight: '90vh', overflowY: 'auto', border: '1px solid rgba(255,214,0,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.5rem' }}>{editProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--muted)', fontSize: '1.4rem', cursor: 'pointer' }}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[
                  { label: 'Product Name *', key: 'name', type: 'text', required: true },
                  { label: 'Brand', key: 'brand', type: 'text' },
                  { label: 'Selling Price (₹) *', key: 'price', type: 'number', required: true },
                  { label: 'Original Price (₹)', key: 'originalPrice', type: 'number' },
                  { label: 'Stock *', key: 'stock', type: 'number', required: true },
                  { label: 'Sizes (comma separated)', key: 'sizes', type: 'text', placeholder: 'S,M,L,XL' },
                  { label: 'Colors (comma separated)', key: 'colors', type: 'text', placeholder: 'Black,White' },
                ].map(f => (
                  <div key={f.key} className="form-group">
                    <label className="form-label">{f.label}</label>
                    <input className="form-input" type={f.type} value={form[f.key]} placeholder={f.placeholder} required={f.required}
                      onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.07)' }} />
                  </div>
                ))}
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select className="form-select" value={form.category} required onChange={e => setForm(p => ({ ...p, category: e.target.value }))} style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Description</label>
                  <textarea className="form-input" rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.07)', resize: 'vertical' }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Product Image</label>
                  <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} style={{ color: 'var(--muted)', fontSize: '0.85rem' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', justifyContent: 'center' }}>
                  {[['featured', 'Featured Product'], ['newArrival', 'New Arrival'], ['active', 'Active (Visible)']].map(([k, label]) => (
                    <label key={k} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', color: 'rgba(245,245,240,0.65)', fontSize: '0.85rem' }}>
                      <input type="checkbox" checked={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.checked }))} style={{ accentColor: 'var(--yellow)' }} />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn btn-primary">{editProduct ? 'Update Product' : 'Add Product'}</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Products;
