#!/usr/bin/env python3
import requests
import sys
import json
from datetime import datetime

class AdminAPITester:
    def __init__(self, base_url="https://edtech-platform-26.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.admin_token = None
        self.tests_run = 0
        self.tests_passed = 0

    def log_test(self, name, success, details=""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED {details}")
        else:
            print(f"❌ {name} - FAILED {details}")

    def make_request(self, method, endpoint, data=None, expected_status=200):
        """Make HTTP request with proper headers"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        if self.admin_token:
            headers['Authorization'] = f'Bearer {self.admin_token}'

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

    def test_admin_login(self):
        """Test admin login"""
        print("\n🔐 Testing Admin Login...")
        
        login_data = {
            "email": "admin@edustream.com",
            "password": "admin123"
        }
        
        success, status, response = self.make_request(
            'POST', 'admin/login',
            data=login_data,
            expected_status=200
        )
        
        if success and 'token' in response:
            self.admin_token = response['token']
            self.log_test("Admin Login", True, f"Token received")
        else:
            self.log_test("Admin Login", False, f"Status: {status}, Response: {response}")
        
        return success

    def test_admin_stats(self):
        """Test admin stats"""
        print("\n📊 Testing Admin Stats...")
        
        success, status, response = self.make_request('GET', 'admin/stats')
        
        if success and 'users' in response and 'subjects' in response:
            self.log_test("Admin Stats", True, f"Users: {response['users']}, Subjects: {response['subjects']}")
        else:
            self.log_test("Admin Stats", False, f"Status: {status}, Response: {response}")
        
        return success

    def test_get_all_subjects_admin(self):
        """Test get all subjects (admin view)"""
        print("\n📚 Testing Get All Subjects (Admin)...")
        
        success, status, response = self.make_request('GET', 'admin/subjects')
        
        if success and isinstance(response, list):
            self.log_test("Get All Subjects (Admin)", True, f"Found {len(response)} subjects")
            return response
        else:
            self.log_test("Get All Subjects (Admin)", False, f"Status: {status}, Response: {response}")
            return []

    def test_create_board(self):
        """Test create new board"""
        print("\n🏫 Testing Create Board...")
        
        board_data = {
            "name": "State Board",
            "full_name": "State Board of Education",
            "description": "State education board for regional curriculum"
        }
        
        success, status, response = self.make_request(
            'POST', 'admin/boards',
            data=board_data,
            expected_status=200
        )
        
        if success and 'board' in response:
            self.log_test("Create Board", True, f"Board created: {response['board']['name']}")
            return response['board']['id']
        else:
            self.log_test("Create Board", False, f"Status: {status}, Response: {response}")
            return None

    def test_get_boards(self):
        """Test get all boards"""
        print("\n🏫 Testing Get Boards...")
        
        success, status, response = self.make_request('GET', 'admin/boards')
        
        if success and isinstance(response, list):
            self.log_test("Get Boards", True, f"Found {len(response)} boards")
            return response
        else:
            self.log_test("Get Boards", False, f"Status: {status}, Response: {response}")
            return []

    def test_create_subject(self):
        """Test create new subject"""
        print("\n📖 Testing Create Subject...")
        
        subject_data = {
            "board": "STATE BOARD",
            "class_name": "Class 10",
            "subject_name": "Mathematics",
            "price": 550,
            "duration_months": 6,
            "is_visible": True
        }
        
        success, status, response = self.make_request(
            'POST', 'admin/subjects',
            data=subject_data,
            expected_status=200
        )
        
        if success and 'subject' in response:
            self.log_test("Create Subject", True, f"Subject created: {response['subject']['subject_name']}")
            return response['subject']['id']
        else:
            self.log_test("Create Subject", False, f"Status: {status}, Response: {response}")
            return None

    def test_toggle_subject_visibility(self, subject_id):
        """Test toggle subject visibility"""
        print(f"\n👁️ Testing Toggle Subject Visibility for {subject_id}...")
        
        # First hide the subject
        success, status, response = self.make_request(
            'PUT', f'admin/subjects/{subject_id}/visibility',
            data={"is_visible": False},
            expected_status=200
        )
        
        if success:
            self.log_test("Hide Subject", True, "Subject hidden successfully")
            
            # Then show it again
            success2, status2, response2 = self.make_request(
                'PUT', f'admin/subjects/{subject_id}/visibility',
                data={"is_visible": True},
                expected_status=200
            )
            
            if success2:
                self.log_test("Show Subject", True, "Subject shown successfully")
            else:
                self.log_test("Show Subject", False, f"Status: {status2}")
        else:
            self.log_test("Hide Subject", False, f"Status: {status}, Response: {response}")

    def test_create_material(self, subject_id):
        """Test create new material"""
        print(f"\n📄 Testing Create Material for {subject_id}...")
        
        material_data = {
            "subject_id": subject_id,
            "title": "Test Study Material",
            "type": "pdf",
            "link": "https://drive.google.com/file/d/1test/preview",
            "description": "Test material for automated testing"
        }
        
        success, status, response = self.make_request(
            'POST', 'admin/materials',
            data=material_data,
            expected_status=200
        )
        
        if success and 'material' in response:
            self.log_test("Create Material", True, f"Material created: {response['material']['title']}")
            return response['material']['id']
        else:
            self.log_test("Create Material", False, f"Status: {status}, Response: {response}")
            return None

    def test_get_all_materials(self):
        """Test get all materials"""
        print("\n📄 Testing Get All Materials...")
        
        success, status, response = self.make_request('GET', 'admin/materials')
        
        if success and isinstance(response, list):
            self.log_test("Get All Materials", True, f"Found {len(response)} materials")
        else:
            self.log_test("Get All Materials", False, f"Status: {status}, Response: {response}")

    def run_all_tests(self):
        """Run all admin API tests"""
        print("🚀 Starting EdTech Admin API Tests")
        print(f"Backend URL: {self.base_url}")
        print("=" * 60)

        # Test admin login
        if not self.test_admin_login():
            print("❌ Admin login failed, stopping tests")
            return False

        # Test admin stats
        self.test_admin_stats()

        # Test boards management
        self.test_get_boards()
        board_id = self.test_create_board()

        # Test subjects management
        subjects = self.test_get_all_subjects_admin()
        subject_id = self.test_create_subject()
        
        if subject_id:
            self.test_toggle_subject_visibility(subject_id)

        # Test materials management
        self.test_get_all_materials()
        if subjects and len(subjects) > 0:
            first_subject_id = subjects[0]['id']
            material_id = self.test_create_material(first_subject_id)

        # Print final results
        print("\n" + "=" * 60)
        print(f"📊 Admin Test Results: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All admin tests passed!")
            return True
        else:
            print(f"⚠️  {self.tests_run - self.tests_passed} admin tests failed")
            return False

def main():
    tester = AdminAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())