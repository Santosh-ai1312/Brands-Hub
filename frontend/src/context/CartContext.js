import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isLoggedIn, user } = useAuth();
  const fetchCart = async () => {
    if (!isLoggedIn()) return;
    try {
      const res = await cartAPI.getCart();
      setCart(res.data.data);
    } catch (err) {}
  };

useEffect(() => {
  if (user) {
    fetchCart();
  }
}, [user]);

  const addToCart = async (productId, quantity = 1, size = null, color = null) => {
    if (!isLoggedIn()) { toast.error('Please login to add items'); return false; }
    setLoading(true);
    try {
      const res = await cartAPI.addItem({ productId, quantity, size, color });
      setCart(res.data.data);
      toast.success('Added to cart!');
      return true;
    } catch (err) {
      toast.error('Failed to add item');
      return false;
    } finally { setLoading(false); }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const res = await cartAPI.updateItem(itemId, quantity);
      setCart(res.data.data);
    } catch (err) { toast.error('Failed to update'); }
  };

  const removeFromCart = async (itemId) => {
    try {
      const res = await cartAPI.removeItem(itemId);
      setCart(res.data.data);
      toast.success('Item removed');
    } catch (err) { toast.error('Failed to remove'); }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clearCart();
      setCart(prev => ({ ...prev, items: [] }));
    } catch (err) {}
  };

  const cartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const cartTotal = cart?.items?.reduce((sum, item) => sum + (item.product.price * item.quantity), 0) || 0;

  return (
    <CartContext.Provider value={{ cart, cartCount, cartTotal, loading, addToCart, updateQuantity, removeFromCart, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
