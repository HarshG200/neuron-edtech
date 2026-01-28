#!/usr/bin/env python3
import requests
import sys
import json
from datetime import datetime, timezone, timedelta

class EdTechAPITester:
    def __init__(self, base_url="https://neuron-study.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.admin_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_user_email = f"student{datetime.now().strftime('%H%M%S')}@test.com"
        self.test_user_data = {
            "name": "Test Student",
            "email": self.test_user_email,
            "phone": "+91 9876543210", 
            "city": "Mumbai",
            "password": "test123"
        }
        self.admin_email = "admin@neuronbyelv.com"
        self.admin_password = "admin123"

    def log_test(self, name, success, details=""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED {details}")
        else:
            print(f"❌ {name} - FAILED {details}")

    def make_request(self, method, endpoint, data=None, expected_status=200, use_admin_token=False):
        """Make HTTP request with proper headers"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        # Use admin token if specified, otherwise use regular token
        token_to_use = self.admin_token if use_admin_token else self.token
        if token_to_use:
            headers['Authorization'] = f'Bearer {token_to_use}'

        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)

            success = response.status_code == expected_status
            response_data = {}
            
            try:
                response_data = response.json()
            except:
                response_data = {"text": response.text}

            return success, response.status_code, response_data

        except Exception as e:
            return False, 0, {"error": str(e)}

    def test_seed_data(self):
        """Seed subjects and materials for testing"""
        print("\n🌱 Seeding test data...")
        
        # Seed subjects
        success, status, response = self.make_request('POST', 'subjects/seed', expected_status=200)
        self.log_test("Seed Subjects", success, f"Status: {status}")
        
        # Seed materials
        success, status, response = self.make_request('POST', 'materials/seed', expected_status=200)
        self.log_test("Seed Materials", success, f"Status: {status}")

    def test_user_registration(self):
        """Test user registration"""
        print("\n👤 Testing User Registration...")
        
        success, status, response = self.make_request(
            'POST', 'auth/register', 
            data=self.test_user_data,
            expected_status=200
        )
        
        if success and 'token' in response:
            self.token = response['token']
            self.log_test("User Registration", True, f"Token received")
        else:
            self.log_test("User Registration", False, f"Status: {status}, Response: {response}")
        
        return success

    def test_user_login(self):
        """Test user login"""
        print("\n🔐 Testing User Login...")
        
        login_data = {
            "email": self.test_user_email,
            "password": "test123"
        }
        
        success, status, response = self.make_request(
            'POST', 'auth/login',
            data=login_data,
            expected_status=200
        )
        
        if success and 'token' in response:
            self.token = response['token']
            self.log_test("User Login", True, f"Token received")
        else:
            self.log_test("User Login", False, f"Status: {status}, Response: {response}")
        
        return success

    def test_get_user_profile(self):
        """Test get current user profile"""
        print("\n👤 Testing Get User Profile...")
        
        success, status, response = self.make_request('GET', 'auth/me')
        
        if success and response.get('email') == self.test_user_email:
            self.log_test("Get User Profile", True, f"Email: {response.get('email')}")
        else:
            self.log_test("Get User Profile", False, f"Status: {status}, Response: {response}")
        
        return success

    def test_get_subjects(self):
        """Test get all subjects"""
        print("\n📚 Testing Get Subjects...")
        
        success, status, response = self.make_request('GET', 'subjects')
        
        if success and isinstance(response, list) and len(response) == 6:
            self.log_test("Get Subjects", True, f"Found {len(response)} subjects")
            return response
        else:
            self.log_test("Get Subjects", False, f"Status: {status}, Response: {response}")
            return []

    def test_get_subscriptions(self):
        """Test get user subscriptions (should be empty initially)"""
        print("\n📋 Testing Get Subscriptions...")
        
        success, status, response = self.make_request('GET', 'subscriptions/my')
        
        if success and isinstance(response, list):
            self.log_test("Get Subscriptions", True, f"Found {len(response)} subscriptions")
            return response
        else:
            self.log_test("Get Subscriptions", False, f"Status: {status}, Response: {response}")
            return []

    def test_check_subscription(self, subject_id):
        """Test check subscription for a subject"""
        print(f"\n🔍 Testing Check Subscription for {subject_id}...")
        
        success, status, response = self.make_request('GET', f'subscriptions/check/{subject_id}')
        
        if success and 'has_subscription' in response:
            has_sub = response['has_subscription']
            self.log_test("Check Subscription", True, f"Has subscription: {has_sub}")
            return has_sub
        else:
            self.log_test("Check Subscription", False, f"Status: {status}, Response: {response}")
            return False

    def test_get_materials_without_subscription(self, subject_id):
        """Test get materials without subscription (should fail)"""
        print(f"\n📄 Testing Get Materials Without Subscription for {subject_id}...")
        
        success, status, response = self.make_request(
            'GET', f'materials/{subject_id}',
            expected_status=403
        )
        
        if success:
            self.log_test("Get Materials (No Subscription)", True, "Correctly blocked access")
        else:
            self.log_test("Get Materials (No Subscription)", False, f"Status: {status}, Should be 403")

    def test_create_payment_order(self, subject_id, amount):
        """Test create payment order"""
        print(f"\n💳 Testing Create Payment Order for {subject_id}...")
        
        order_data = {
            "subject_id": subject_id,
            "amount": amount
        }
        
        success, status, response = self.make_request(
            'POST', 'payments/create-order',
            data=order_data,
            expected_status=200
        )
        
        if success and 'order_id' in response:
            self.log_test("Create Payment Order", True, f"Order ID: {response['order_id']}")
            return response['order_id']
        else:
            self.log_test("Create Payment Order", False, f"Status: {status}, Response: {response}")
            return None

    def create_manual_subscription(self, subject_id):
        """Manually create subscription for testing materials access"""
        print(f"\n🔧 Creating Manual Subscription for {subject_id}...")
        
        # This would normally be done via MongoDB directly
        # For testing, we'll simulate a successful payment verification
        
        # Create a mock order first
        order_id = self.test_create_payment_order(subject_id, 500)
        if not order_id:
            return False
            
        # For testing purposes, we'll use the payment verification endpoint
        # with mock data (this won't work in real scenario without actual Razorpay)
        print("Note: Manual subscription creation would require direct MongoDB access")
        return True

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting EdTech Platform API Tests")
        print(f"Backend URL: {self.base_url}")
        print("=" * 60)

        # Seed test data first
        self.test_seed_data()

        # Test authentication flow
        if not self.test_user_registration():
            print("❌ Registration failed, stopping tests")
            return False

        if not self.test_get_user_profile():
            print("❌ Profile fetch failed")

        # Test login (logout and login again)
        self.token = None  # Clear token to test login
        if not self.test_user_login():
            print("❌ Login failed")

        # Test subjects
        subjects = self.test_get_subjects()
        if not subjects:
            print("❌ No subjects found, stopping tests")
            return False

        # Test subscriptions (should be empty)
        subscriptions = self.test_get_subscriptions()

        # Test subscription check for first subject
        if subjects:
            first_subject = subjects[0]
            subject_id = first_subject['id']
            
            # Should not have subscription initially
            has_subscription = self.test_check_subscription(subject_id)
            
            # Should not be able to access materials
            self.test_get_materials_without_subscription(subject_id)
            
            # Test payment order creation
            self.test_create_payment_order(subject_id, first_subject['price'])

        # Print final results
        print("\n" + "=" * 60)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return True
        else:
            print(f"⚠️  {self.tests_run - self.tests_passed} tests failed")
            return False

def main():
    tester = EdTechAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())