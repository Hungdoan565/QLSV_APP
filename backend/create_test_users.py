#!/usr/bin/env python
import os
import sys
import django
from django.conf import settings

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'student_management.settings')
django.setup()

from apps.accounts.models import User

def create_test_users():
    # Create admin user
    if not User.objects.filter(email='admin@test.com').exists():
        admin = User.objects.create_superuser(
            email='admin@test.com',
            password='Admin123456',
            first_name='Admin',
            last_name='User',
            role='admin',
            username='admin_test'  # Specify unique username
        )
        print(f'✓ Admin user created: {admin.email}')
    else:
        print('! Admin user already exists')    # Create teacher user
    if not User.objects.filter(email='teacher@test.com').exists():
        teacher = User.objects.create_user(
            email='teacher@test.com',
            password='Teacher123456',
            first_name='Teacher',
            last_name='Test',
            role='teacher',
            account_status='active',
            username='teacher_test'
        )
        print(f'✓ Teacher user created: {teacher.email}')
    else:
        print('! Teacher user already exists')

    # Create student user
    if not User.objects.filter(email='student@test.com').exists():
        student = User.objects.create_user(
            email='student@test.com',
            password='Student123456',
            first_name='Student',
            last_name='Test',
            role='student',
            account_status='active',
            username='student_test'
        )
        print(f'✓ Student user created: {student.email}')
    else:
        print('! Student user already exists')

if __name__ == '__main__':
    try:
        create_test_users()
        print('\n🎉 Test users created successfully!')
        print('\nCredentials:')
        print('Admin: admin@test.com / Admin123456')
        print('Teacher: teacher@test.com / Teacher123456') 
        print('Student: student@test.com / Student123456')
    except Exception as e:
        print(f'❌ Error creating users: {e}')
        sys.exit(1)
