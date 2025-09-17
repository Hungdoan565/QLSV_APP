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
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material'
import {
  People,
  Class,
  CheckCircle,
  Cancel,
  Assignment,
  TrendingUp,
  Notifications,
  QrCodeScanner,
  BarChart,
  CalendarToday,
  School,
  Add,
  FileDownload,
  Visibility,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { Helmet } from 'react-helmet-async'
import QRCodeGenerator from '../../components/QRCode/QRCodeGenerator'
import { useNotification } from '../../components/Notification/NotificationProvider'

const StatCard = ({ icon, title, value, subtitle, color = 'primary', action = null }) => (
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
          </Box>
          {action && (
            <Box>{action}</Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  </motion.div>
)

const TeacherDashboard = () => {
  const theme = useTheme()
  const { user } = useSelector((state) => state.auth)
  const { showSuccess } = useNotification()
  const [generatorOpen, setGeneratorOpen] = useState(false)
  const [selectedSession, setSelectedSession] = useState(null)

  // Mock data - replace with real API calls
  const teacherStats = {
    totalClasses: 6,
    totalStudents: 180,
    todayClasses: 3,
    attendanceRate: 87.2
  }

  const todayClasses = [
    { 
      id: 1, 
      subject: 'Lập trình Web', 
      time: '08:00 - 09:30', 
      room: 'A101', 
      students: 32, 
      attended: 28,
      status: 'completed'
    },
    { 
      id: 2, 
      subject: 'Cơ sở dữ liệu', 
      time: '10:00 - 11:30', 
      room: 'B203', 
      students: 35, 
      attended: 32,
      status: 'completed'
    },
    { 
      id: 3, 
      subject: 'Phân tích thiết kế hệ thống', 
      time: '13:30 - 15:00', 
      room: 'C305', 
      students: 30, 
      attended: null,
      status: 'upcoming'
    },
  ]

  const recentActivities = [
    { id: 1, type: 'attendance', class: 'Lập trình Web', count: '28/32 sinh viên', time: '2 giờ trước' },
    { id: 2, type: 'grade', class: 'Cơ sở dữ liệu', count: 'Đã chấm 15 bài', time: '1 ngày trước' },
    { id: 3, type: 'attendance', class: 'Cơ sở dữ liệu', count: '32/35 sinh viên', time: '2 ngày trước' },
    { id: 4, type: 'system', class: '', count: 'Cập nhật thông tin lớp học', time: '3 ngày trước' },
  ]

  const lowAttendanceStudents = [
    { id: 1, name: 'Nguyễn Văn A', class: 'Lập trình Web', rate: 65, sessions: '13/20' },
    { id: 2, name: 'Trần Thị B', class: 'Cơ sở dữ liệu', rate: 70, sessions: '14/20' },
    { id: 3, name: 'Lê Văn C', class: 'PTTKHT', rate: 72, sessions: '18/25' },
  ]

  return (
    <>
      <Helmet>
        <title>Dashboard Giảng viên - EduAttend</title>
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
                    {user?.fullName?.charAt(0) || 'T'}
                  </Avatar>
                </Grid>
                <Grid item xs>
                  <Typography variant="h4" fontWeight={700} gutterBottom>
                    Chào {user?.fullName || 'Giảng viên'}!
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
                    Khoa: {user?.department || 'Công nghệ Thông tin'} • {teacherStats.totalClasses} lớp học
                  </Typography>
                  <Stack direction="row" spacing={2} flexWrap="wrap">
                    <Chip
                      icon={<CalendarToday />}
                      label={`${teacherStats.todayClasses} lớp hôm nay`}
                      sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                    />
                    <Chip
                      icon={<TrendingUp />}
                      label={`${teacherStats.attendanceRate}% tỷ lệ tham dự`}
                      sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                    />
                  </Stack>
                </Grid>
                <Grid item>
                  <Stack direction="row" spacing={2}>                    <Button
                      variant="contained"
                      startIcon={<QrCodeScanner />}
                      onClick={() => {
                        // Demo session data
                        const demoSession = {
                          id: 'demo-session-' + Date.now(),
                          subject: 'Lập trình Web',
                          class_name: 'IT2021-01',
                          session_date: new Date().toISOString().split('T')[0],
                          start_time: '08:00',
                          end_time: '09:30',
                          total_students: 32
                        }
                        setSelectedSession(demoSession)
                        setGeneratorOpen(true)
                      }}
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                      }}
                    >
                      Tạo QR Điểm danh
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Add />}
                      sx={{
                        borderColor: 'rgba(255,255,255,0.5)',
                        color: 'white',
                        '&:hover': { 
                          borderColor: 'white',
                          bgcolor: 'rgba(255,255,255,0.1)' 
                        },
                      }}
                    >
                      Tạo lớp học
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </Paper>
          </motion.div>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<Class />}
                title="Tổng lớp học"
                value={teacherStats.totalClasses}
                subtitle="đang giảng dạy"
                color="primary"
                action={
                  <IconButton size="small" color="primary">
                    <Add />
                  </IconButton>
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<People />}
                title="Sinh viên"
                value={teacherStats.totalStudents}
                subtitle="tổng cộng"
                color="success"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<CheckCircle />}
                title="Tỷ lệ tham dự"
                value={`${teacherStats.attendanceRate}%`}
                subtitle="trung bình các lớp"
                color="warning"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<CalendarToday />}
                title="Hôm nay"
                value={teacherStats.todayClasses}
                subtitle="buổi học"
                color="info"
              />
            </Grid>
          </Grid>

          <Grid container spacing={4}>
            {/* Today's Classes */}
            <Grid item xs={12} md={8}>
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" fontWeight={600}>
                      Lớp học hôm nay
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<FileDownload />}
                      size="small"
                    >
                      Xuất báo cáo
                    </Button>
                  </Box>
                  
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Môn học</TableCell>
                        <TableCell>Thời gian</TableCell>
                        <TableCell>Phòng</TableCell>
                        <TableCell align="center">Điểm danh</TableCell>
                        <TableCell align="center">Hành động</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {todayClasses.map((class_) => (
                        <TableRow key={class_.id}>
                          <TableCell>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {class_.subject}
                            </Typography>
                          </TableCell>
                          <TableCell>{class_.time}</TableCell>
                          <TableCell>{class_.room}</TableCell>
                          <TableCell align="center">
                            {class_.status === 'completed' ? (
                              <Chip
                                label={`${class_.attended}/${class_.students}`}
                                color="success"
                                size="small"
                              />
                            ) : (
                              <Chip
                                label="Chưa điểm danh"
                                color="default"
                                size="small"
                              />
                            )}
                          </TableCell>
                          <TableCell align="center">
                            <Stack direction="row" spacing={1} justifyContent="center">
                              <IconButton size="small" color="primary">
                                <Visibility />
                              </IconButton>
                              <IconButton size="small" color="secondary">
                                <QrCodeScanner />
                              </IconButton>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </Grid>

            {/* Recent Activities */}
            <Grid item xs={12} md={4}>
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, mb: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Hoạt động gần đây
                  </Typography>
                  <List>
                    {recentActivities.map((activity) => (
                      <ListItem key={activity.id} divider>
                        <ListItemIcon>
                          {activity.type === 'attendance' ? (
                            <CheckCircle color="success" />
                          ) : activity.type === 'grade' ? (
                            <Assignment color="primary" />
                          ) : (
                            <Notifications color="info" />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={activity.count}
                          secondary={`${activity.class ? activity.class + ' • ' : ''}${activity.time}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>

              {/* Low Attendance Alert */}
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'warning.main', borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom color="warning.main">
                    ⚠️ Cần quan tâm
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Sinh viên có tỷ lệ tham dự thấp
                  </Typography>
                  
                  <Stack spacing={2} sx={{ mt: 2 }}>
                    {lowAttendanceStudents.map((student) => (
                      <Paper
                        key={student.id}
                        elevation={0}
                        sx={{
                          p: 2,
                          bgcolor: 'warning.light',
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: 'warning.main',
                        }}
                      >
                        <Typography variant="subtitle2" fontWeight={600}>
                          {student.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {student.class} • {student.rate}% ({student.sessions})
                        </Typography>
                      </Paper>
                    ))}
                  </Stack>
                  
                  <Button
                    fullWidth
                    variant="outlined"
                    color="warning"
                    size="small"
                    sx={{ mt: 2 }}
                  >
                    Xem chi tiết
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>        </Container>

        {/* QR Code Generator */}
        <QRCodeGenerator
          open={generatorOpen}
          onClose={() => setGeneratorOpen(false)}
          sessionData={selectedSession}
          onSessionUpdate={(updatedSession) => {
            setSelectedSession(updatedSession)
            showSuccess('Phiên điểm danh đã được cập nhật')
          }}
        />
      </Box>
    </>
  )
}

export default TeacherDashboard
