# 🎓 Hệ Thống Quản Lý Sinh Viên

> Hệ thống quản lý sinh viên hiện đại dành cho giảng viên, được xây dựng với React + Vite frontend và Django REST API backend.

## ✨ Tính năng chính

### 👥 Quản lý sinh viên

- ✅ CRUD sinh viên đầy đủ
- ✅ Import/Export Excel
- ✅ Tìm kiếm và lọc dữ liệu
- ✅ Thống kê sinh viên

### 🏫 Quản lý lớp học

- ✅ Tạo và quản lý lớp học
- ✅ Thêm/xóa sinh viên khỏi lớp
- ✅ Quản lý sĩ số lớp
- ✅ Thống kê lớp học

### 📊 Quản lý điểm số

- ✅ Nhập điểm theo loại (giữa kỳ, cuối kỳ, bài tập, kiểm tra)
- ✅ Tính điểm tổng kết tự động
- ✅ Xếp loại điểm (A+, A, B+, B, C+, C, D+, D, F)
- ✅ Export bảng điểm Excel

### 📱 Điểm danh QR Code thông minh

- ✅ **QR Scanner**: Camera tích hợp cho sinh viên quét mã điểm danh
- ✅ **QR Generator**: Giáo viên tạo và quản lý phiên điểm danh với QR code
- ✅ **Real-time Updates**: Thống kê điểm danh cập nhật theo thời gian thực
- ✅ **Security Features**: Xác thực thời gian, chống trùng lặp, mã hóa QR
- ✅ **Mobile Optimized**: Giao diện tối ưu cho thiết bị di động
- ✅ **Export & Print**: Xuất và in QR code, báo cáo điểm danh

### 📈 Dashboard & Báo cáo

- ✅ Tổng quan thống kê
- ✅ Biểu đồ trực quan
- ✅ Báo cáo chi tiết

### 🔐 Xác thực & Phân quyền

- ✅ JWT Authentication
- ✅ Phân quyền Admin/Teacher
- ✅ Quản lý profile

## 🛠️ Công nghệ sử dụng

### Frontend

- **React 18** - UI Framework
- **Vite** - Build tool (nhanh hơn Create React App)
- **Material-UI** - Component library
- **Redux Toolkit** - State management
- **React Router** - Routing
- **Axios** - HTTP client

### Backend

- **Django 4.2** - Web framework
- **Django REST Framework** - API framework
- **PostgreSQL** - Database (local) hoặc **Supabase** (cloud) 🌟
- **JWT** - Authentication
- **Celery** - Task queue
- **Redis** - Cache & message broker

### Tools & Libraries

- **openpyxl** - Excel processing
- **pandas** - Data analysis
- **qrcode** - QR code generation (backend)
- **html5-qrcode** - QR code scanning (frontend)
- **react-qr-code** - QR code display (frontend)
- **Pillow** - Image processing
- **Framer Motion** - Animations

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống

- Python 3.8+
- Node.js 16+
- **Database**: PostgreSQL 12+ (local) hoặc **Supabase** (cloud) 🌟

### Cách 1: Sử dụng Supabase (Khuyến nghị) 🌟

```bash
# Clone repository
git clone <repository-url>
cd quan-ly-sinh-vien

# Cấu hình Supabase
# 1. Tạo tài khoản tại https://supabase.com
# 2. Tạo project mới
# 3. Copy thông tin kết nối database
# 4. Xem SUPABASE_SETUP.md để biết chi tiết

# Cấu hình .env
cd backend
cp env.example .env
# Chỉnh sửa .env với thông tin Supabase

# Deploy lên Supabase
./deploy_supabase.sh

# Chạy frontend
cd ../frontend
npm install
npm run dev
```

### Cách 2: Chạy local với PostgreSQL

```bash
# Clone repository
git clone <repository-url>
cd quan-ly-sinh-vien

# Chạy backend
./run_backend.sh

# Chạy frontend (terminal mới)
./run_frontend.sh
```

### Cách 3: Chạy thủ công

#### Backend (Django)

```bash
cd backend

# Tạo virtual environment
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# hoặc venv\Scripts\activate  # Windows

# Cài đặt dependencies
pip install -r requirements.txt

# Cấu hình database (tạo database PostgreSQL tên 'student_management')
# Sao chép env.example thành .env và cập nhật thông tin

# Chạy migrations
python manage.py makemigrations
python manage.py migrate

# Tạo superuser
python manage.py createsuperuser

# Chạy server
python manage.py runserver
```

#### Frontend (React)

