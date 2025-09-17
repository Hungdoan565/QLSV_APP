import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'

// Authentication
import { AuthProvider } from './contexts/AuthContext.jsx'

// Components
import Layout from './components/Layout/Layout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'
import NotificationProvider from './components/Notification/NotificationProvider'

// Auth Pages
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import ForgotPassword from './components/auth/ForgotPassword'
import ResetPassword from './components/auth/ResetPassword'
import PendingApproval from './components/auth/PendingApproval'
import Unauthorized from './components/auth/Unauthorized'

// Debug Pages
import AuthTestPage from './pages/Debug/AuthTestPage'

// Main Pages
import Dashboard from './pages/Dashboard/Dashboard'
import StudentDashboard from './pages/Dashboard/StudentDashboard'
import TeacherDashboard from './pages/Dashboard/TeacherDashboard'
import AdminDashboard from './pages/Dashboard/AdminDashboard'
import Students from './pages/Students/Students'
import Classes from './pages/Classes/Classes'
import Grades from './pages/Grades/Grades'
import Attendance from './pages/Attendance/Attendance'
import Profile from './pages/Profile/Profile'
import HomePage from './pages/Home/HomePage'
import NotFound from './pages/NotFound/NotFound'
import SystemStatus from './pages/SystemStatus/SystemStatus'
import QRCodeDemo from './pages/QRCodeDemo/QRCodeDemo'

function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <AuthProvider>
          <NotificationProvider>
            <Routes>
                {/* Public Routes - No authentication required */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/pending-approval" element={<PendingApproval />} />
                <Route path="/qr-demo" element={<QRCodeDemo />} />
                
                {/* Debug Routes */}
                <Route path="/debug/auth" element={<AuthTestPage />} />

                {/* Protected Routes - Authentication required */}
                {/* General Dashboard - redirects based on role */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Dashboard />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                
                {/* Role-specific Dashboard Routes */}
                <Route 
                  path="/student/dashboard" 
                  element={
                    <ProtectedRoute requiredRole="student">
                      <Layout>
                        <StudentDashboard />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/teacher/dashboard" 
                  element={
                    <ProtectedRoute requireTeacher>
                      <Layout>
                        <TeacherDashboard />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/admin/dashboard" 
                  element={
                    <ProtectedRoute requireAdmin>
                      <Layout>
                        <AdminDashboard />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                
                {/* General Protected Routes */}
                <Route 
                  path="/students" 
                  element={
                    <ProtectedRoute requireTeacher>
                      <Layout>
                        <Students />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/classes" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Classes />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/grades" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Grades />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/attendance" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Attendance />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Profile />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/system-status" 
                  element={
                    <ProtectedRoute requireAdmin>
                      <Layout>
                        <SystemStatus />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />

                {/* 404 Page */}
                <Route path="/404" element={<NotFound />} />
                
                {/* Catch all - redirect to 404 */}
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </NotificationProvider>
          </AuthProvider>
        </ErrorBoundary>
      </HelmetProvider>
    )
}

export default App
