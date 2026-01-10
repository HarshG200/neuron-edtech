from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
import razorpay
import hmac
import hashlib

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Razorpay client
razorpay_client = razorpay.Client(auth=(os.environ.get('RAZORPAY_KEY_ID', 'rzp_test_mock'), os.environ.get('RAZORPAY_KEY_SECRET', 'mock_secret')))

# JWT settings
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key-change-in-production')
JWT_ALGORITHM = 'HS256'

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

security = HTTPBearer()

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ============= Models =============

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str
    phone: str
    city: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    email: str
    name: str
    phone: str
    city: str
    created_at: str

class Subject(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    board: str
    class_name: str
    subject_name: str
    price: int
    duration_months: int = 6

class Subscription(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_email: str
    subject_id: str
    subject_name: str
    price: int
    duration_months: int
    start_date: str
    end_date: str
    payment_status: str

class Material(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    subject_id: str
    title: str
    type: str  # 'pdf' or 'video'
    link: str
    description: Optional[str] = None

class PaymentOrder(BaseModel):
    subject_id: str
    amount: int

class PaymentOrderResponse(BaseModel):
    order_id: str
    amount: int
    currency: str
    subject_id: str

# ============= Auth Functions =============

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_jwt_token(email: str) -> str:
    payload = {
        'email': email,
        'exp': datetime.now(timezone.utc) + timedelta(days=30)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_jwt_token(token: str) -> dict:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = decode_jwt_token(token)
    email = payload.get('email')
    
    user = await db.users.find_one({'email': email}, {'_id': 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# ============= Auth Routes =============

@api_router.post("/auth/register")
async def register(user_data: UserRegister):
    # Check if user exists
    existing_user = await db.users.find_one({'email': user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user_doc = {
        'email': user_data.email,
        'password': hash_password(user_data.password),
        'name': user_data.name,
        'phone': user_data.phone,
        'city': user_data.city,
        'created_at': datetime.now(timezone.utc).isoformat()
    }
    
    await db.users.insert_one(user_doc)
    token = create_jwt_token(user_data.email)
    
    return {
        'token': token,
        'user': {
            'email': user_data.email,
            'name': user_data.name,
            'phone': user_data.phone,
            'city': user_data.city
        }
    }

@api_router.post("/auth/login")
async def login(credentials: UserLogin):
    user = await db.users.find_one({'email': credentials.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(credentials.password, user['password']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_jwt_token(credentials.email)
    
    return {
        'token': token,
        'user': {
            'email': user['email'],
            'name': user['name'],
            'phone': user['phone'],
            'city': user['city']
        }
    }

@api_router.get("/auth/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return {
        'email': current_user['email'],
        'name': current_user['name'],
        'phone': current_user['phone'],
        'city': current_user['city']
    }

@api_router.put("/auth/update-profile")
async def update_profile(
    name: str = None,
    phone: str = None,
    city: str = None,
    current_user: dict = Depends(get_current_user)
):
    """Update user profile"""
    update_data = {}
    if name:
        update_data['name'] = name
    if phone:
        update_data['phone'] = phone
    if city:
        update_data['city'] = city
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    
    await db.users.update_one(
        {'email': current_user['email']},
        {'$set': update_data}
    )
    
    # Get updated user
    updated_user = await db.users.find_one({'email': current_user['email']}, {'_id': 0, 'password': 0})
    
    return {
        'message': 'Profile updated successfully',
        'user': {
            'email': updated_user['email'],
            'name': updated_user['name'],
            'phone': updated_user['phone'],
            'city': updated_user['city']
        }
    }

@api_router.put("/auth/change-password")
async def change_password(
    current_password: str,
    new_password: str,
    current_user: dict = Depends(get_current_user)
):
    """Change user password"""
    # Verify current password
    user = await db.users.find_one({'email': current_user['email']})
    if not verify_password(current_password, user['password']):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    
    # Update password
    await db.users.update_one(
        {'email': current_user['email']},
        {'$set': {'password': hash_password(new_password)}}
    )
    
    return {'message': 'Password changed successfully'}

# ============= Subject Routes =============

@api_router.get("/subjects", response_model=List[Subject])
async def get_subjects():
    subjects = await db.subjects.find({}, {'_id': 0}).to_list(100)
    return subjects

@api_router.post("/subjects/seed")
async def seed_subjects():
    """Seed initial subjects"""
    subjects = [
        {'id': 'icse-10-biology', 'board': 'ICSE', 'class_name': 'Class 10', 'subject_name': 'Biology', 'price': 500, 'duration_months': 6},
        {'id': 'icse-10-chemistry', 'board': 'ICSE', 'class_name': 'Class 10', 'subject_name': 'Chemistry', 'price': 500, 'duration_months': 6},
        {'id': 'icse-10-physics', 'board': 'ICSE', 'class_name': 'Class 10', 'subject_name': 'Physics', 'price': 600, 'duration_months': 6},
        {'id': 'cbse-10-biology', 'board': 'CBSE', 'class_name': 'Class 10', 'subject_name': 'Biology', 'price': 500, 'duration_months': 6},
        {'id': 'cbse-10-chemistry', 'board': 'CBSE', 'class_name': 'Class 10', 'subject_name': 'Chemistry', 'price': 500, 'duration_months': 6},
        {'id': 'cbse-10-physics', 'board': 'CBSE', 'class_name': 'Class 10', 'subject_name': 'Physics', 'price': 600, 'duration_months': 6},
    ]
    
    await db.subjects.delete_many({})
    await db.subjects.insert_many(subjects)
    
    return {'message': 'Subjects seeded successfully', 'count': len(subjects)}

# ============= Subscription Routes =============

@api_router.get("/subscriptions/my", response_model=List[Subscription])
async def get_my_subscriptions(current_user: dict = Depends(get_current_user)):
    subscriptions = await db.subscriptions.find(
        {'user_email': current_user['email']},
        {'_id': 0}
    ).to_list(100)
    return subscriptions

@api_router.get("/subscriptions/check/{subject_id}")
async def check_subscription(subject_id: str, current_user: dict = Depends(get_current_user)):
    subscription = await db.subscriptions.find_one({
        'user_email': current_user['email'],
        'subject_id': subject_id,
        'payment_status': 'completed'
    }, {'_id': 0})
    
    if not subscription:
        return {'has_subscription': False}
    
    # Check if subscription is active
    end_date = datetime.fromisoformat(subscription['end_date'])
    is_active = end_date > datetime.now(timezone.utc)
    
    return {
        'has_subscription': is_active,
        'subscription': subscription if is_active else None
    }

# ============= Material Routes =============

@api_router.get("/materials/{subject_id}", response_model=List[Material])
async def get_materials(subject_id: str, current_user: dict = Depends(get_current_user)):
    # Check subscription (RLS)
    subscription = await db.subscriptions.find_one({
        'user_email': current_user['email'],
        'subject_id': subject_id,
        'payment_status': 'completed'
    })
    
    if not subscription:
        raise HTTPException(status_code=403, detail="No active subscription for this subject")
    
    # Check if subscription is active
    end_date = datetime.fromisoformat(subscription['end_date'])
    if end_date <= datetime.now(timezone.utc):
        raise HTTPException(status_code=403, detail="Subscription expired")
    
    materials = await db.materials.find({'subject_id': subject_id}, {'_id': 0}).to_list(100)
    return materials

@api_router.post("/materials/seed")
async def seed_materials():
    """Seed sample materials"""
    materials = [
        {
            'id': 'mat-1',
            'subject_id': 'icse-10-biology',
            'title': 'Main Concept Clearing Notes',
            'type': 'pdf',
            'link': 'https://drive.google.com/file/d/1example/preview',
            'description': 'Comprehensive notes covering all main concepts'
        },
        {
            'id': 'mat-2',
            'subject_id': 'icse-10-biology',
            'title': 'Last Minute Revision Note',
            'type': 'pdf',
            'link': 'https://drive.google.com/file/d/1example2/preview',
            'description': 'Quick revision notes for exam preparation'
        },
        {
            'id': 'mat-3',
            'subject_id': 'icse-10-biology',
            'title': 'Last Minute Revision Video',
            'type': 'video',
            'link': 'https://iframe.mediadelivery.net/embed/sampleLibrary/sampleVideoId',
            'description': 'Video lecture for last minute revision'
        },
    ]
    
    await db.materials.delete_many({})
    await db.materials.insert_many(materials)
    
    return {'message': 'Materials seeded successfully', 'count': len(materials)}

# ============= Payment Routes =============

@api_router.post("/payments/create-order", response_model=PaymentOrderResponse)
async def create_payment_order(order_data: PaymentOrder, current_user: dict = Depends(get_current_user)):
    # Get subject details
    subject = await db.subjects.find_one({'id': order_data.subject_id}, {'_id': 0})
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    # Create Razorpay order
    try:
        razorpay_order = razorpay_client.order.create({
            'amount': order_data.amount * 100,  # Convert to paise
            'currency': 'INR',
            'payment_capture': 1,
            'notes': {
                'subject_id': order_data.subject_id,
                'user_email': current_user['email']
            }
        })
        
        # Store order in database
        payment_doc = {
            'order_id': razorpay_order['id'],
            'user_email': current_user['email'],
            'subject_id': order_data.subject_id,
            'amount': order_data.amount,
            'currency': 'INR',
            'status': 'created',
            'created_at': datetime.now(timezone.utc).isoformat()
        }
        await db.payments.insert_one(payment_doc)
        
        return {
            'order_id': razorpay_order['id'],
            'amount': order_data.amount,
            'currency': 'INR',
            'subject_id': order_data.subject_id
        }
    except Exception as e:
        logger.error(f"Error creating Razorpay order: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create payment order")

@api_router.post("/payments/webhook")
async def payment_webhook(request: Request):
    """Handle Razorpay webhook"""
    try:
        payload = await request.body()
        signature = request.headers.get('X-Razorpay-Signature', '')
        webhook_secret = os.environ.get('RAZORPAY_WEBHOOK_SECRET', '')
        
        # Verify signature (if webhook secret is configured)
        if webhook_secret:
            expected_signature = hmac.new(
                webhook_secret.encode('utf-8'),
                payload,
                hashlib.sha256
            ).hexdigest()
            
            if signature != expected_signature:
                raise HTTPException(status_code=400, detail="Invalid signature")
        
        # Parse payload
        import json
        event = json.loads(payload)
        
        if event['event'] == 'payment.captured':
            payment_entity = event['payload']['payment']['entity']
            order_id = payment_entity['order_id']
            
            # Get payment record
            payment = await db.payments.find_one({'order_id': order_id})
            if not payment:
                return {'status': 'payment not found'}
            
            # Update payment status
            await db.payments.update_one(
                {'order_id': order_id},
                {'$set': {'status': 'captured', 'payment_id': payment_entity['id']}}
            )
            
            # Get subject
            subject = await db.subjects.find_one({'id': payment['subject_id']}, {'_id': 0})
            if not subject:
                return {'status': 'subject not found'}
            
            # Create subscription (6 months)
            start_date = datetime.now(timezone.utc)
            end_date = start_date + timedelta(days=subject['duration_months'] * 30)
            
            subscription_doc = {
                'id': f"sub-{order_id}",
                'user_email': payment['user_email'],
                'subject_id': payment['subject_id'],
                'subject_name': f"{subject['board']} - {subject['class_name']} - {subject['subject_name']}",
                'price': payment['amount'],
                'duration_months': subject['duration_months'],
                'start_date': start_date.isoformat(),
                'end_date': end_date.isoformat(),
                'payment_status': 'completed',
                'order_id': order_id,
                'created_at': datetime.now(timezone.utc).isoformat()
            }
            
            await db.subscriptions.insert_one(subscription_doc)
            
            return {'status': 'success'}
        
        return {'status': 'event not handled'}
        
    except Exception as e:
        logger.error(f"Webhook error: {str(e)}")
        return {'status': 'error', 'message': str(e)}

@api_router.post("/payments/verify")
async def verify_payment(payment_id: str, order_id: str, signature: str, current_user: dict = Depends(get_current_user)):
    """Verify payment and create subscription"""
    try:
        # Verify signature
        params_dict = {
            'razorpay_payment_id': payment_id,
            'razorpay_order_id': order_id,
            'razorpay_signature': signature
        }
        
        razorpay_client.utility.verify_payment_signature(params_dict)
        
        # Get payment record
        payment = await db.payments.find_one({'order_id': order_id})
        if not payment:
            raise HTTPException(status_code=404, detail="Payment not found")
        
        # Update payment status
        await db.payments.update_one(
            {'order_id': order_id},
            {'$set': {'status': 'verified', 'payment_id': payment_id}}
        )
        
        # Get subject
        subject = await db.subjects.find_one({'id': payment['subject_id']}, {'_id': 0})
        if not subject:
            raise HTTPException(status_code=404, detail="Subject not found")
        
        # Check if subscription already exists
        existing_sub = await db.subscriptions.find_one({'order_id': order_id})
        if existing_sub:
            return {'status': 'success', 'message': 'Subscription already created'}
        
        # Create subscription
        start_date = datetime.now(timezone.utc)
        end_date = start_date + timedelta(days=subject['duration_months'] * 30)
        
        subscription_doc = {
            'id': f"sub-{order_id}",
            'user_email': current_user['email'],
            'subject_id': payment['subject_id'],
            'subject_name': f"{subject['board']} - {subject['class_name']} - {subject['subject_name']}",
            'price': payment['amount'],
            'duration_months': subject['duration_months'],
            'start_date': start_date.isoformat(),
            'end_date': end_date.isoformat(),
            'payment_status': 'completed',
            'order_id': order_id,
            'created_at': datetime.now(timezone.utc).isoformat()
        }
        
        await db.subscriptions.insert_one(subscription_doc)
        
        return {'status': 'success', 'message': 'Payment verified and subscription created'}
        
    except razorpay.errors.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid payment signature")
    except Exception as e:
        logger.error(f"Payment verification error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Payment verification failed: {str(e)}")

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
