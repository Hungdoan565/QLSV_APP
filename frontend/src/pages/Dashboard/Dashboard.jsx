import React from 'react'
import { useSelector } from 'react-redux'
import { Box, CircularProgress, Typography } from '@mui/material'
import ProperAdminDashboard from './ProperAdminDashboard'
import ProperTeacherDashboard from './ProperTeacherDashboard'
import ProductionStudentDashboard from './ProductionStudentDashboard'

const Dashboard = () => {
  const { user, isLoading } = useSelector((state) => state.auth)

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Đang tải...
        </Typography>
      </Box>
    )
  }

  // Show error if not authenticated
  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h6" color="error">
          Vui lòng đăng nhập để tiếp tục
        </Typography>
      </Box>
    )
  }

  // Role-based dashboard rendering
  switch (user.role) {
    case 'admin':
      return <ProperAdminDashboard />
    case 'teacher':
      return <ProperTeacherDashboard />
    case 'student':
      return <ProductionStudentDashboard />
    default:
      return <ProductionStudentDashboard /> // Default to student dashboard
  }
}

export default Dashboard
