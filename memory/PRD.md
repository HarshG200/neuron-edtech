# Neuron - Study Materials Platform PRD

## Project Overview
A production-grade EdTech platform for Class 10 students to access study materials, video lectures, and comprehensive notes with a subscription-based model.

## Tech Stack
- **Frontend:** React 19, Vite, Tailwind CSS, Shadcn/UI, Lucide-React
- **Backend:** FastAPI, MongoDB (pymongo)
- **Payments:** Razorpay Integration
- **Authentication:** JWT-based

## Core Features

### ✅ Implemented Features

#### User Authentication
- User registration with name, email, phone, city, password
- JWT-based login/logout
- Profile management (update profile, change password)

#### Subject Dashboard
- Responsive grid of subject cards
- Conditional "Buy Plan" / "Open Material" buttons
- Subject filtering by board (ICSE, CBSE)
- Subject visibility toggle (admin-controlled)

#### Subscription & Payments
- Razorpay order creation
- Payment verification webhook
- Subscription tracking with expiry dates
- "My Plans" page showing active subscriptions

#### Material Viewer
- PDF embedding (Google Drive)
- Dynamic email watermark (animated)
- **UI Protection:**
  - Right-click disabled
  - Keyboard shortcuts blocked (Ctrl+S, Ctrl+P, Ctrl+U, F12, DevTools)
  - Text selection disabled on protected content
  - Copy/Drag disabled when viewing materials
  - Print protection via CSS

#### Admin Panel (Token-protected)
- CRUD for Boards, Subjects, Materials
- View Users, Subscriptions, Payments
- Subject visibility toggle
- Tab Order: Boards → Users → Subjects → Materials → Subscriptions → Payments

#### Branding & UI
- Neuron branding with new logo (Book with neurons - "Learn differently. By a doctor")
- Logo visible on all pages (Auth, Dashboard, Admin)
- Modern slate/indigo palette
- Compact footer with contact info, privacy notice, and policy links
- Consistent max-w-7xl containers across all pages

### 🟡 Pending Features (P1-P2)

#### P1 - Video Player with Bunny.net
- Embed videos using Bunny.net Stream links
- Location: `MaterialViewer.js` - currently only handles PDFs

#### P2 - Additional Enhancements
- End-to-end testing of complete user flow
- Additional admin analytics

## Database Schema (MongoDB)

```
users: {email, password_hash, name, phone, city, created_at}
admins: {email, password_hash}
boards: {name, full_name}
subjects: {name, description, board_id, price, image_url, is_visible}
materials: {subject_id, title, type:['pdf', 'video'], link, description}
subscriptions: {user_id, subject_id, expires_at, created_at, razorpay_payment_id}
payments: {user_id, order_id, amount, created_at}
```

## Key Files
- `/app/backend/server.py` - All backend logic
- `/app/frontend/src/App.js` - Main entry, routing
- `/app/frontend/src/pages/Dashboard.js` - Student dashboard
- `/app/frontend/src/pages/MaterialViewer.js` - Material viewer with protection
- `/app/frontend/src/pages/admin/` - Admin panel components
- `/app/frontend/src/components/Footer.js` - Compact footer
- `/app/frontend/src/components/Logo.js` - Logo component
- `/app/frontend/public/neuron-logo.png` - Updated logo image

## Test Credentials
- **Admin:** admin@neuronlearn.com / admin123
- **User:** Create via registration

---
*Last Updated: January 2026*