```bash
cd frontend

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

## 🌐 Truy cập ứng dụng

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin

## 👤 Tài khoản demo

- **Admin**: admin@example.com / admin123
- **Teacher**: teacher@example.com / teacher123

## 📁 Cấu trúc dự án

```
quan-ly-sinh-vien/
├── 📁 backend/                 # Django API
│   ├── 📁 apps/               # Django applications
│   │   ├── 📁 accounts/       # Quản lý người dùng
│   │   ├── 📁 students/       # Quản lý sinh viên
│   │   ├── 📁 classes/        # Quản lý lớp học
│   │   ├── 📁 grades/         # Quản lý điểm số
│   │   └── 📁 attendance/     # Điểm danh
│   ├── 📁 student_management/ # Django settings
│   ├── 📄 requirements.txt    # Python dependencies
│   └── 📄 .env               # Environment variables
├── 📁 frontend/               # React application
│   ├── 📁 src/
│   │   ├── 📁 components/     # React components
│   │   ├── 📁 pages/          # Trang chính
│   │   ├── 📁 services/       # API services
│   │   └── 📁 store/          # Redux store
│   ├── 📄 package.json        # Node dependencies
│   └── 📄 vite.config.js      # Vite configuration
├── 📁 supabase/               # Supabase schema & config
│   ├── 📄 schema.sql          # Database schema
│   └── 📄 config.toml         # Supabase configuration
├── 📄 run_backend.sh          # Script chạy backend
├── 📄 run_frontend.sh         # Script chạy frontend
├── 📄 deploy_supabase.sh      # Deploy lên Supabase
├── 📄 README.md               # Hướng dẫn này
├── 📄 SUPABASE_SETUP.md       # Hướng dẫn Supabase
└── 📄 QR_ATTENDANCE_COMPLETE_GUIDE.md  # Hướng dẫn QR Code
```

## 🔗 API Endpoints

### Authentication

- `POST /api/auth/login/` - Đăng nhập
- `POST /api/auth/register/` - Đăng ký
- `GET /api/auth/profile/` - Lấy thông tin profile
- `PUT /api/auth/profile/update/` - Cập nhật profile

### Students

- `GET /api/students/` - Danh sách sinh viên
- `POST /api/students/` - Tạo sinh viên
- `GET /api/students/{id}/` - Chi tiết sinh viên
- `PUT /api/students/{id}/` - Cập nhật sinh viên
- `DELETE /api/students/{id}/` - Xóa sinh viên
- `POST /api/students/import-excel/` - Import Excel
- `GET /api/students/export-excel/` - Export Excel

### Classes

- `GET /api/classes/` - Danh sách lớp học
- `POST /api/classes/` - Tạo lớp học
- `GET /api/classes/{id}/` - Chi tiết lớp học
- `PUT /api/classes/{id}/` - Cập nhật lớp học
- `DELETE /api/classes/{id}/` - Xóa lớp học
- `GET /api/classes/{id}/students/` - Sinh viên trong lớp
- `POST /api/classes/{id}/students/` - Thêm sinh viên vào lớp

### Grades

- `GET /api/grades/` - Danh sách điểm
- `POST /api/grades/` - Tạo điểm
- `GET /api/grades/summary/{class_id}/{subject_id}/` - Tổng kết điểm
- `POST /api/grades/calculate/{class_id}/{subject_id}/` - Tính điểm tổng kết

### Attendance & QR Code

- `GET /api/attendance/sessions/` - Danh sách buổi điểm danh
- `POST /api/attendance/sessions/` - Tạo buổi điểm danh
- `GET /api/attendance/sessions/{id}/qr-code/` - Tạo QR code
- `POST /api/attendance/check-in-qr/` - Điểm danh bằng QR
- **Supabase Real-time**: Theo dõi điểm danh real-time qua WebSocket

### Demo Routes

- `/qr-demo` - Trang demo QR Code Scanner & Generator

## 🐛 Troubleshooting

### Lỗi kết nối database

- Kiểm tra PostgreSQL đang chạy
- Kiểm tra thông tin database trong `.env`
- Chạy `python manage.py migrate`

### Lỗi frontend không kết nối được API

- Kiểm tra backend đang chạy tại port 8000
- Kiểm tra CORS settings trong Django

### Lỗi import Excel

- Đảm bảo file Excel có đúng format
- Kiểm tra quyền ghi file trong thư mục media

## 📝 Ghi chú

- Dự án sử dụng Vite thay vì Create React App để build nhanh hơn
- Backend sử dụng PostgreSQL, có thể thay đổi sang SQLite cho development
- Tất cả API đều có authentication JWT
- Frontend tự động proxy API requests đến backend

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Hãy tạo issue hoặc pull request.

## 📄 License

MIT License
#   Q L S V _ A P P  
 