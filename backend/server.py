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

class PaymentVerification(BaseModel):
    payment_id: str
    order_id: str
    signature: str

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
    # Only return visible subjects for students
    subjects = await db.subjects.find({'is_visible': {'$ne': False}}, {'_id': 0}).to_list(100)
    return subjects

@api_router.post("/subjects/seed")
async def seed_subjects():
    """Seed initial subjects"""
    subjects = [
        {'id': 'icse-10-biology', 'board': 'ICSE', 'class_name': 'Class 10', 'subject_name': 'Biology', 'price': 500, 'duration_months': 6, 'is_visible': True},
        {'id': 'icse-10-chemistry', 'board': 'ICSE', 'class_name': 'Class 10', 'subject_name': 'Chemistry', 'price': 500, 'duration_months': 6, 'is_visible': True},
        {'id': 'icse-10-physics', 'board': 'ICSE', 'class_name': 'Class 10', 'subject_name': 'Physics', 'price': 600, 'duration_months': 6, 'is_visible': True},
        {'id': 'cbse-10-biology', 'board': 'CBSE', 'class_name': 'Class 10', 'subject_name': 'Biology', 'price': 500, 'duration_months': 6, 'is_visible': True},
        {'id': 'cbse-10-chemistry', 'board': 'CBSE', 'class_name': 'Class 10', 'subject_name': 'Chemistry', 'price': 500, 'duration_months': 6, 'is_visible': True},
        {'id': 'cbse-10-physics', 'board': 'CBSE', 'class_name': 'Class 10', 'subject_name': 'Physics', 'price': 600, 'duration_months': 6, 'is_visible': True},
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
async def verify_payment(
    verification_data: PaymentVerification,
    current_user: dict = Depends(get_current_user)
):
    """Verify payment and create subscription"""
    try:
        # Verify signature
        params_dict = {
            'razorpay_payment_id': verification_data.payment_id,
            'razorpay_order_id': verification_data.order_id,
            'razorpay_signature': verification_data.signature
        }
        
        razorpay_client.utility.verify_payment_signature(params_dict)
        
        # Get payment record
        payment = await db.payments.find_one({'order_id': verification_data.order_id})
        if not payment:
            raise HTTPException(status_code=404, detail="Payment not found")
        
        # Update payment status
        await db.payments.update_one(
            {'order_id': verification_data.order_id},
            {'$set': {'status': 'verified', 'payment_id': verification_data.payment_id}}
        )
        
        # Get subject
        subject = await db.subjects.find_one({'id': payment['subject_id']}, {'_id': 0})
        if not subject:
            raise HTTPException(status_code=404, detail="Subject not found")
        
        # Check if subscription already exists
        existing_sub = await db.subscriptions.find_one({'order_id': verification_data.order_id})
        if existing_sub:
            return {'status': 'success', 'message': 'Subscription already created'}
        
        # Create subscription
        start_date = datetime.now(timezone.utc)
        end_date = start_date + timedelta(days=subject['duration_months'] * 30)
        
        subscription_doc = {
            'id': f"sub-{verification_data.order_id}",
            'user_email': current_user['email'],
            'subject_id': payment['subject_id'],
            'subject_name': f"{subject['board']} - {subject['class_name']} - {subject['subject_name']}",
            'price': payment['amount'],
            'duration_months': subject['duration_months'],
            'start_date': start_date.isoformat(),
            'end_date': end_date.isoformat(),
            'payment_status': 'completed',
            'order_id': verification_data.order_id,
            'created_at': datetime.now(timezone.utc).isoformat()
        }
        
        await db.subscriptions.insert_one(subscription_doc)
        
        return {'status': 'success', 'message': 'Payment verified and subscription created'}
        
    except razorpay.errors.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid payment signature")
    except Exception as e:
        logger.error(f"Payment verification error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Payment verification failed: {str(e)}")

# ============= Admin Routes =============

ADMIN_EMAIL = "admin@neuronlearn.com"
ADMIN_PASSWORD_HASH = hash_password("admin123")  # Change this in production

async def get_admin_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get('role') != 'admin':
            raise HTTPException(status_code=403, detail="Admin access required")
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

@api_router.post("/admin/login")
async def admin_login(credentials: UserLogin):
    """Admin login"""
    if credentials.email != ADMIN_EMAIL:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(credentials.password, ADMIN_PASSWORD_HASH):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token_payload = {
        'email': credentials.email,
        'role': 'admin',
        'exp': datetime.now(timezone.utc) + timedelta(days=7)
    }
    token = jwt.encode(token_payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    
    return {'token': token, 'message': 'Admin login successful'}

# ============= Board Management =============

class BoardCreate(BaseModel):
    name: str
    full_name: str
    description: str = ""

class BoardUpdate(BaseModel):
    name: str
    full_name: str
    description: str = ""

@api_router.get("/admin/boards")
async def get_all_boards(admin: dict = Depends(get_admin_user)):
    """Get all boards with subject count"""
    boards = await db.boards.find({}, {'_id': 0}).to_list(1000)
    
    # Add subject count for each board
    for board in boards:
        subject_count = await db.subjects.count_documents({'board': board['name']})
        board['subject_count'] = subject_count
    
    return boards

@api_router.post("/admin/boards")
async def create_board(
    board_data: BoardCreate,
    admin: dict = Depends(get_admin_user)
):
    """Create new board"""
    # Check if board already exists
    existing = await db.boards.find_one({'name': board_data.name.upper()})
    if existing:
        raise HTTPException(status_code=400, detail=f"Board {board_data.name} already exists")
    
    board_id = board_data.name.lower().replace(' ', '-')
    board_doc = {
        'id': board_id,
        'name': board_data.name.upper(),
        'full_name': board_data.full_name,
        'description': board_data.description,
        'created_at': datetime.now(timezone.utc).isoformat()
    }
    
    await db.boards.insert_one(board_doc)
    
    # Return without _id
    return {
        'message': 'Board created successfully',
        'board': {
            'id': board_doc['id'],
            'name': board_doc['name'],
            'full_name': board_doc['full_name'],
            'description': board_doc['description']
        }
    }

@api_router.put("/admin/boards/{board_id}")
async def update_board(
    board_id: str,
    board_data: BoardUpdate,
    admin: dict = Depends(get_admin_user)
):
    """Update existing board"""
    board = await db.boards.find_one({'id': board_id})
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")
    
    old_name = board['name']
    new_name = board_data.name.upper()
    
    # Update board
    update_data = {
        'name': new_name,
        'full_name': board_data.full_name,
        'description': board_data.description,
        'updated_at': datetime.now(timezone.utc).isoformat()
    }
    
    await db.boards.update_one({'id': board_id}, {'$set': update_data})
    
    # Update all subjects that use this board
    if old_name != new_name:
        await db.subjects.update_many(
            {'board': old_name},
            {'$set': {'board': new_name}}
        )
    
    return {'message': 'Board updated successfully'}

@api_router.delete("/admin/boards/{board_id}")
async def delete_board(board_id: str, admin: dict = Depends(get_admin_user)):
    """Delete board"""
    board = await db.boards.find_one({'id': board_id})
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")
    
    # Check if board has subjects
    subject_count = await db.subjects.count_documents({'board': board['name']})
    if subject_count > 0:
        raise HTTPException(
            status_code=400, 
            detail=f"Cannot delete board. {subject_count} subjects are using this board. Please delete or reassign subjects first."
        )
    
    await db.boards.delete_one({'id': board_id})
    return {'message': 'Board deleted successfully'}

# ============= Stats & Other Admin Routes =============

@api_router.get("/admin/stats")
async def get_admin_stats(admin: dict = Depends(get_admin_user)):
    """Get platform statistics"""
    users_count = await db.users.count_documents({})
    subjects_count = await db.subjects.count_documents({})
    subscriptions_count = await db.subscriptions.count_documents({'payment_status': 'completed'})
    
    # Calculate total revenue
    pipeline = [
        {'$match': {'status': {'$in': ['verified', 'captured']}}},
        {'$group': {'_id': None, 'total': {'$sum': '$amount'}}}
    ]
    revenue_result = await db.payments.aggregate(pipeline).to_list(1)
    revenue = revenue_result[0]['total'] if revenue_result else 0
    
    return {
        'users': users_count,
        'subjects': subjects_count,
        'subscriptions': subscriptions_count,
        'revenue': revenue
    }

@api_router.get("/admin/users")
async def get_all_users(admin: dict = Depends(get_admin_user)):
    """Get all users"""
    users = await db.users.find({}, {'_id': 0, 'password': 0}).to_list(1000)
    return users

@api_router.get("/admin/subscriptions")
async def get_all_subscriptions(admin: dict = Depends(get_admin_user)):
    """Get all subscriptions"""
    subscriptions = await db.subscriptions.find({}, {'_id': 0}).to_list(1000)
    return subscriptions

@api_router.get("/admin/payments")
async def get_all_payments(admin: dict = Depends(get_admin_user)):
    """Get all payments"""
    payments = await db.payments.find({}, {'_id': 0}).to_list(1000)
    return payments

@api_router.get("/admin/materials")
async def get_all_materials(admin: dict = Depends(get_admin_user)):
    """Get all materials"""
    materials = await db.materials.find({}, {'_id': 0}).to_list(1000)
    return materials

class SubjectCreate(BaseModel):
    board: str
    class_name: str
    subject_name: str
    price: int
    duration_months: int = 6
    is_visible: bool = True

@api_router.get("/admin/subjects")
async def get_all_subjects_admin(admin: dict = Depends(get_admin_user)):
    """Get all subjects including hidden ones (admin only)"""
    subjects = await db.subjects.find({}, {'_id': 0}).to_list(1000)
    return subjects

@api_router.post("/admin/subjects")
async def create_subject(
    subject_data: SubjectCreate,
    admin: dict = Depends(get_admin_user)
):
    """Create new subject"""
    subject_id = f"{subject_data.board.lower()}-{subject_data.class_name.lower().replace(' ', '-')}-{subject_data.subject_name.lower()}"
    
    subject_doc = {
        'id': subject_id,
        'board': subject_data.board,
        'class_name': subject_data.class_name,
        'subject_name': subject_data.subject_name,
        'price': subject_data.price,
        'duration_months': subject_data.duration_months,
        'is_visible': subject_data.is_visible
    }
    
    await db.subjects.insert_one(subject_doc)
    
    # Return without _id
    return {
        'message': 'Subject created successfully',
        'subject': {
            'id': subject_doc['id'],
            'board': subject_doc['board'],
            'class_name': subject_doc['class_name'],
            'subject_name': subject_doc['subject_name'],
            'price': subject_doc['price'],
            'duration_months': subject_doc['duration_months']
        }
    }

@api_router.put("/admin/subjects/{subject_id}/visibility")
async def toggle_subject_visibility(
    subject_id: str,
    request: Request,
    admin: dict = Depends(get_admin_user)
):
    """Toggle subject visibility on client side"""
    body = await request.json()
    is_visible = body.get('is_visible', True)
    
    result = await db.subjects.update_one(
        {'id': subject_id},
        {'$set': {'is_visible': is_visible}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    return {'message': f'Subject {"shown" if is_visible else "hidden"} successfully'}

@api_router.delete("/admin/subjects/{subject_id}")
async def delete_subject(subject_id: str, admin: dict = Depends(get_admin_user)):
    """Delete subject"""
    result = await db.subjects.delete_one({'id': subject_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    # Also delete associated materials
    await db.materials.delete_many({'subject_id': subject_id})
    
    return {'message': 'Subject deleted successfully'}

class MaterialCreate(BaseModel):
    subject_id: str
    title: str
    type: str
    link: str
    description: str = ""

@api_router.post("/admin/materials")
async def create_material(
    material_data: MaterialCreate,
    admin: dict = Depends(get_admin_user)
):
    """Create new material"""
    import uuid
    material_id = f"mat-{str(uuid.uuid4())[:8]}"
    
    material_doc = {
        'id': material_id,
        'subject_id': material_data.subject_id,
        'title': material_data.title,
        'type': material_data.type,
        'link': material_data.link,
        'description': material_data.description
    }
    
    await db.materials.insert_one(material_doc)
    
    # Return without _id
    return {
        'message': 'Material created successfully',
        'material': {
            'id': material_doc['id'],
            'subject_id': material_doc['subject_id'],
            'title': material_doc['title'],
            'type': material_doc['type'],
            'link': material_doc['link'],
            'description': material_doc['description']
        }
    }

@api_router.delete("/admin/materials/{material_id}")
async def delete_material(material_id: str, admin: dict = Depends(get_admin_user)):
    """Delete material"""
    result = await db.materials.delete_one({'id': material_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Material not found")
    
    return {'message': 'Material deleted successfully'}

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
