import React from 'react'
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Divider,
} from '@mui/material'
import {
  People,
  School,
  PendingActions,
  AdminPanelSettings,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useAuth } from '../../contexts/AuthContext'
import TeacherApprovalManagement from '../../components/Admin/TeacherApprovalManagement'

const AdminDashboard = () => {
  const { user, profile } = useAuth()

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - EduAttend</title>
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
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                color: 'white',
              }}
            >
              <Grid container alignItems="center" spacing={3}>
                <Grid item>
                  <AdminPanelSettings sx={{ fontSize: 80 }} />
                </Grid>
                <Grid item xs>                  <Typography variant="h4" fontWeight={700} gutterBottom>
                    Chào Admin {profile?.full_name || user?.user_metadata?.full_name || 'Administrator'}!
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
                    Quản lý và giám sát hệ thống điểm danh sinh viên
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </motion.div>

          {/* Quick Stats */}
          <Grid container spacing={4} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <People sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h5" fontWeight={700}>
                    0
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tổng người dùng
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <School sx={{ fontSize: 40, color: 'success.main', mb: 2 }} />
                  <Typography variant="h5" fontWeight={700}>
                    0
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Giáo viên hoạt động
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <PendingActions sx={{ fontSize: 40, color: 'warning.main', mb: 2 }} />
                  <Typography variant="h5" fontWeight={700}>
                    0
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Chờ phê duyệt
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <People sx={{ fontSize: 40, color: 'info.main', mb: 2 }} />
                  <Typography variant="h5" fontWeight={700}>
                    0
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sinh viên
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Teacher Approval Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                🛡️ Bảo mật & Phê duyệt tài khoản
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <TeacherApprovalManagement />
            </Paper>
          </motion.div>
        </Container>
      </Box>
    </>
  )
}

export default AdminDashboard
