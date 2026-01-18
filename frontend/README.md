# Neuron - Learn Differently

A premium study materials platform for Class 10 students, offering comprehensive PDFs, video lectures, and subscription-based access to educational content.

## Features

- **User Authentication** - Secure registration and login with JWT
- **Subject Dashboard** - Browse available subjects by board (ICSE, CBSE, State Board)
- **Subscription System** - Razorpay-integrated payments for subject access
- **Material Viewer** - Protected PDF and video content with watermarks
- **Admin Panel** - Full CRUD management for boards, subjects, and materials
- **UI Protection** - Anti-piracy measures (disabled right-click, keyboard shortcuts)

## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS, Shadcn/UI
- **Backend:** FastAPI, MongoDB
- **Payments:** Razorpay

## Getting Started

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
```

### Environment Variables

Create a `.env` file with:

```
REACT_APP_BACKEND_URL=your_backend_url
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components
│   ├── admin/      # Admin panel pages
│   └── ...         # Client pages
├── lib/            # Utility functions
└── hooks/          # Custom React hooks
```

## Deployment

### Vercel
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy

## License

© 2026 Neuron. All rights reserved.
