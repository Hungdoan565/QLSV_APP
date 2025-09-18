# 🔐 Hướng dẫn Test Authentication System

## ✅ **Đã hoàn thành:**

### 1. **Database Setup**

- ✅ **SQLite Database**: Đã migrate và có dữ liệu thật
- ✅ **Test Users**: Đã tạo 3 users với roles khác nhau
- ✅ **Backend Server**: Django server đang chạy trên port 8000

### 2. **Test Users Available**

```bash
# Admin User
Email: admin@test.com
Password: Admin123456
Role: admin
Dashboard: /admin/dashboard

# Teacher User
Email: teacher@test.com
Password: Teacher123456
Role: teacher
Dashboard: /teacher/dashboard

# Student User
Email: student@test.com
Password: Student123456
Role: student
Dashboard: /student/dashboard
```

## 🚀 **Cách Test:**

### **Method 1: Debug Page (Recommended)**

1. Mở browser và vào: `http://localhost:3000/debug/login-test`
2. Sử dụng các nút Quick Test để test từng role
3. Hoặc nhập thủ công email/password
4. Kiểm tra redirect đến dashboard đúng

### **Method 2: Normal Login Flow**

1. Vào trang chủ: `http://localhost:3000`
2. Click "Đăng nhập"
3. Nhập credentials của test user
4. Kiểm tra redirect đến dashboard tương ứng

### **Method 3: Direct Dashboard Access**

1. Đăng nhập với bất kỳ test user nào
2. Thử truy cập các dashboard khác:
   - `/admin/dashboard` (chỉ admin)
   - `/teacher/dashboard` (admin + teacher)
   - `/student/dashboard` (chỉ student)

## 🔍 **Kiểm tra gì:**

### **Authentication Flow**

- ✅ Login thành công với đúng credentials
- ✅ JWT token được lưu trong localStorage
- ✅ User info được lưu trong Redux store
- ✅ Redirect đến dashboard đúng role

### **Authorization Flow**

- ✅ Admin có thể truy cập tất cả dashboards
- ✅ Teacher chỉ truy cập được teacher + student dashboard
- ✅ Student chỉ truy cập được student dashboard
- ✅ Unauthorized users bị redirect về login

### **Dashboard Content**

- ✅ AdminDashboard: Hiển thị admin-specific content
- ✅ TeacherDashboard: Hiển thị teacher-specific content
- ✅ StudentDashboard: Hiển thị student-specific content

## 🐛 **Troubleshooting:**

### **Backend không chạy:**

```bash
cd backend
python manage.py runserver
```

### **Frontend không chạy:**

```bash
cd frontend
npm run dev
```

### **Database issues:**

```bash
cd backend
python manage.py migrate
python create_test_users.py
```

### **CORS errors:**

- Kiểm tra backend đang chạy trên port 8000
- Kiểm tra frontend đang chạy trên port 3000
- Kiểm tra CORS settings trong settings.py

## 📊 **Expected Results:**

| Test Case           | Expected Result                  |
| ------------------- | -------------------------------- |
| Admin Login         | Redirect to `/admin/dashboard`   |
| Teacher Login       | Redirect to `/teacher/dashboard` |
| Student Login       | Redirect to `/student/dashboard` |
| Wrong Credentials   | Show error message               |
| Unauthorized Access | Redirect to `/unauthorized`      |
| Token Expired       | Redirect to `/login`             |

## 🎯 **Next Steps:**

Sau khi test thành công authentication flow, có thể tiếp tục với:

1. **Email Verification System**
2. **Password Reset Functionality**
3. **Real Data Integration cho Dashboards**
4. **Teacher Approval System**
5. **QR Attendance System Enhancement**

## 📝 **Notes:**

- Database sử dụng SQLite (có thể upgrade lên PostgreSQL sau)
- JWT tokens có lifetime 60 phút (có thể extend)
- Account status: active (có thể test pending/rejected)
- CORS chỉ allow localhost:3000 (có thể mở rộng cho production)
