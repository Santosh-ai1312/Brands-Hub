import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ProductCard from '../components/shop/ProductCard';
import { productAPI } from '../services/api';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    keyword: searchParams.get('keyword') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest',
    page: parseInt(searchParams.get('page') || '0'),
  });

  useEffect(() => {
    productAPI.getCategories().then(res => setCategories(res.data.data || []));
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.keyword) params.keyword = filters.keyword;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      params.sort = filters.sort;
      params.page = filters.page;
      params.size = 12;

      const res = await productAPI.getAll(params);
      const data = res.data.data;
      setProducts(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key, value) => {
    const updated = { ...filters, [key]: value, page: 0 };
    setFilters(updated);
    const params = {};
    Object.entries(updated).forEach(([k, v]) => { if (v !== '' && v !== 0) params[k] = v; });
    setSearchParams(params);
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 'calc(68px + 2rem)', minHeight: '100vh' }}>
        <div className="container">

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
            <div>
              <div className="section-label">Browse Collection</div>
              <h1 className="section-title">SHOP ALL</h1>
            </div>
            <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{totalElements} products</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2.5rem' }}>

            {/* FILTER SIDEBAR */}
            <aside>
              <form onSubmit={handleFilterSubmit} style={{ background: 'var(--gray)', padding: '1.5rem', position: 'sticky', top: 88 }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.78rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--yellow)', marginBottom: '0.75rem' }}>Category</h4>
                  <select className="form-select" value={filters.category} onChange={e => updateFilter('category', e.target.value)}>
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.78rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--yellow)', marginBottom: '0.75rem' }}>Price Range</h4>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input type="number" className="form-input" placeholder="Min ₹" value={filters.minPrice}
                      onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))} style={{ padding: '0.5rem' }} />
                    <span style={{ color: 'var(--muted)' }}>–</span>
                    <input type="number" className="form-input" placeholder="Max ₹" value={filters.maxPrice}
                      onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))} style={{ padding: '0.5rem' }} />
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.78rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--yellow)', marginBottom: '0.75rem' }}>Sort By</h4>
                  <select className="form-select" value={filters.sort} onChange={e => updateFilter('sort', e.target.value)}>
                    <option value="newest">Newest First</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-primary btn-full">Apply Filters</button>
                <button type="button" className="btn btn-secondary btn-full" style={{ marginTop: '0.5rem' }}
                  onClick={() => { setFilters({ category: '', keyword: '', minPrice: '', maxPrice: '', sort: 'newest', page: 0 }); setSearchParams({}); }}>
                  Clear All
                </button>
              </form>
            </aside>

            {/* PRODUCTS */}
            <div>
              {filters.keyword && (
                <div style={{ marginBottom: '1.5rem', color: 'var(--muted)', fontSize: '0.9rem' }}>
                  Results for: <strong style={{ color: 'var(--yellow)' }}>"{filters.keyword}"</strong>
                </div>
              )}

              {loading ? (
                <div className="spinner" />
              ) : products.length > 0 ? (
                <>
                  <div className="products-grid-3">
                    {products.map(p => <ProductCard key={p.id} product={p} />)}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="pagination">
                      <button disabled={filters.page === 0} onClick={() => updateFilter('page', filters.page - 1)}>←</button>
                      {[...Array(totalPages)].map((_, i) => (
                        <button key={i} className={filters.page === i ? 'active' : ''} onClick={() => updateFilter('page', i)}>{i + 1}</button>
                      ))}
                      <button disabled={filters.page === totalPages - 1} onClick={() => updateFilter('page', filters.page + 1)}>→</button>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                  <p style={{ marginBottom: '1.5rem' }}>No products found.</p>
                  <button className="btn btn-outline" onClick={() => { setFilters({ category: '', keyword: '', minPrice: '', maxPrice: '', sort: 'newest', page: 0 }); setSearchParams({}); }}>
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Shop;
