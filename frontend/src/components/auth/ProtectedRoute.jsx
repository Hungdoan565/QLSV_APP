import React from 'react';
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext.jsx';
import AuthUtils from '../../utils/authUtils';

const ProtectedRoute = ({ 
  children, 
  requiredRole = null, 
  requireAdmin = false, 
  requireTeacher = false,
  redirectTo = '/login' 
}) => {  const { user, loading, isAuthenticated } = useAuth();
  // Show loading spinner while checking authentication
  if (loading) {
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
  if (!isAuthenticated()) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check admin access
  if (requireAdmin && !AuthUtils.canAccessAdminFeatures(user)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check teacher access (admin can also access teacher routes)
  if (requireTeacher && !AuthUtils.hasAnyRole(user, ['admin', 'teacher'])) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check specific role requirement
  if (requiredRole && !AuthUtils.hasRole(user, requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check account status
  if (AuthUtils.needsApproval(user)) {
    return <Navigate to="/pending-approval" replace />;
  }

  if (user?.account_status === 'suspended') {
    return <Navigate to="/unauthorized" replace />;
  }

  if (user?.account_status === 'rejected') {
    return <Navigate to="/account-rejected" replace />;
  }

  // All checks passed, render the protected content
  return children;
};

export default ProtectedRoute;
