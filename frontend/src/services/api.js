import axios from 'axios';

const API = axios.create({
  baseURL: 'https://brands-hub-94qo.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ======================================
// REQUEST INTERCEPTOR
// ======================================
API.interceptors.request.use(
  (config) => {

    const token = localStorage.getItem('token');

    console.log("TOKEN:", token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => Promise.reject(error)
);

// ======================================
// RESPONSE INTERCEPTOR
// ======================================
API.interceptors.response.use(
  (response) => response,

  (error) => {

    console.log("API ERROR:", error.response);

    if (error.response?.status === 401) {

      localStorage.removeItem('token');
      localStorage.removeItem('user');

      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// ======================================
// AUTH APIs
// ======================================
export const authAPI = {

  register: async (data) => {
    return await API.post('/auth/register', data);
  },

  login: async (data) => {
    return await API.post('/auth/login', data);
  },
};

// ======================================
// PRODUCT APIs
// ======================================
export const productAPI = {

  getAll: async (params) => {
    return await API.get('/products', { params });
  },

  getFeatured: async () => {
    return await API.get('/products/featured');
  },

  getNewArrivals: async () => {
    return await API.get('/products/new-arrivals');
  },

  getById: async (id) => {
    return await API.get(`/products/${id}`);
  },

  getCategories: async () => {
    return await API.get('/products/categories');
  },
};

// ======================================
// CART APIs
// ======================================
export const cartAPI = {

  getCart: async () => {
    return await API.get('/cart');
  },

  addItem: async (data) => {

    console.log("ADD TO CART:", data);

    return await API.post('/cart/add', data);
  },

  updateItem: async (itemId, quantity) => {

    return await API.put(
      `/cart/update/${itemId}`,
      { quantity }
    );
  },

  removeItem: async (itemId) => {

    return await API.delete(
      `/cart/remove/${itemId}`
    );
  },

  clearCart: async () => {

    return await API.delete('/cart/clear');
  },
};

// ======================================
// ORDER APIs
// ======================================
export const orderAPI = {

  checkout: async (data) => {

    console.log("CHECKOUT REQUEST:", data);

    return await API.post(
      '/orders/checkout',
      JSON.stringify(data),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  },

  verifyPayment: async (data) => {

    console.log("VERIFY PAYMENT REQUEST:", data);

    return await API.post(
      '/orders/payment/verify',
      JSON.stringify(data),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  },

  getMyOrders: async () => {
    return await API.get('/orders/my');
  },

  getOrder: async (id) => {
    return await API.get(`/orders/${id}`);
  },
};

// ======================================
// ADMIN APIs
// ======================================
export const adminAPI = {

  getDashboard: async () => {
    return await API.get('/admin/dashboard');
  },

  getProducts: async (params) => {
    return await API.get('/admin/products', { params });
  },

  createProduct: async (data) => {

    return await API.post(
      '/admin/products',
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },

  updateProduct: async (id, data) => {

    return await API.put(
      `/admin/products/${id}`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },

  deleteProduct: async (id) => {
    return await API.delete(`/admin/products/${id}`);
  },

  getOrders: async (params) => {
    return await API.get('/admin/orders', { params });
  },

  updateOrderStatus: async (id, status) => {

    return await API.put(
      `/admin/orders/${id}/status`,
      { status }
    );
  },

  getUsers: async () => {
    return await API.get('/admin/users');
  },
};

export default API;