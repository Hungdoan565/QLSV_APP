import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  LinearProgress,
  Stack,
  IconButton,
  useTheme,
  useMediaQuery,
  alpha,
} from '@mui/material'
import {
  QrCodeScanner,
  Schedule,
  CheckCircle,
  Cancel,
  TrendingUp,
  Assignment,
  School,
  Person,
  AccessTime,
  Notifications,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { Helmet } from 'react-helmet-async'
import { useNotification } from '../../components/Notification/NotificationProvider'

// Quick Action Card Component
const QuickActionCard = ({ icon, title, subtitle, onClick, color = 'primary' }) => (
  <motion.div
    whileHover={{ y: -4 }}
    whileTap={{ scale: 0.98 }}
  >
    <Card
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: `${color}.main`,
          boxShadow: (theme) => `0 4px 20px ${alpha(theme.palette[color].main, 0.15)}`,
        }
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 3, textAlign: 'center' }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 2,
            bgcolor: alpha(color === 'primary' ? '#3b82f6' : '#22c55e', 0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2,
            color: color === 'primary' ? '#3b82f6' : '#22c55e',
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      </CardContent>
    </Card>
  </motion.div>
)

// Stat Card Component
const StatCard = ({ icon, title, value, subtitle, color = 'primary', trend = null }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: alpha(color === 'primary' ? '#3b82f6' : color === 'success' ? '#22c55e' : '#f59e0b', 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: color === 'primary' ? '#3b82f6' : color === 'success' ? '#22c55e' : '#f59e0b',
            }}
          >
            {icon}
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" fontWeight={700} color={`${color}.main`}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
            {trend && (
              <Chip
                label={trend}
                size="small"
                color={trend.includes('+') ? 'success' : 'error'}
                sx={{ mt: 1 }}
              />
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  </motion.div>
)

// Today's Class Card Component
const TodaysClassCard = ({ classData }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, mb: 2 }}>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: alpha('#3b82f6', 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#3b82f6',
            }}
          >
            <School />
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              {classData.subject}
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="body2" color="text.secondary">
                <AccessTime sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                {classData.time}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <Person sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                {classData.teacher}
              </Typography>
            </Stack>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Chip
              label={classData.status === 'present' ? 'Có mặt' : 'Vắng mặt'}
              color={classData.status === 'present' ? 'success' : 'error'}
              size="small"
            />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  </motion.div>
)

const StudentDashboard = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { user } = useSelector((state) => state.auth)
  const { showSuccess, showError } = useNotification()

  // Mock data - replace with real API calls
  const [attendanceStats, setAttendanceStats] = useState({
    totalClasses: 48,
    attended: 42,
    percentage: 87.5,
    thisWeek: 5,
    missed: 6
  })

  const [todaysClasses, setTodaysClasses] = useState([
    { 
      id: 1, 
      subject: 'Lập trình Web', 
      time: '08:00 - 09:30', 
      teacher: 'TS. Nguyễn Văn A',
      status: 'present'
    },
    { 
      id: 2, 
      subject: 'Cơ sở dữ liệu', 
      time: '10:00 - 11:30', 
      teacher: 'ThS. Trần Thị B',
      status: 'present'
    },
    { 
      id: 3, 
      subject: 'Toán rời rạc', 
      time: '14:00 - 15:30', 
      teacher: 'PGS. Lê Văn C',
      status: 'absent'
    },
  ])

  const handleAttendanceCheckIn = () => {
    // Simplified attendance check-in (no camera)
    const classCode = prompt('Nhập mã lớp học:')
    if (classCode) {
      showSuccess('Điểm danh thành công!')
      // Update local state
      setAttendanceStats(prev => ({
        ...prev,
        attended: prev.attended + 1,
        percentage: Math.round(((prev.attended + 1) / prev.totalClasses) * 100 * 10) / 10
      }))
    }
  }

  const handleViewSchedule = () => {
    showSuccess('Chuyển đến lịch học')
    // Navigate to schedule page
  }

  const handleCheckGrades = () => {
    showSuccess('Chuyển đến điểm số')
    // Navigate to grades page
  }

  return (
    <>
      <Helmet>
        <title>Dashboard Sinh viên - EduAttend</title>
      </Helmet>

      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card
            elevation={0}
            sx={{
              p: 4,
              mb: 4,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: 'white',
            }}
          >
            <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center" spacing={3}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  fontSize: '2rem',
                  fontWeight: 700,
                }}
              >
                {user?.first_name?.charAt(0) || 'S'}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  Chào {user?.first_name || 'Sinh viên'}!
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
                  Mã sinh viên: {user?.studentId || 'SV001'} • Khoa: {user?.department || 'Công nghệ Thông tin'}
                </Typography>
                <Stack direction="row" spacing={2} flexWrap="wrap">
                  <Chip
                    icon={<Schedule />}
                    label="3 lớp hôm nay"
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                  <Chip
                    icon={<CheckCircle />}
                    label={`${attendanceStats.percentage}% tham dự`}
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                </Stack>
              </Box>
            </Stack>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
            Thao tác nhanh
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={4}>
              <QuickActionCard
                icon={<QrCodeScanner />}
                title="Điểm danh"
                subtitle="Nhập mã lớp để điểm danh"
                onClick={handleAttendanceCheckIn}
                color="primary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <QuickActionCard
                icon={<Schedule />}
                title="Lịch học"
                subtitle="Xem lịch học tuần này"
                onClick={handleViewSchedule}
                color="secondary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <QuickActionCard
                icon={<Assignment />}
                title="Điểm số"
                subtitle="Kiểm tra điểm số"
                onClick={handleCheckGrades}
                color="secondary"
              />
            </Grid>
          </Grid>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
            Thống kê học tập
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<CheckCircle />}
                title="Tỷ lệ tham dự"
                value={`${attendanceStats.percentage}%`}
                subtitle={`${attendanceStats.attended}/${attendanceStats.totalClasses} buổi`}
                color="success"
                trend="+5% so với tháng trước"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<Schedule />}
                title="Tuần này"
                value={attendanceStats.thisWeek}
                subtitle="buổi học"
                color="primary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<Cancel />}
                title="Vắng mặt"
                value={attendanceStats.missed}
                subtitle="buổi học"
                color="error"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<TrendingUp />}
                title="Điểm TB"
                value="8.2"
                subtitle="học kỳ này"
                color="warning"
                trend="+0.3 so với kỳ trước"
              />
            </Grid>
          </Grid>
        </motion.div>

        <Grid container spacing={4}>
          {/* Today's Classes */}
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Lịch học hôm nay
                  </Typography>
                  {todaysClasses.map((classData) => (
                    <TodaysClassCard key={classData.id} classData={classData} />
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Attendance Progress */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Tiến độ tham dự
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Tỷ lệ tham dự
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {attendanceStats.percentage}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={attendanceStats.percentage}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          bgcolor: attendanceStats.percentage >= 80 ? 'success.main' : 'error.main',
                        },
                      }}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Cần ít nhất 80% để đủ điều kiện dự thi. Bạn đang ở mức{' '}
                    <strong>
                      {attendanceStats.percentage >= 80 ? 'Đạt yêu cầu' : 'Cần cải thiện'}
                    </strong>
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default StudentDashboard
