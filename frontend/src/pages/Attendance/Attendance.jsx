import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import {
  Add,
  Edit,
  Delete,
  Visibility,
  QrCode,
  FileDownload,
  QrCodeScanner,
  TableChart,
} from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSessions } from '../../store/slices/attendanceSlice'
import { Helmet } from 'react-helmet-async'
import QRAttendanceManager from './QRAttendanceManager'

const Attendance = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const dispatch = useDispatch()
  const { sessions, isLoading, error } = useSelector((state) => state.attendance)
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    dispatch(fetchSessions())
  }, [dispatch])

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  if (isLoading && activeTab === 1) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <>
      <Helmet>
        <title>Quản lý Điểm danh - Student Management</title>
      </Helmet>
      
      <Box>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
            Quản lý điểm danh
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Hệ thống điểm danh thông minh với QR Code và quản lý truyền thống
          </Typography>
        </Box>

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            variant={isMobile ? 'fullWidth' : 'standard'}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab 
              icon={<QrCodeScanner />} 
              label="QR Code Điểm danh" 
              iconPosition="start"
              sx={{ textTransform: 'none', fontWeight: 600 }}
            />
            <Tab 
              icon={<TableChart />} 
              label="Quản lý truyền thống" 
              iconPosition="start"
              sx={{ textTransform: 'none', fontWeight: 600 }}
            />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        {activeTab === 0 && <QRAttendanceManager />}
        
        {activeTab === 1 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" component="h2">
                Phiên điểm danh truyền thống
              </Typography>
              <Box>
                <Button
                  variant="outlined"
                  startIcon={<FileDownload />}
                  sx={{ mr: 1 }}
                >
                  Export Excel
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                >
                  Tạo buổi điểm danh
                </Button>
              </Box>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Paper>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Tên buổi</TableCell>
                      <TableCell>Lớp học</TableCell>
                      <TableCell>Ngày</TableCell>
                      <TableCell>Thời gian</TableCell>
                      <TableCell>Địa điểm</TableCell>
                      <TableCell>Trạng thái</TableCell>
                      <TableCell align="center">Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell>{session.session_name}</TableCell>
                        <TableCell>{session.class_obj?.class_name}</TableCell>
                        <TableCell>
                          {new Date(session.session_date).toLocaleDateString('vi-VN')}
                        </TableCell>
                        <TableCell>
                          {session.start_time} - {session.end_time}
                        </TableCell>
                        <TableCell>{session.location || '-'}</TableCell>
                        <TableCell>
                          <Chip
                            label={session.is_active ? 'Hoạt động' : 'Không hoạt động'}
                            color={session.is_active ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton size="small" color="primary">
                            <QrCode />
                          </IconButton>
                          <IconButton size="small" color="primary">
                            <Visibility />
                          </IconButton>
                          <IconButton size="small" color="primary">
                            <Edit />
                          </IconButton>
                          <IconButton size="small" color="error">
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        )}
      </Box>
    </>
  )
}

export default Attendance
