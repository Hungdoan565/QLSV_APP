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
  Stack,
  IconButton,
  useTheme,
  useMediaQuery,
  alpha,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import {
  QrCodeScanner,
  People,
  School,
  CheckCircle,
  Schedule,
  TrendingUp,
  Add,
  Visibility,
  FileDownload,
  Notifications,
  Warning,
  Refresh,
  Close,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { Helmet } from 'react-helmet-async'
import { useNotification } from '../../components/Notification/NotificationProvider'
import classService from '../../services/classService'
import attendanceService from '../../services/attendanceService'
import gradeService from '../../services/gradeService'

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
          </Box>
          {action && (
            <Box>{action}</Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  </motion.div>
)

// Class Session Card Component
const ClassSessionCard = ({ session, onViewAttendance, onGenerateQR }) => (
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
              {session.session_name || session.class_obj?.class_name || 'Buổi học'}
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="body2" color="text.secondary">
                {session.start_time} - {session.end_time}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {session.location || 'Phòng học'}
              </Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary">
              Lớp: {session.class_obj?.class_id || 'N/A'} • {session.class_obj?.current_students_count || 0} sinh viên
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Chip
              label={session.is_active ? 'Đang hoạt động' : 'Đã kết thúc'}
              color={session.is_active ? 'success' : 'default'}
              size="small"
              sx={{ mb: 1 }}
            />
            <Stack direction="row" spacing={1}>
              <IconButton size="small" color="primary" onClick={() => onViewAttendance(session)}>
                <Visibility />
              </IconButton>
              <IconButton size="small" color="secondary" onClick={() => onGenerateQR(session)}>
                <QrCodeScanner />
              </IconButton>
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  </motion.div>
)

const TeacherDashboard = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { user } = useSelector((state) => state.auth)
  const { showSuccess, showError } = useNotification()

  // State management
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [qrDialogOpen, setQrDialogOpen] = useState(false)
  const [selectedSession, setSelectedSession] = useState(null)
  const [qrCodeData, setQrCodeData] = useState(null)

  const [teacherStats, setTeacherStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    todayClasses: 0,
    attendanceRate: 0
  })

  const [todaysSessions, setTodaysSessions] = useState([])
  const [lowAttendanceStudents, setLowAttendanceStudents] = useState([])

  // Load teacher data
  const loadTeacherData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Load teacher's classes and statistics
      const [classStats, classes] = await Promise.all([
        classService.getClassStatistics(),
        classService.getClasses()
      ])

      // Calculate teacher-specific stats
      const teacherClasses = classes.data.filter(cls => cls.teacher?.id === user?.id)
      const totalStudents = teacherClasses.reduce((sum, cls) => sum + (cls.current_students_count || 0), 0)
      
      // Get today's sessions (mock for now - would need real schedule API)
      const today = new Date().toISOString().split('T')[0]
      const todaySessions = await attendanceService.getSessions({ 
        session_date: today,
        class_obj__teacher: user?.id 
      })

      setTeacherStats({
        totalClasses: teacherClasses.length,
        totalStudents: totalStudents,
        todayClasses: todaySessions.data?.length || 0,
        attendanceRate: classStats.data?.avg_students_per_class || 0
      })

      setTodaysSessions(todaySessions.data || [])
      
      showSuccess('Dữ liệu giảng dạy đã được cập nhật')
    } catch (err) {
      console.error('Error loading teacher data:', err)
      setError('Không thể tải dữ liệu giảng dạy')
      showError('Lỗi khi tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  // Load data on component mount
  useEffect(() => {
    loadTeacherData()
  }, [user])

  const handleRefresh = () => {
    loadTeacherData()
  }

  const handleCreateAttendanceSession = () => {
    showSuccess('Tạo phiên điểm danh mới')
    // Navigate to attendance creation page
  }

  const handleViewAttendanceReport = () => {
    showSuccess('Xem báo cáo điểm danh')
    // Navigate to attendance report page
  }

  const handleManageStudents = () => {
    showSuccess('Quản lý sinh viên')
    // Navigate to student management page
  }

  const handleGenerateQR = async (session) => {
    try {
      setSelectedSession(session)
      setQrDialogOpen(true)
      
      // Generate QR code for the session
      const response = await attendanceService.generateQRCode(session.id)
      setQrCodeData(response.data)
      
      showSuccess(`QR code đã được tạo cho ${session.session_name}`)
    } catch (err) {
      console.error('Error generating QR code:', err)
      showError('Không thể tạo QR code')
    }
  }

  const handleViewAttendance = async (session) => {
    try {
      // Get attendance analytics for the session
      const analytics = await attendanceService.getAttendanceAnalytics(session.id)
      showSuccess(`Xem điểm danh ${session.session_name}`)
      // Show analytics in modal or navigate to detailed view
    } catch (err) {
      console.error('Error loading attendance analytics:', err)
      showError('Không thể tải thông tin điểm danh')
    }
  }

  const handleExportReport = () => {
    showSuccess('Xuất báo cáo thành công')
    // Export attendance report
  }

  const closeQrDialog = () => {
    setQrDialogOpen(false)
    setSelectedSession(null)
    setQrCodeData(null)
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress size={60} />
      </Box>
    )
  }

  return (
    <>
      <Helmet>
        <title>Dashboard Giảng viên - EduAttend</title>
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
                {user?.first_name?.charAt(0) || 'T'}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  Chào {user?.first_name || 'Giảng viên'}!
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
                  Khoa: {user?.department || 'Công nghệ Thông tin'} • {teacherStats.totalClasses} lớp học
                </Typography>
                <Stack direction="row" spacing={2} flexWrap="wrap" alignItems="center">
                  <Chip
                    icon={<Schedule />}
                    label={`${teacherStats.todayClasses} lớp hôm nay`}
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                  <Chip
                    icon={<TrendingUp />}
                    label={`${teacherStats.attendanceRate}% tỷ lệ tham dự`}
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                  <IconButton
                    onClick={handleRefresh}
                    sx={{ color: 'white', ml: 1 }}
                    disabled={loading}
                  >
                    <Refresh />
                  </IconButton>
                </Stack>
              </Box>
            </Stack>
          </Card>
        </motion.div>

        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

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
                title="Tạo điểm danh"
                subtitle="Tạo phiên điểm danh mới"
                onClick={handleCreateAttendanceSession}
                color="primary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <QuickActionCard
                icon={<FileDownload />}
                title="Báo cáo"
                subtitle="Xem báo cáo điểm danh"
                onClick={handleViewAttendanceReport}
                color="secondary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <QuickActionCard
                icon={<People />}
                title="Quản lý SV"
                subtitle="Quản lý sinh viên"
                onClick={handleManageStudents}
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
            Thống kê giảng dạy
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<School />}
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
                icon={<Schedule />}
                title="Hôm nay"
                value={teacherStats.todayClasses}
                subtitle="buổi học"
                color="info"
              />
            </Grid>
          </Grid>
        </motion.div>

        <Grid container spacing={4}>
          {/* Today's Sessions */}
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
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
                      onClick={handleExportReport}
                    >
                      Xuất báo cáo
                    </Button>
                  </Box>
                  
                  {todaysSessions.map((session) => (
                    <ClassSessionCard
                      key={session.id}
                      session={session}
                      onViewAttendance={handleViewAttendance}
                      onGenerateQR={handleGenerateQR}
                    />
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Low Attendance Alert */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
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
            </motion.div>
          </Grid>
        </Grid>
      </Box>

      {/* QR Code Dialog */}
      <Dialog 
        open={qrDialogOpen} 
        onClose={closeQrDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">QR Code điểm danh</Typography>
            <IconButton onClick={closeQrDialog}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {qrCodeData && (
            <Stack spacing={3} alignItems="center">
              <Typography variant="h6" textAlign="center">
                {selectedSession?.session_name}
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Lớp: {selectedSession?.class_obj?.class_name} • {selectedSession?.start_time} - {selectedSession?.end_time}
              </Typography>
              
              <Box sx={{ p: 2, border: '2px dashed', borderColor: 'divider', borderRadius: 2 }}>
                <img 
                  src={qrCodeData.qr_image} 
                  alt="QR Code" 
                  style={{ 
                    width: '200px', 
                    height: '200px',
                    display: 'block'
                  }} 
                />
              </Box>
              
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Sinh viên quét QR code này để điểm danh
              </Typography>
              
              <Typography variant="caption" color="text.secondary" textAlign="center">
                QR Code: {qrCodeData.qr_code}
              </Typography>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeQrDialog} variant="outlined">
            Đóng
          </Button>
          <Button 
            onClick={() => {
              // Copy QR code to clipboard
              navigator.clipboard.writeText(qrCodeData?.qr_code || '')
              showSuccess('QR Code đã được copy')
            }} 
            variant="contained"
          >
            Copy QR Code
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default TeacherDashboard
