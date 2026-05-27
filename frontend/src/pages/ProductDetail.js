import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ProductCard from '../components/shop/ProductCard';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FiShoppingBag, FiArrowLeft } from 'react-icons/fi';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, loading: cartLoading } = useCart();
  const { isLoggedIn } = useAuth();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await productAPI.getById(id);
      setProduct(res.data.data);
      // Fetch related
      const rel = await productAPI.getAll({ category: res.data.data.category, size: 4, page: 0 });
      setRelated((rel.data.data?.content || []).filter(p => p.id !== Number(id)).slice(0, 3));
    } catch (err) {
      navigate('/shop');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isLoggedIn()) { navigate('/login'); return; }
    await addToCart(product.id, quantity, selectedSize || null, selectedColor || null);
  };

  if (loading) return <><Navbar /><div className="spinner" style={{ marginTop: 200 }} /></>;
  if (!product) return null;

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 'calc(68px + 3rem)', paddingBottom: '4rem' }}>
        <div className="container">

          {/* Breadcrumb */}
          <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--muted)', fontSize: '0.85rem' }}>
            <Link to="/" style={{ color: 'var(--muted)' }}>Home</Link> /
            <Link to="/shop" style={{ color: 'var(--muted)' }}>Shop</Link> /
            <span style={{ color: 'var(--yellow)' }}>{product.name}</span>
          </div>

          {/* Product Detail Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>

            {/* Image */}
            <div style={{ position: 'sticky', top: 88 }}>
              <div style={{ background: 'var(--gray2)', aspectRatio: '3/4', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                {product.imageUrl
                  ? <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <FiShoppingBag style={{ fontSize: '6rem', color: 'rgba(255,214,0,0.08)' }} />
                }
                {product.onSale && (
                  <div style={{ position: 'absolute', top: 0, left: 0, background: 'var(--yellow)', color: 'var(--black)', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.1em', padding: '0.3rem 0.8rem' }}>
                    -{product.discountPercent}% OFF
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--yellow)', marginBottom: '0.5rem' }}>
                  {product.brand} · {product.category?.replace('_', ' ')}
                </div>
                <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(2.5rem,5vw,3.5rem)', lineHeight: 1 }}>{product.name}</h1>
              </div>

              {/* Price */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '2.5rem', color: 'var(--yellow)' }}>
                  ₹{product.price?.toLocaleString()}
                </span>
                {product.onSale && (
                  <span style={{ color: 'var(--muted)', textDecoration: 'line-through', fontSize: '1.2rem' }}>
                    ₹{product.originalPrice?.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Rating */}
              {product.rating > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--yellow)' }}>{'★'.repeat(Math.round(product.rating))}</span>
                  <span style={{ color: 'var(--muted)' }}>{product.rating?.toFixed(1)} ({product.reviewCount} reviews)</span>
                </div>
              )}

              {/* Description */}
              {product.description && (
                <p style={{ color: 'rgba(245,245,240,0.65)', lineHeight: 1.7, fontWeight: 300 }}>{product.description}</p>
              )}

              {/* Sizes */}
              {product.sizes?.length > 0 && (
                <div>
                  <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.78rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.75rem' }}>
                    Size {selectedSize && <span style={{ color: 'var(--yellow)' }}>– {selectedSize}</span>}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {product.sizes.map(size => (
                      <button key={size} onClick={() => setSelectedSize(size)}
                        style={{ background: selectedSize === size ? 'var(--yellow)' : 'transparent', color: selectedSize === size ? 'var(--black)' : 'var(--white)', border: `1px solid ${selectedSize === size ? 'var(--yellow)' : 'var(--border)'}`, padding: '0.5rem 1rem', fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.85rem', letterSpacing: '0.1em', cursor: 'pointer', transition: 'all 0.2s' }}>
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              {product.colors?.length > 0 && (
                <div>
                  <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.78rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.75rem' }}>
                    Color {selectedColor && <span style={{ color: 'var(--yellow)' }}>– {selectedColor}</span>}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {product.colors.map(color => (
                      <button key={color} onClick={() => setSelectedColor(color)}
                        style={{ background: selectedColor === color ? 'var(--yellow)' : 'transparent', color: selectedColor === color ? 'var(--black)' : 'var(--white)', border: `1px solid ${selectedColor === color ? 'var(--yellow)' : 'var(--border)'}`, padding: '0.4rem 0.9rem', fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.78rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.75rem' }}>Quantity</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    style={{ width: 36, height: 36, background: 'var(--gray2)', border: '1px solid var(--border)', color: 'var(--white)', fontSize: '1.2rem', cursor: 'pointer' }}>−</button>
                  <div style={{ width: 48, height: 36, background: 'var(--gray)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderLeft: 'none', borderRight: 'none' }}>{quantity}</div>
                  <button onClick={() => setQuantity(q => Math.min(10, q + 1))}
                    style={{ width: 36, height: 36, background: 'var(--gray2)', border: '1px solid var(--border)', color: 'var(--white)', fontSize: '1.2rem', cursor: 'pointer' }}>+</button>
                </div>
              </div>

              {/* Add to Cart */}
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn btn-primary btn-lg" style={{ flex: 1 }}
                  onClick={handleAddToCart} disabled={cartLoading}>
                  {cartLoading ? 'Adding...' : '+ Add to Cart'}
                </button>
                <Link to="/cart" className="btn btn-secondary btn-lg">View Cart</Link>
              </div>

              {/* Meta */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  { label: 'Availability', value: product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock' },
                  { label: 'Category', value: product.category?.replace('_', ' ') },
                  { label: 'Brand', value: product.brand },
                ].map(m => (
                  <div key={m.label} style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--muted)', minWidth: 100 }}>{m.label}</span>
                    <span style={{ color: product.stock === 0 && m.label === 'Availability' ? 'var(--error)' : 'var(--yellow)' }}>{m.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <div style={{ marginTop: '5rem' }}>
              <div className="section-label">You Might Also Like</div>
              <h2 className="section-title" style={{ marginBottom: '2rem' }}>RELATED PRODUCTS</h2>
              <div className="products-grid-3">
                {related.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProductDetail;
