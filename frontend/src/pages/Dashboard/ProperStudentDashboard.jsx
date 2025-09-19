import React, { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  LinearProgress,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Divider,
  Stack,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  QrCode as QrCodeIcon,
  Schedule as ScheduleIcon,
  Refresh as RefreshIcon,
  CameraAlt as CameraAltIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  TrendingUp as TrendingUpIcon,
  Grade as GradeIcon,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useAuth } from '../../contexts/AuthContext'
import attendanceService from '../../services/attendanceService'
import gradeService from '../../services/gradeService'
import studentService from '../../services/studentService'

const ProperStudentDashboard = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [studentData, setStudentData] = useState({
    attendanceRecords: [],
    recentGrades: [],
    statistics: {
      attendanceRate: 0,
      totalClasses: 0,
      averageGrade: 0,
      thisWeekAttendance: 0
    }
  })
  const [qrDialogOpen, setQrDialogOpen] = useState(false)
  const [qrCodeInput, setQrCodeInput] = useState('')

  const loadStudentData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Load student's attendance records
      const attendanceResponse = await attendanceService.getAttendances({
        student_id: user.student_id || user.id
      })
      const attendanceRecords = attendanceResponse.data?.results || []

      // Load student's grades
      const gradesResponse = await gradeService.getGrades({
        student_id: user.student_id || user.id,
        ordering: '-created_at'
      })
      const recentGrades = gradesResponse.data?.results || []

      // Calculate statistics
      const totalClasses = attendanceRecords.length
      const presentClasses = attendanceRecords.filter(record => record.status === 'present').length
      const attendanceRate = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0

      const averageGrade = recentGrades.length > 0
        ? recentGrades.reduce((sum, grade) => sum + (grade.score || 0), 0) / recentGrades.length
        : 0

      // Calculate this week's attendance
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      const thisWeekRecords = attendanceRecords.filter(record => 
        new Date(record.check_in_time) >= oneWeekAgo
      )
      const thisWeekPresent = thisWeekRecords.filter(record => record.status === 'present').length

      setStudentData({
        attendanceRecords: attendanceRecords.slice(0, 10),
        recentGrades: recentGrades.slice(0, 10),
        statistics: {
          attendanceRate,
          totalClasses,
          averageGrade: Math.round(averageGrade * 100) / 100,
          thisWeekAttendance: thisWeekPresent
        }
      })
    } catch (err) {
      console.error('Error loading student data:', err)
      setError('Failed to load student data')
    } finally {
      setLoading(false)
    }
  }, [user.id, user.student_id])

  useEffect(() => {
    loadStudentData()
  }, [loadStudentData])

  const handleRefresh = () => {
    loadStudentData()
  }

  const handleAttendanceCheckIn = () => {
    setQrDialogOpen(true)
  }

  const handleQRCodeSubmit = async () => {
    if (!qrCodeInput.trim()) {
      setError('Please enter a QR code')
      return
    }

    try {
      const response = await attendanceService.checkInWithQR({
        qr_code: qrCodeInput.trim(),
        student_id: user.student_id || user.id
      })
      
      console.log('Check-in successful:', response.data)
      setQrDialogOpen(false)
      setQrCodeInput('')
      loadStudentData() // Refresh data
    } catch (err) {
      console.error('Error checking in:', err)
      setError('Failed to check in. Please try again.')
    }
  }

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Avatar sx={{ bgcolor: `${color}.main`, width: 56, height: 56 }}>
              {icon}
            </Avatar>
          </Box>
          <Typography variant="h4" fontWeight={700} color={`${color}.main`} gutterBottom>
            {value}
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    )
  }

  return (
    <>
      <Helmet>
        <title>Student Dashboard - Student Management System</title>
      </Helmet>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box mb={4}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                <SchoolIcon />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  Student Dashboard
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Welcome, {user.first_name} {user.last_name}
                </Typography>
              </Box>
            </Box>
            <Box display="flex" gap={1}>
              <Tooltip title="Refresh Data">
                <IconButton onClick={handleRefresh} color="primary">
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Button
                variant="contained"
                startIcon={<QrCodeIcon />}
                onClick={handleAttendanceCheckIn}
                sx={{ ml: 2 }}
              >
                Check In
              </Button>
            </Box>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
        </Box>

        {/* Student Statistics */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Attendance Rate"
              value={`${studentData.statistics.attendanceRate}%`}
              icon={<ScheduleIcon />}
              color="success"
              subtitle="Overall attendance"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="This Week"
              value={studentData.statistics.thisWeekAttendance}
              icon={<TrendingUpIcon />}
              color="info"
              subtitle="Classes attended"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Classes"
              value={studentData.statistics.totalClasses}
              icon={<SchoolIcon />}
              color="primary"
              subtitle="All time"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Average Grade"
              value={studentData.statistics.averageGrade}
              icon={<GradeIcon />}
              color="warning"
              subtitle="Recent grades"
            />
          </Grid>
        </Grid>

        {/* Recent Activity */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Recent Attendance
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {studentData.attendanceRecords.length === 0 ? (
                  <Box textAlign="center" py={4}>
                    <ScheduleIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                      No attendance records found
                    </Typography>
                  </Box>
                ) : (
                  <List>
                    {studentData.attendanceRecords.map((record) => (
                      <ListItem key={record.id} divider>
                        <ListItemIcon>
                          <Avatar sx={{ 
                            bgcolor: record.status === 'present' ? 'success.main' : 'error.main' 
                          }}>
                            {record.status === 'present' ? <CheckCircleIcon /> : <CancelIcon />}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={record.session?.session_name || 'Unknown Session'}
                          secondary={new Date(record.check_in_time).toLocaleString()}
                        />
                        <ListItemSecondaryAction>
                          <Chip
                            label={record.status}
                            color={record.status === 'present' ? 'success' : 'error'}
                            size="small"
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Recent Grades
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {studentData.recentGrades.length === 0 ? (
                  <Box textAlign="center" py={4}>
                    <GradeIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                      No grades recorded yet
                    </Typography>
                  </Box>
                ) : (
                  <List>
                    {studentData.recentGrades.map((grade) => (
                      <ListItem key={grade.id} divider>
                        <ListItemIcon>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            <GradeIcon />
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={grade.subject || 'Unknown Subject'}
                          secondary={`${grade.grade_type} - ${new Date(grade.created_at).toLocaleDateString()}`}
                        />
                        <ListItemSecondaryAction>
                          <Chip
                            label={grade.score}
                            color="primary"
                            size="small"
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* QR Code Check-in Dialog */}
        <Dialog open={qrDialogOpen} onClose={() => setQrDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Box display="flex" alignItems="center" gap={1}>
              <QrCodeIcon />
              <Typography variant="h6">Check In with QR Code</Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box py={2}>
              <Typography variant="body1" gutterBottom>
                Enter the QR code from your teacher to check in for attendance.
              </Typography>
              <TextField
                fullWidth
                label="QR Code"
                value={qrCodeInput}
                onChange={(e) => setQrCodeInput(e.target.value)}
                placeholder="Scan or enter QR code"
                sx={{ mt: 2 }}
                InputProps={{
                  startAdornment: <QrCodeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setQrDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleQRCodeSubmit} 
              variant="contained"
              disabled={!qrCodeInput.trim()}
            >
              Check In
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  )
}

export default ProperStudentDashboard
