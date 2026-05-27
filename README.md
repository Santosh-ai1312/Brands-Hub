# 🛍️ BRANDS HUB – Full Stack E-Commerce

**Tech Stack:** Spring Boot + JWT + React.js + MySQL + Razorpay

---

## 📁 Project Structure

```
brandshub-fullstack/
├── backend/          ← Spring Boot (Port 8080)
│   ├── pom.xml
│   └── src/main/java/com/brandshub/
│       ├── controller/   ← REST API endpoints
│       ├── service/      ← Business logic
│       ├── repository/   ← JPA repositories
│       ├── model/        ← JPA entities
│       ├── dto/          ← Request/Response DTOs
│       ├── security/jwt/ ← JWT Auth Filter & Utils
│       └── config/       ← Security, CORS, DataSeeder
│
└── frontend/         ← React.js (Port 3000)
    ├── package.json
    └── src/
        ├── pages/        ← All page components
        ├── components/   ← Reusable UI components
        ├── context/      ← AuthContext, CartContext
        ├── services/     ← Axios API calls
        └── index.css     ← Black & Yellow theme
```

---

## 🔑 REST API Endpoints

### Auth
| Method | URL | Description |
|--------|-----|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login → returns JWT token |

### Products (Public)
| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/products | Get all products (with filter/search/pagination) |
| GET | /api/products/featured | Featured products |
| GET | /api/products/new-arrivals | New arrivals |
| GET | /api/products/{id} | Product by ID |
| GET | /api/products/categories | All categories |

### Cart (Requires JWT)
| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/cart | Get current user's cart |
| POST | /api/cart/add | Add item to cart |
| PUT | /api/cart/update/{itemId} | Update item quantity |
| DELETE | /api/cart/remove/{itemId} | Remove item |
| DELETE | /api/cart/clear | Clear entire cart |

### Orders (Requires JWT)
| Method | URL | Description |
|--------|-----|-------------|
| POST | /api/orders/checkout | Place order (COD or Razorpay) |
| POST | /api/orders/payment/verify | Verify Razorpay payment |
| GET | /api/orders/my | Get my orders |
| GET | /api/orders/{id} | Order details |

### Admin (Requires JWT + ADMIN role)
| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/admin/dashboard | Dashboard stats |
| GET | /api/admin/products | All products (paginated) |
| POST | /api/admin/products | Create product |
| PUT | /api/admin/products/{id} | Update product |
| DELETE | /api/admin/products/{id} | Delete product |
| GET | /api/admin/orders | All orders |
| PUT | /api/admin/orders/{id}/status | Update order status |
| GET | /api/admin/users | All customers |

---

## ⚙️ Setup Instructions

### Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 18+
- MySQL 8.0+

---

### STEP 1 — Create MySQL Database

Open MySQL and run:
```sql
CREATE DATABASE brandshub_db;
```

---

### STEP 2 — Configure Backend

Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.password=YOUR_MYSQL_PASSWORD

razorpay.key.id=YOUR_RAZORPAY_KEY_ID
razorpay.key.secret=YOUR_RAZORPAY_KEY_SECRET
```

> Get Razorpay keys free at: https://dashboard.razorpay.com → Settings → API Keys

---

### STEP 3 — Run Backend

Open terminal, go to backend folder:
```bash
cd brandshub-fullstack/backend
mvn spring-boot:run
```

Backend runs at: **http://localhost:8080**

On first run, it auto-creates:
- ✅ Admin user: `admin@brandshub.in` / `admin123`
- ✅ 10 sample products

---

### STEP 4 — Run Frontend

Open a NEW terminal, go to frontend folder:
```bash
cd brandshub-fullstack/frontend
npm install
npm start
```

Frontend runs at: **http://localhost:3000**

---

## 🔐 Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@brandshub.in | admin123 |
| Customer | Register at /register | your choice |

---

## 🌐 Pages

| Page | URL |
|------|-----|
| Home | http://localhost:3000 |
| Shop | http://localhost:3000/shop |
| Product Detail | http://localhost:3000/product/:id |
| Cart | http://localhost:3000/cart |
| Checkout + Razorpay | http://localhost:3000/checkout |
| My Orders | http://localhost:3000/orders |
| Profile | http://localhost:3000/profile |
| Admin Dashboard | http://localhost:3000/admin |
| Admin Products | http://localhost:3000/admin/products |
| Admin Orders | http://localhost:3000/admin/orders |
| Admin Customers | http://localhost:3000/admin/users |

---

## 💳 Razorpay Integration

1. Go to https://dashboard.razorpay.com
2. Sign up for free test account
3. Go to Settings → API Keys → Generate Test Key
4. Copy **Key ID** and **Key Secret**
5. Paste them in `application.properties`

In test mode, use card: `4111 1111 1111 1111` | CVV: `123` | Expiry: any future date

---

## 🏗️ Technology Stack

| Layer | Technology |
|-------|-----------|
| Backend | Spring Boot 3.2 + Java 17 |
| Authentication | Spring Security + JWT (jjwt 0.12) |
| Database | MySQL 8 + Spring Data JPA + Hibernate |
| Payment | Razorpay Java SDK + JS Checkout |
| Frontend | React 18 + React Router v6 |
| HTTP Client | Axios |
| State Management | React Context API |
| Notifications | React Hot Toast |
| Icons | React Icons |
| Styling | Pure CSS (Black & Yellow theme) |

---

## ⚠️ Common Errors

**`mvn: not recognized`** → Maven not installed or not in PATH

**`npm: not recognized`** → Node.js not installed. Download from https://nodejs.org

**`Access denied for user 'root'`** → Wrong MySQL password in application.properties

**`CORS error in browser`** → Make sure backend is running on port 8080

**`Razorpay not loading`** → Check your Key ID in application.properties

---

*Built with ❤️ for BRANDS HUB*
