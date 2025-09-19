import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { SnackbarProvider } from 'notistack'

// Layout
import Layout from './components/Layout/Layout'

// Auth Components
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import ForgotPassword from './components/auth/ForgotPassword'
import ResetPassword from './components/auth/ResetPassword'
import PendingApproval from './components/auth/PendingApproval'
import Unauthorized from './components/auth/Unauthorized'

// Dashboard Components
import Dashboard from './pages/Dashboard/Dashboard'

// Page Components
import HomePage from './pages/Home/HomePage'
import Students from './pages/Students/Students'
import Classes from './pages/Classes/Classes'
import Grades from './pages/Grades/Grades'
import Attendance from './pages/Attendance/Attendance'
import Profile from './pages/Profile/Profile'
import NotFound from './pages/NotFound/NotFound'

// Debug Components
import LoginTest from './pages/Debug/LoginTest'

// Protected Route Component
import ProtectedRoute from './components/auth/ProtectedRoute'

// Error Boundary
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'

// Redux actions
import { getProfile } from './store/slices/authSlice'

const App = () => {
  const dispatch = useDispatch()
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth)

  // Initialize user profile on app load
  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token && !user) {
      dispatch(getProfile())
    }
  }, [dispatch, user])

  // Loading state
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    )
  }

  // Helper function to get dashboard route based on user role
  const getDashboardRoute = (userRole) => {
    switch (userRole) {
      case 'admin':
        return '/admin/dashboard'
      case 'teacher':
        return '/teacher/dashboard'
      case 'student':
        return '/student/dashboard'
      default:
        return '/dashboard'
    }
  }

  return (
    <ErrorBoundary>
      <SnackbarProvider maxSnack={3}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={
            isAuthenticated ? <Navigate to={getDashboardRoute(user?.role)} replace /> : <Login />
          } />
          <Route path="/register" element={
            isAuthenticated ? <Navigate to={getDashboardRoute(user?.role)} replace /> : <Register />
          } />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/pending-approval" element={<PendingApproval />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Root Route */}
          <Route path="/" element={
            isAuthenticated ? (
              <ProtectedRoute>
                <Layout>
                  <Navigate to={getDashboardRoute(user?.role)} replace />
                </Layout>
              </ProtectedRoute>
            ) : (
              <HomePage />
            )
          } />

          {/* Home Route for authenticated users */}
          <Route path="/home" element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/admin/dashboard" element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/teacher/dashboard" element={
            <ProtectedRoute requiredRole="teacher">
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/student/dashboard" element={
            <ProtectedRoute requiredRole="student">
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Management Routes */}
          <Route path="/students" element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <Students />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/classes" element={
            <ProtectedRoute>
              <Layout>
                <Classes />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/grades" element={
            <ProtectedRoute>
              <Layout>
                <Grades />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/attendance" element={
            <ProtectedRoute>
              <Layout>
                <Attendance />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Profile Route */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Debug Routes */}
          <Route path="/debug/login-test" element={<LoginTest />} />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </SnackbarProvider>
    </ErrorBoundary>
  )
}

export default App