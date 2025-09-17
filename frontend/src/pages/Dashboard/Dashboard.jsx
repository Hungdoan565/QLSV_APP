import React, { useEffect } from 'react'
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material'
import {
  People,
  Class,
  Grade,
  EventAvailable, // Thêm icon hợp lệ
} from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { fetchStudentStatistics } from '../../store/slices/studentSlice'
import { fetchClassStatistics } from '../../store/slices/classSlice'

const StatCard = ({ title, value, icon, color = 'primary' }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box
          sx={{
            p: 1,
            borderRadius: 1,
            backgroundColor: `${color}.light`,
            color: `${color}.contrastText`,
            mr: 2,
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="div" color={`${color}.main`}>
        {value}
      </Typography>
    </CardContent>
  </Card>
)

const Dashboard = () => {
  const dispatch = useDispatch()
  const { statistics: studentStats, isLoading: studentLoading } = useSelector((state) => state.students)
  const { statistics: classStats, isLoading: classLoading } = useSelector((state) => state.classes)

  useEffect(() => {
    dispatch(fetchStudentStatistics())
    dispatch(fetchClassStatistics())
  }, [dispatch])

  const isLoading = studentLoading || classLoading

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Tổng quan hệ thống quản lý sinh viên
      </Typography>

      <Grid container spacing={3}>
        {/* Student Statistics */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Tổng sinh viên"
            value={studentStats?.total_students || 0}
            icon={<People />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Sinh viên hoạt động"
            value={studentStats?.active_students || 0}
            icon={<People />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Nam sinh viên"
            value={studentStats?.male_students || 0}
            icon={<People />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Nữ sinh viên"
            value={studentStats?.female_students || 0}
            icon={<People />}
            color="warning"
          />
        </Grid>

        {/* Class Statistics */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Tổng lớp học"
            value={classStats?.total_classes || 0}
            icon={<Class />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Lớp hoạt động"
            value={classStats?.active_classes || 0}
            icon={<Class />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Sinh viên trong lớp"
            value={classStats?.total_students_in_classes || 0}
            icon={<People />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="TB sinh viên/lớp"
            value={classStats?.avg_students_per_class || 0}
            icon={<Class />}
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Thao tác nhanh
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 3 } }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <People sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6">Quản lý sinh viên</Typography>
                <Typography variant="body2" color="text.secondary">
                  Thêm, sửa, xóa thông tin sinh viên
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 3 } }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Class sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="h6">Quản lý lớp học</Typography>
                <Typography variant="body2" color="text.secondary">
                  Tạo và quản lý các lớp học
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 3 } }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Grade sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                <Typography variant="h6">Quản lý điểm số</Typography>
                <Typography variant="body2" color="text.secondary">
                  Nhập và theo dõi điểm số sinh viên
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 3 } }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <EventAvailable sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                <Typography variant="h6">Điểm danh</Typography>
                <Typography variant="body2" color="text.secondary">
                  Điểm danh thông minh với QR code
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}

export default Dashboard
