import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiShoppingBag } from 'react-icons/fi';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isLoggedIn()) { navigate('/login'); return; }
    await addToCart(product.id);
  };

  return (
    <div className="product-card">
      <div className="product-img">
        {product.imageUrl
          ? <img src={product.imageUrl} alt={product.name} />
          : <div className="product-img-placeholder"><FiShoppingBag /></div>
        }
        {product.onSale && <span className="product-tag">-{product.discountPercent}%</span>}
        {product.newArrival && !product.onSale && <span className="product-tag new">NEW</span>}
        <button className="quick-add" onClick={handleAddToCart}>+ Add to Cart</button>
      </div>
      <div className="product-info">
        <div className="product-brand">{product.brand}</div>
        <Link to={`/product/${product.id}`} className="product-name">{product.name}</Link>
        <div className="product-price">
          <span className="price-current">₹{product.price?.toLocaleString()}</span>
          {product.onSale && <span className="price-old">₹{product.originalPrice?.toLocaleString()}</span>}
        </div>
        {product.rating > 0 && (
          <div style={{ fontSize: '0.78rem', color: 'var(--yellow)', marginTop: '0.25rem' }}>
            ★ {product.rating?.toFixed(1)}
            <span style={{ color: 'var(--muted)', marginLeft: '0.25rem' }}>({product.reviewCount})</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
