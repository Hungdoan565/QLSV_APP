import React, { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Stack,
  Chip,
  Avatar,
  LinearProgress,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material'
import {
  Schedule,
  CheckCircle,
  Cancel,
  Assignment,
  TrendingUp,
  Notifications,
  QrCodeScanner,
  BarChart,
  CalendarToday,
  School,
  Person,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { Helmet } from 'react-helmet-async'
import QRCodeScanner from '../../components/QRCode/QRCodeScanner'
import { useNotification } from '../../components/Notification/NotificationProvider'

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
              width: 56,
              height: 56,
              borderRadius: 2,
              bgcolor: `${color}.light`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: `${color}.main`,
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

const StudentDashboard = () => {
  const theme = useTheme()
  const { user } = useSelector((state) => state.auth)
  const { showSuccess } = useNotification()
  const [scannerOpen, setScannerOpen] = useState(false)

  // Mock data - replace with real API calls
  const attendanceStats = {
    totalClasses: 48,
    attended: 42,
    percentage: 87.5,
    thisWeek: 5,
    missed: 6
  }

  const recentActivities = [
    { id: 1, type: 'attendance', subject: 'Lập trình Web', time: '08:00 - 09:30', status: 'present', date: 'Hôm nay' },
    { id: 2, type: 'attendance', subject: 'Cơ sở dữ liệu', time: '10:00 - 11:30', status: 'present', date: 'Hôm nay' },
    { id: 3, type: 'attendance', subject: 'Toán rời rạc', time: '14:00 - 15:30', status: 'absent', date: 'Hôm qua' },
    { id: 4, type: 'grade', subject: 'Lập trình Web', grade: 8.5, date: '2 ngày trước' },
  ]

  const upcomingClasses = [
    { id: 1, subject: 'Mạng máy tính', time: '13:30 - 15:00', room: 'A101', teacher: 'TS. Nguyễn Văn A' },
    { id: 2, subject: 'Hệ điều hành', time: '15:15 - 16:45', room: 'B203', teacher: 'ThS. Trần Thị B' },
    { id: 3, subject: 'Phân tích thiết kế hệ thống', time: '19:00 - 20:30', room: 'C305', teacher: 'PGS. Lê Văn C' },
  ]

  return (
    <>
      <Helmet>
        <title>Dashboard Sinh viên - EduAttend</title>
      </Helmet>

      <Box sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh' }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 4,
                mb: 4,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                color: 'white',
              }}
            >
              <Grid container alignItems="center" spacing={3}>
                <Grid item>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: 'rgba(255,255,255,0.2)',
                      fontSize: '2rem',
                      fontWeight: 700,
                    }}
                  >
                    {user?.fullName?.charAt(0) || 'S'}
                  </Avatar>
                </Grid>
                <Grid item xs>
                  <Typography variant="h4" fontWeight={700} gutterBottom>
                    Chào {user?.fullName || 'Sinh viên'}!
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
                </Grid>                <Grid item>
                  <Button
                    variant="contained"
                    startIcon={<QrCodeScanner />}
                    onClick={() => setScannerOpen(true)}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                    }}
                  >
                    Quét QR Điểm danh
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </motion.div>

          {/* Stats Cards */}
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
                icon={<BarChart />}
                title="Điểm TB"
                value="8.2"
                subtitle="học kỳ này"
                color="warning"
                trend="+0.3 so với kỳ trước"
              />
            </Grid>
          </Grid>

          <Grid container spacing={4}>
            {/* Recent Activities */}
            <Grid item xs={12} md={8}>
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Hoạt động gần đây
                  </Typography>
                  <List>
                    {recentActivities.map((activity) => (
                      <ListItem key={activity.id} divider>
                        <ListItemIcon>
                          {activity.type === 'attendance' ? (
                            activity.status === 'present' ? (
                              <CheckCircle color="success" />
                            ) : (
                              <Cancel color="error" />
                            )
                          ) : (
                            <Assignment color="primary" />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            activity.type === 'attendance'
                              ? `${activity.status === 'present' ? 'Có mặt' : 'Vắng mặt'} - ${activity.subject}`
                              : `Điểm ${activity.subject}: ${activity.grade}`
                          }
                          secondary={`${activity.time || ''} • ${activity.date}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Upcoming Classes */}
            <Grid item xs={12} md={4}>
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Lịch học hôm nay
                  </Typography>
                  <Stack spacing={2}>
                    {upcomingClasses.map((class_) => (
                      <Paper
                        key={class_.id}
                        elevation={0}
                        sx={{
                          p: 2,
                          bgcolor: 'grey.50',
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: 'divider',
                        }}
                      >
                        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                          {class_.subject}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          <CalendarToday sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                          {class_.time}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          <School sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                          Phòng {class_.room}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          <Person sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                          {class_.teacher}
                        </Typography>
                      </Paper>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Attendance Progress */}
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Tiến độ tham dự học kỳ
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
            </Grid>
          </Grid>        </Container>

        {/* QR Code Scanner */}
        <QRCodeScanner
          open={scannerOpen}
          onClose={() => setScannerOpen(false)}
          onSuccess={(result) => {
            showSuccess(result.message)
            setScannerOpen(false)
          }}
        />
      </Box>
    </>
  )
}

export default StudentDashboard
