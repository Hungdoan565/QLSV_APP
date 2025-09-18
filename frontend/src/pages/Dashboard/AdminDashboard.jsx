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
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material'
import {
  People,
  School,
  AdminPanelSettings,
  TrendingUp,
  CheckCircle,
  Warning,
  Error,
  Notifications,
  Settings,
  Security,
  Analytics,
  Assignment,
  Add,
  Visibility,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { Helmet } from 'react-helmet-async'
import { useNotification } from '../../components/Notification/NotificationProvider'

// Stat Card Component
const StatCard = ({ icon, title, value, subtitle, color = 'primary', trend = null, onClick = null }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Card 
      elevation={0} 
      sx={{ 
        border: '1px solid', 
        borderColor: 'divider', 
        borderRadius: 3,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        '&:hover': onClick ? {
          borderColor: `${color}.main`,
          boxShadow: (theme) => `0 4px 20px ${alpha(theme.palette[color].main, 0.15)}`,
        } : {}
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: alpha(color === 'primary' ? '#3b82f6' : color === 'success' ? '#22c55e' : color === 'warning' ? '#f59e0b' : '#ef4444', 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: color === 'primary' ? '#3b82f6' : color === 'success' ? '#22c55e' : color === 'warning' ? '#f59e0b' : '#ef4444',
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

// System Health Card Component
const SystemHealthCard = ({ status, title, description, progress = null }) => (
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
              bgcolor: status === 'healthy' ? alpha('#22c55e', 0.1) : status === 'warning' ? alpha('#f59e0b', 0.1) : alpha('#ef4444', 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: status === 'healthy' ? '#22c55e' : status === 'warning' ? '#f59e0b' : '#ef4444',
            }}
          >
            {status === 'healthy' ? <CheckCircle /> : status === 'warning' ? <Warning /> : <Error />}
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
            {progress !== null && (
              <Box sx={{ mt: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 3,
                      bgcolor: status === 'healthy' ? 'success.main' : status === 'warning' ? 'warning.main' : 'error.main',
                    },
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  {progress}% hoạt động
                </Typography>
              </Box>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  </motion.div>
)

// Recent Activity Item Component
const ActivityItem = ({ icon, title, description, time, type = 'info' }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3 }}
  >
    <ListItem sx={{ px: 0 }}>
      <ListItemIcon>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 1,
            bgcolor: type === 'success' ? alpha('#22c55e', 0.1) : type === 'warning' ? alpha('#f59e0b', 0.1) : alpha('#3b82f6', 0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: type === 'success' ? '#22c55e' : type === 'warning' ? '#f59e0b' : '#3b82f6',
          }}
        >
          {icon}
        </Box>
      </ListItemIcon>
      <ListItemText
        primary={title}
        secondary={description}
        primaryTypographyProps={{ fontWeight: 600 }}
        secondaryTypographyProps={{ color: 'text.secondary' }}
      />
      <Typography variant="caption" color="text.secondary">
        {time}
      </Typography>
    </ListItem>
  </motion.div>
)

const AdminDashboard = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { user } = useSelector((state) => state.auth)
  const { showSuccess, showError } = useNotification()

  // Mock data - replace with real API calls
  const [systemStats, setSystemStats] = useState({
    totalUsers: 1250,
    activeTeachers: 45,
    pendingApprovals: 8,
    totalStudents: 1200,
    systemUptime: 99.9,
    databaseHealth: 95,
    apiResponseTime: 120
  })

  const [systemHealth, setSystemHealth] = useState([
    { status: 'healthy', title: 'Database', description: 'PostgreSQL hoạt động bình thường', progress: 95 },
    { status: 'healthy', title: 'API Server', description: 'Django REST API phản hồi tốt', progress: 98 },
    { status: 'warning', title: 'File Storage', description: 'Dung lượng lưu trữ đang cao', progress: 78 },
    { status: 'healthy', title: 'Authentication', description: 'JWT token hoạt động ổn định', progress: 99 },
  ])

  const [recentActivities, setRecentActivities] = useState([
    { icon: <People />, title: 'Giáo viên mới đăng ký', description: 'TS. Nguyễn Văn A đã đăng ký tài khoản', time: '2 phút trước', type: 'info' },
    { icon: <CheckCircle />, title: 'Phê duyệt thành công', description: 'Đã phê duyệt 3 tài khoản giáo viên', time: '15 phút trước', type: 'success' },
    { icon: <Warning />, title: 'Cảnh báo hệ thống', description: 'Dung lượng lưu trữ đạt 78%', time: '1 giờ trước', type: 'warning' },
    { icon: <Analytics />, title: 'Báo cáo tuần', description: 'Đã tạo báo cáo thống kê tuần', time: '2 giờ trước', type: 'info' },
  ])

  const handleManageUsers = () => {
    showSuccess('Chuyển đến quản lý người dùng')
    // Navigate to user management
  }

  const handleSystemSettings = () => {
    showSuccess('Chuyển đến cài đặt hệ thống')
    // Navigate to system settings
  }

  const handleViewAnalytics = () => {
    showSuccess('Chuyển đến phân tích dữ liệu')
    // Navigate to analytics
  }

  const handleApproveTeachers = () => {
    showSuccess('Chuyển đến phê duyệt giáo viên')
    // Navigate to teacher approval
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - EduAttend</title>
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
                <AdminPanelSettings />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  Chào Admin {user?.first_name || 'Administrator'}!
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
                  Quản lý và giám sát hệ thống điểm danh sinh viên
                </Typography>
                <Stack direction="row" spacing={2} flexWrap="wrap">
                  <Chip
                    icon={<CheckCircle />}
                    label={`${systemStats.systemUptime}% uptime`}
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                  <Chip
                    icon={<Security />}
                    label="Hệ thống an toàn"
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                </Stack>
              </Box>
            </Stack>
          </Card>
        </motion.div>

        {/* System Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
            Thống kê hệ thống
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<People />}
                title="Tổng người dùng"
                value={systemStats.totalUsers.toLocaleString()}
                subtitle="đã đăng ký"
                color="primary"
                trend="+12% tháng này"
                onClick={handleManageUsers}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<School />}
                title="Giáo viên hoạt động"
                value={systemStats.activeTeachers}
                subtitle="đang giảng dạy"
                color="success"
                trend="+3 tuần này"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<Warning />}
                title="Chờ phê duyệt"
                value={systemStats.pendingApprovals}
                subtitle="tài khoản"
                color="warning"
                onClick={handleApproveTeachers}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<TrendingUp />}
                title="Sinh viên"
                value={systemStats.totalStudents.toLocaleString()}
                subtitle="đang học"
                color="info"
                trend="+5% học kỳ này"
              />
            </Grid>
          </Grid>
        </motion.div>

        <Grid container spacing={4}>
          {/* System Health */}
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" fontWeight={600}>
                      Tình trạng hệ thống
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<Settings />}
                      size="small"
                      onClick={handleSystemSettings}
                    >
                      Cài đặt
                    </Button>
                  </Box>
                  
                  {systemHealth.map((health, index) => (
                    <SystemHealthCard
                      key={index}
                      status={health.status}
                      title={health.title}
                      description={health.description}
                      progress={health.progress}
                    />
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Recent Activities */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Hoạt động gần đây
                  </Typography>
                  <List sx={{ px: 0 }}>
                    {recentActivities.map((activity, index) => (
                      <React.Fragment key={index}>
                        <ActivityItem
                          icon={activity.icon}
                          title={activity.title}
                          description={activity.description}
                          time={activity.time}
                          type={activity.type}
                        />
                        {index < recentActivities.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mb: 3, mt: 4 }}>
            Thao tác quản trị
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, cursor: 'pointer' }}>
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      bgcolor: alpha('#3b82f6', 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                      color: '#3b82f6',
                    }}
                  >
                    <People />
                  </Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Quản lý người dùng
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quản lý tài khoản và quyền hạn
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, cursor: 'pointer' }}>
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      bgcolor: alpha('#22c55e', 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                      color: '#22c55e',
                    }}
                  >
                    <Analytics />
                  </Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Phân tích dữ liệu
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Báo cáo và thống kê chi tiết
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, cursor: 'pointer' }}>
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      bgcolor: alpha('#f59e0b', 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                      color: '#f59e0b',
                    }}
                  >
                    <Security />
                  </Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Bảo mật hệ thống
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cài đặt bảo mật và quyền truy cập
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, cursor: 'pointer' }}>
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      bgcolor: alpha('#ef4444', 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                      color: '#ef4444',
                    }}
                  >
                    <Settings />
                  </Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Cài đặt hệ thống
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cấu hình và tùy chỉnh hệ thống
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </motion.div>
      </Box>
    </>
  )
}

export default AdminDashboard
