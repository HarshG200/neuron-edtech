# EduStream - Study Materials Platform

A production-grade EdTech platform for Class 10 students to access premium study materials with secure content delivery and subscription management.

## 🎯 Features

### Core Features
- **User Authentication**: JWT-based secure authentication with registration and login
- **Subject Catalog**: Browse ICSE and CBSE Class 10 subjects (Biology, Chemistry, Physics)
- **Subscription Management**: 6-month subscription plans with automatic expiry tracking
- **Payment Integration**: Razorpay payment gateway with webhook support
- **Material Viewer**: Secure PDF and video player with anti-piracy measures
- **My Plans Dashboard**: View active subscriptions with detailed plan information

### Security Features (Anti-Piracy)
- **Dynamic Watermark**: Moving watermark overlay showing user email on videos/PDFs
- **Content Protection**: Right-click disabled, save shortcuts blocked
- **Row-Level Security**: Materials only accessible with valid subscription
- **JWT Authentication**: Secure API access with token-based auth

## 🏗️ Tech Stack

### Backend
- **FastAPI** - High-performance Python web framework
- **MongoDB** - NoSQL database for flexible data storage
- **Razorpay SDK** - Payment processing
- **PyJWT** - JWT token management
- **Bcrypt** - Password hashing

### Frontend
- **React 19** - Modern UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/UI** - Beautiful component library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Sonner** - Toast notifications

## 📁 Project Structure

```
/app
├── backend/
│   ├── server.py           # FastAPI application
│   ├── .env               # Backend environment variables
│   └── requirements.txt   # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── AuthPage.js        # Login/Register
│   │   │   ├── Dashboard.js       # Subject catalog
│   │   │   ├── MyPlans.js         # Subscriptions list
│   │   │   └── MaterialViewer.js  # PDF/Video viewer
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.css
│   ├── .env               # Frontend environment variables
│   └── package.json       # Node dependencies
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- MongoDB running on localhost:27017

### Environment Variables

**Backend (.env)**
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=test_database
CORS_ORIGINS=*
JWT_SECRET=your-secret-key-change-in-production
RAZORPAY_KEY_ID=rzp_test_YourKeyId
RAZORPAY_KEY_SECRET=YourSecretKey
RAZORPAY_WEBHOOK_SECRET=YourWebhookSecret
```

**Frontend (.env)**
```
REACT_APP_BACKEND_URL=https://your-backend-url.com
REACT_APP_RAZORPAY_KEY_ID=rzp_test_YourKeyId
```

### Demo User
- Email: `demo@edustream.com`
- Password: `demo123`
- Active subscriptions: ICSE Biology, ICSE Chemistry

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Subjects
- `GET /api/subjects` - List all subjects
- `POST /api/subjects/seed` - Seed initial subjects

### Subscriptions
- `GET /api/subscriptions/my` - Get user's subscriptions (requires auth)
- `GET /api/subscriptions/check/{subject_id}` - Check subscription status (requires auth)

### Materials
- `GET /api/materials/{subject_id}` - Get materials for subject (requires auth + subscription)
- `POST /api/materials/seed` - Seed sample materials

### Payments
- `POST /api/payments/create-order` - Create Razorpay order (requires auth)
- `POST /api/payments/verify` - Verify payment signature (requires auth)
- `POST /api/payments/webhook` - Razorpay webhook endpoint

## 💳 Payment Flow

1. User clicks "Buy Plan" on a subject
2. Frontend creates order via `/api/payments/create-order`
3. Razorpay checkout modal opens
4. User completes payment
5. Frontend verifies payment via `/api/payments/verify`
6. Backend creates subscription with 6-month expiry
7. User can now access materials

## 🎯 Next Action Items

### Immediate Enhancements
1. **Payment Testing**: Add Razorpay production keys for live payments
2. **Email Notifications**: Send confirmation emails after subscription purchase
3. **Material Content**: Replace demo links with actual Google Drive and Bunny.net links

### Growth Features
1. **Referral Program**: Reward users for bringing friends (₹50 credit per referral)
2. **Bundle Deals**: Offer discounts for multiple subject purchases (Buy 2, get 10% off)
3. **Progress Tracking**: Track material completion and generate reports

### Revenue Optimization
1. **Limited-Time Offers**: Flash sales on specific subjects
2. **Premium Tier**: Add advanced features (1-on-1 doubt solving, live classes)
3. **Content Expansion**: Add more classes (11, 12) and competitive exam prep

---

**Built with ❤️ using Emergent**
