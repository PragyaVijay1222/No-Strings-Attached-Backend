# 🧵 No Strings Attached — Backend

This is the **backend server** for **No Strings Attached**, a full-stack thrift and sustainable fashion marketplace. The backend is built with **Node.js**, **Express**, and **MongoDB**, and it powers authentication, product management, chat, checkout, order processing, feedback collection, and email notifications.

---

## ⚙️ Tech Stack

- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT Authentication**
- **Socket.IO** (for real-time chat)
- **Nodemailer** (email notifications)
- **dotenv** (environment variable management)
- **CORS** & **Multer**

---

## 🚀 Features

- 🔐 User authentication with JWT (signup, login, profile management)
- 🧵 Product management (listing, editing, deleting)
- 💼 Add-to-bag, favorites, and listing tracking
- ✅ Checkout flow and order grouping by seller UPI
- 📤 Email notifications on order placement
- 💬 Real-time buyer-seller messaging
- 📋 Feedback system
- ❌ Sold product validation
- 🛡 Middleware-based protected routes

---

## 📂 Folder Structure

```
/Server
├── /middleware
│   └── auth.js
│   └── authRoutes.js
├── /model
│   └── FeedbackSchema.js
│   └── Message.js
│   └── OrderSchema.js
│   └── ProductsDetailsSchema.js
│   └── UserProfileSchema.js
├── /routes
│   └── bagAndFavorites.js
│   └── chat.js
│   └── checkout.js
│   └── feedback.js
│   └── login.js
│   └── order.js
│   └── patchProducts.js
│   └── products.js
│   └── profile.js
│   └── sell.js
│   └── signup.js
│   └── user.js
├── /utils
│   └── sendEmail.js
├── .env
├── server.js
```

---

## 🔐 Environment Variables

Create a `.env` file at the root of `/Server` and add:

```env
MONGODB_URL=mongodb+srv://pragyavijay20318:cDk7FuS1esDrpo0O@cluster0.iumxged.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET_KEY=mySuperSecretJWTKey!1x83q4jd7v!@#*&g78sf5v
PORT=8080
NODE_ENV=development
EMAIL_USER=pragyavijay20318@gmail.com
EMAIL_PASS=lycuaqfsswygtnzc
```

---

## 📦 API Overview

### 👤 Auth & User
- `POST /signup` — Register a new user
- `POST /login` — Authenticate user
- `GET /profile/:id` — Get user profile

### 🧵 Products
- `POST /sell` — Upload a new product
- `GET /products` — List all products
- `PATCH /products/:id` — Update or mark product as sold

### 🛍 Bag & Favorites
- `POST /bag` — Add to bag
- `POST /favorite` — Add to favorites
- `GET /bag/:userId` — Get bag items

### 💸 Checkout & Orders
- `POST /checkout` — Handle grouped UPI checkout
- `POST /order/place` — Place an order
- `GET /orders/:userId` — View order history

### 💬 Chat
- `GET /chat/:userId` — Get all messages
- `POST /chat/send` — Send a message

### 📋 Feedback
- `POST /feedback` — Submit feedback
- `GET /feedback` — Admin fetch feedback

---

## 🧪 Running Locally

```bash
git clone https://github.com/your-username/no-strings-attached.git
cd no-strings-attached/Server
npm install
npm run dev
```

---

## 📬 Email Notifications

Uses Gmail SMTP via Nodemailer to send emails on order placement and (future) status updates.

✅ Uses Gmail App Password  
📤 Email sent from: `EMAIL_USER` in `.env`

---

## 🔮 Future Development

- 💸 **Razorpay UPI integration** for real payments
- 🧾 PDF invoices and downloadable receipts
- 📧 Automated email confirmation with item details
- ❌ Account deletion and GDPR compliance
- 📊 Admin dashboard and analytics
- 🔁 Order status tracking (shipped, delivered, etc.)

---

## 📡 Deployment

Deployed via **Render.com**  
**Base URL:** `https://no-strings-attached-backend.onrender.com/`

---

## 🛡️ Security

- Passwords hashed via bcrypt
- Tokens issued with JWT and verified using middleware
- Server environment isolated using `.env`

---

## 👩‍💻 Author

**Pragya Vijay**  
B.Tech CSE | Full Stack Developer | Open to Opportunities

---

## 📝 License

This project is licensed under the [MIT License](LICENSE).
