import React from 'react';
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import AuthUtils from '../../utils/authUtils';

const ProtectedRoute = ({ 
  children, 
  requiredRole = null, 
  requireAdmin = false, 
  requireTeacher = false,
  redirectTo = '/login' 
}) => {  
  const { user, isLoading, isAuthenticated } = useSelector((state) => state.auth);
  
  console.log('🔒 ProtectedRoute - User:', user, 'IsAuth:', isAuthenticated, 'RequiredRole:', requiredRole, 'RequireAdmin:', requireAdmin, 'RequireTeacher:', requireTeacher);
  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2,
        }}
      >
        <CircularProgress size={48} />
        <Typography variant="body1" color="text.secondary">
          Đang kiểm tra quyền truy cập...
        </Typography>
      </Box>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check admin access
  if (requireAdmin) {
    const userRole = user?.role || 'student'
    console.log('🔒 Checking admin access - userRole:', userRole, 'requireAdmin:', requireAdmin)
    if (userRole !== 'admin') {
      console.log('🔒 Admin access denied - redirecting to unauthorized')
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Check teacher access (admin can also access teacher routes)
  if (requireTeacher) {
    const userRole = user?.role || 'student'
    console.log('🔒 Checking teacher access - userRole:', userRole, 'requireTeacher:', requireTeacher)
    if (!['admin', 'teacher'].includes(userRole)) {
      console.log('🔒 Teacher access denied - redirecting to unauthorized')
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Check specific role requirement
  if (requiredRole) {
    if (Array.isArray(requiredRole)) {
      // Check if user has any of the required roles
      // If user doesn't have role, assume student (default)
      const userRole = user?.role || 'student'
      console.log('🔒 Checking array role - userRole:', userRole, 'requiredRole:', requiredRole, 'includes:', requiredRole.includes(userRole))
      if (!requiredRole.includes(userRole)) {
        console.log('🔒 Array role access denied - redirecting to unauthorized')
        return <Navigate to="/unauthorized" replace />;
      }
    } else {
      // Check single role
      // If user doesn't have role, assume student (default)
      const userRole = user?.role || 'student'
      console.log('🔒 Checking single role - userRole:', userRole, 'requiredRole:', requiredRole, 'match:', userRole === requiredRole)
      if (userRole !== requiredRole) {
        console.log('🔒 Single role access denied - redirecting to unauthorized')
        return <Navigate to="/unauthorized" replace />;
      }
    }
  }

  // Check account status
  const userStatus = user?.account_status || 'active'
  console.log('🔒 Checking account status - userStatus:', userStatus)
  
  if (userStatus === 'pending') {
    console.log('🔒 Account pending - redirecting to pending approval')
    return <Navigate to="/pending-approval" replace />;
  }

  if (userStatus === 'suspended') {
    console.log('🔒 Account suspended - redirecting to unauthorized')
    return <Navigate to="/unauthorized" replace />;
  }

  if (userStatus === 'rejected') {
    console.log('🔒 Account rejected - redirecting to account rejected')
    return <Navigate to="/account-rejected" replace />;
  }

  // All checks passed, render the protected content
  return children;
};

export default ProtectedRoute;
