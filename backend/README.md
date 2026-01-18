# Neuron Backend

FastAPI-based backend for the Neuron by ELV educational platform.

## 🛠 Tech Stack

- **FastAPI** - Modern Python web framework
- **MongoDB** - NoSQL database (Motor async driver)
- **JWT** - Authentication tokens
- **Razorpay** - Payment gateway integration
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

## 📁 Project Structure

```
backend/
├── server.py          # Main FastAPI application
├── requirements.txt   # Python dependencies
├── .env              # Environment variables
└── README.md         # This file
```

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- MongoDB (local or Atlas)
- Razorpay account (for payments)

### Installation

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### Environment Variables

Create a `.env` file:

```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=neuron_db
JWT_SECRET=your-super-secret-key-change-in-production
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

## 📊 Database Schema

### Collections

#### users
```json
{
  "id": "user-abc123",
  "email": "student@example.com",
  "password_hash": "hashed_password",
  "name": "Student Name",
  "phone": "+91 9999999999",
  "city": "Mumbai",
  "created_at": "2026-01-18T12:00:00Z"
}
```

#### admins
```json
{
  "id": "admin-001",
  "email": "admin@neuronlearn.com",
  "password_hash": "hashed_password"
}
```

#### boards
```json
{
  "id": "board-icse",
  "name": "ICSE",
  "full_name": "Indian Certificate of Secondary Education"
}
```

#### subjects
```json
{
  "id": "subj-abc123",
  "board": "ICSE",
  "class_name": "Class 10",
  "subject_name": "Biology",
  "price": 500,
  "duration_months": 6,
  "is_visible": true
}
```

#### materials
```json
{
  "id": "mat-abc123",
  "subject_id": "subj-abc123",
  "title": "Chapter 1 Notes",
  "type": "pdf",
  "link": "https://drive.google.com/...",
  "description": "Comprehensive notes"
}
```

#### subscriptions
```json
{
  "id": "sub-abc123",
  "user_id": "user-abc123",
  "subject_id": "subj-abc123",
  "start_date": "2026-01-18T12:00:00Z",
  "end_date": "2026-07-18T12:00:00Z",
  "razorpay_payment_id": "pay_xxxxx"
}
```

#### payments
```json
{
  "id": "pay-abc123",
  "user_id": "user-abc123",
  "order_id": "order_xxxxx",
  "payment_id": "pay_xxxxx",
  "amount": 500,
  "status": "completed",
  "created_at": "2026-01-18T12:00:00Z"
}
```

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/me` | Get current user |

### User Profile

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile` | Get user profile |
| PUT | `/api/profile` | Update profile |
| POST | `/api/profile/password` | Change password |

### Subjects & Materials

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/subjects` | List visible subjects |
| GET | `/api/materials/{subject_id}` | Get materials (requires subscription) |
| GET | `/api/subscriptions` | Get user's subscriptions |

### Payments

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/order` | Create Razorpay order |
| POST | `/api/payments/verify` | Verify payment |

### Admin - Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/login` | Admin login |

### Admin - Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Get dashboard statistics |

### Admin - Boards

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/boards` | List all boards |
| POST | `/api/admin/boards` | Create board |
| PUT | `/api/admin/boards/{id}` | Update board |
| DELETE | `/api/admin/boards/{id}` | Delete board |

### Admin - Subjects

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/subjects` | List all subjects |
| POST | `/api/admin/subjects` | Create subject |
| PUT | `/api/admin/subjects/{id}` | Update subject |
| PUT | `/api/admin/subjects/{id}/visibility` | Toggle visibility |
| DELETE | `/api/admin/subjects/{id}` | Delete subject |

### Admin - Materials

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/materials` | List all materials |
| POST | `/api/admin/materials` | Create material |
| PUT | `/api/admin/materials/{id}` | Update material |
| DELETE | `/api/admin/materials/{id}` | Delete material |

### Admin - Read Only

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | List all users |
| GET | `/api/admin/subscriptions` | List all subscriptions |
| GET | `/api/admin/payments` | List all payments |

## 🔒 Authentication

### JWT Token Flow
1. User logs in with email/password
2. Server validates credentials and returns JWT token
3. Client stores token in localStorage
4. Client sends token in `Authorization: Bearer <token>` header
5. Server validates token on protected routes

### Password Hashing
Uses `passlib` with bcrypt for secure password hashing.

## 💳 Payment Flow

1. **Create Order**
   - Client calls `/api/payments/order` with subject_id
   - Server creates Razorpay order
   - Returns order_id to client

2. **Process Payment**
   - Client opens Razorpay checkout
   - User completes payment
   - Razorpay returns payment details

3. **Verify Payment**
   - Client calls `/api/payments/verify` with payment details
   - Server verifies signature with Razorpay
   - Creates subscription record
   - Returns success response

## 🧪 Testing

### Health Check
```bash
curl http://localhost:8001/api/health
```

### Create User
```bash
curl -X POST http://localhost:8001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123","name":"Test User","phone":"+91 9999999999","city":"Mumbai"}'
```

### Login
```bash
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'
```

## 📋 Dependencies

```
fastapi
uvicorn[standard]
motor
pymongo
python-jose[cryptography]
passlib[bcrypt]
python-multipart
python-dotenv
razorpay
pydantic
```

## 🚀 Deployment

### Production Considerations
- Use strong JWT_SECRET
- Enable HTTPS
- Set up proper CORS origins
- Use MongoDB Atlas for production
- Configure rate limiting
- Set up logging and monitoring

### Docker (Optional)
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8001"]
```

## 📄 License

© 2026 Neuron by ELV. All rights reserved.
