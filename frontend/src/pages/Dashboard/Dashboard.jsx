import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import ProperAdminDashboard from './ProperAdminDashboard'
import ProperTeacherDashboard from './ProperTeacherDashboard'
import ProductionStudentDashboard from './ProductionStudentDashboard'

const Dashboard = () => {
  const { user } = useAuth()

  // Role-based dashboard rendering
  if (!user) {
    return <div>Loading...</div>
  }

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
