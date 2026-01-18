# Neuron Frontend

React-based frontend for the Neuron by ELV educational platform.

## 🛠 Tech Stack

- **React 19** - UI library
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first CSS
- **Shadcn/UI** - Component library
- **Lucide React** - Icon library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Sonner** - Toast notifications

## 📁 Project Structure

```
frontend/
├── public/
│   └── neuron-logo.png      # Brand logo
├── src/
│   ├── components/
│   │   ├── ui/              # Shadcn/UI components
│   │   ├── AccountMenu.jsx  # User dropdown menu
│   │   ├── Footer.jsx       # Site footer
│   │   ├── Logo.jsx         # Logo component
│   │   └── ScrollToTop.jsx  # Scroll restoration
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── tabs/        # Admin tab components
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   └── AdminPage.jsx
│   │   ├── AuthPage.jsx     # Login/Register
│   │   ├── Dashboard.jsx    # Subject listing
│   │   ├── MaterialViewer.jsx
│   │   ├── MyPlans.jsx
│   │   ├── Settings.jsx
│   │   ├── PrivacyPolicy.jsx
│   │   ├── TermsOfService.jsx
│   │   ├── RefundPolicy.jsx
│   │   └── CancellationPolicy.jsx
│   ├── hooks/
│   │   └── use-toast.jsx    # Toast hook
│   ├── lib/
│   │   └── utils.js         # Utility functions
│   ├── App.jsx              # Main app component
│   ├── App.css              # Global styles
│   ├── index.jsx            # Entry point
│   └── index.css            # Tailwind imports
├── index.html               # HTML template
├── vite.config.js           # Vite configuration
├── tailwind.config.cjs      # Tailwind configuration
├── postcss.config.cjs       # PostCSS configuration
├── jsconfig.json            # JS path aliases
├── package.json             # Dependencies
└── .env                     # Environment variables
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Yarn package manager

### Installation

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview
```

### Environment Variables

Create a `.env` file in the frontend root:

```env
REACT_APP_BACKEND_URL=http://localhost:8001
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
```

## 🎨 UI Components

### Shadcn/UI Components Used
- Button, Input, Card
- Dialog, Tabs, Select
- Table, Badge, Switch
- Toast (Sonner), Tooltip
- Avatar, Dropdown Menu

### Custom Components
- `Logo` - Brand logo display
- `Footer` - Site-wide footer with links
- `AccountMenu` - User profile dropdown
- `ScrollToTop` - Smooth scroll on navigation

## 📱 Pages

### Public Pages
- **Auth** (`/auth`) - Login and registration forms
- **Privacy Policy** (`/privacy`)
- **Terms of Service** (`/terms`)
- **Refund Policy** (`/refund`)
- **Cancellation Policy** (`/cancellation`)

### Protected Pages (Requires Login)
- **Dashboard** (`/dashboard`) - Browse subjects
- **My Plans** (`/my-plans`) - View subscriptions
- **Settings** (`/settings`) - Profile management
- **Material Viewer** (`/materials/:id`) - View PDFs/Videos

### Admin Pages
- **Admin Panel** (`/admin`) - Full admin dashboard

## 🔒 Security Features

- JWT token stored in localStorage
- Protected routes with auth checks
- Content protection on material viewer:
  - Right-click disabled
  - Keyboard shortcuts blocked
  - Text selection disabled
  - Print protection CSS

## 🎯 Key Features

### Razorpay Integration
```jsx
// Payment flow in Dashboard.jsx
const options = {
  key: process.env.REACT_APP_RAZORPAY_KEY_ID,
  amount: order.amount,
  currency: "INR",
  order_id: order.id,
  handler: async (response) => {
    // Verify payment on backend
  }
};
const razorpay = new window.Razorpay(options);
razorpay.open();
```

### Dynamic Watermark
```jsx
// In MaterialViewer.jsx
<div className="watermark-overlay">
  {user?.email}
</div>
```

## 📦 Build Output

Production build creates optimized files in `/build`:
- `index.html` - Entry point
- `assets/index.css` - Compiled CSS (~63KB)
- `assets/index.js` - Bundled JS (~540KB)

## 🧪 Development

### Linting
```bash
yarn lint
```

### Path Aliases
Use `@/` to import from `src/`:
```jsx
import { Button } from '@/components/ui/button';
```

## 📄 License

© 2026 Neuron by ELV. All rights reserved.
