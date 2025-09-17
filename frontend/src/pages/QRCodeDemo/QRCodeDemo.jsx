import React, { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Paper,
  Stack,
  Alert,
} from '@mui/material'
import {
  QrCodeScanner,
  QrCode2,
  School,
  PlayArrow,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { QRCodeScanner, QRCodeGenerator } from '../../components/QRCode'
import { useNotification } from '../../components/Notification/NotificationProvider'

const QRCodeDemo = () => {
  const [scannerOpen, setScannerOpen] = useState(false)
  const [generatorOpen, setGeneratorOpen] = useState(false)
  const { showSuccess, showInfo } = useNotification()

  // Demo session data
  const demoSession = {
    id: 'demo-session-' + Date.now(),
    subject: 'Demo - Lập trình Web',
    class_name: 'DEMO-CLASS',
    session_date: new Date().toISOString().split('T')[0],
    start_time: new Date().toTimeString().slice(0, 5),
    end_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toTimeString().slice(0, 5), // 2 hours later
    total_students: 30,
    qr_code_data: `ATTENDANCE:demo-session-${Date.now()}:${Date.now()}:demo`
  }

  const handleScannerSuccess = (result) => {
    showSuccess(`Demo: ${result.message}`)
    setScannerOpen(false)
  }

  const handleGeneratorDemo = () => {
    showInfo('Đang mở QR Generator trong chế độ demo')
    setGeneratorOpen(true)
  }

  return (
    <>
      <Helmet>
        <title>Demo QR Code - Student Management</title>
      </Helmet>

      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" fontWeight={700} gutterBottom>
            🎯 Demo QR Code Điểm danh
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Trải nghiệm tính năng điểm danh QR Code trong môi trường demo
          </Typography>
        </Box>

        {/* Demo Alert */}
        <Alert 
          severity="info" 
          sx={{ mb: 4, borderRadius: 3 }}
          icon={<PlayArrow />}
        >
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Chế độ Demo đang hoạt động
          </Typography>
          Bạn đang sử dụng phiên bản demo của hệ thống. Tất cả dữ liệu đều là giả lập và không được lưu trữ thực tế.
        </Alert>

        {/* Demo Cards */}
        <Grid container spacing={4}>
          {/* Scanner Demo */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card 
                sx={{ 
                  height: '100%',
                  border: '2px solid',
                  borderColor: 'primary.main',
                  borderRadius: 3,
                  '&:hover': { boxShadow: 6 }
                }}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: 'primary.light',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                    }}
                  >
                    <QrCodeScanner sx={{ fontSize: 40, color: 'primary.main' }} />
                  </Box>
                  
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    Quét QR Code
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    Trải nghiệm tính năng quét QR code để điểm danh. 
                    Camera sẽ được kích hoạt để quét mã QR.
                  </Typography>

                  <Stack spacing={2}>
                    <Typography variant="body2" color="primary.main" fontWeight={600}>
                      🎯 Dành cho sinh viên
                    </Typography>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<QrCodeScanner />}
                      onClick={() => setScannerOpen(true)}
                      sx={{ borderRadius: 2 }}
                    >
                      Mở Camera Quét QR
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Generator Demo */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card 
                sx={{ 
                  height: '100%',
                  border: '2px solid',
                  borderColor: 'success.main',
                  borderRadius: 3,
                  '&:hover': { boxShadow: 6 }
                }}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: 'success.light',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                    }}
                  >
                    <QrCode2 sx={{ fontSize: 40, color: 'success.main' }} />
                  </Box>
                  
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    Tạo QR Code
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    Xem cách giáo viên tạo và quản lý QR code cho các phiên điểm danh, 
                    theo dõi thống kê real-time.
                  </Typography>

                  <Stack spacing={2}>
                    <Typography variant="body2" color="success.main" fontWeight={600}>
                      👨‍🏫 Dành cho giáo viên
                    </Typography>
                    <Button
                      variant="contained"
                      color="success"
                      size="large"
                      startIcon={<QrCode2 />}
                      onClick={handleGeneratorDemo}
                      sx={{ borderRadius: 2 }}
                    >
                      Mở QR Generator
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Feature Highlights */}
        <Paper sx={{ p: 4, mt: 4, borderRadius: 3, bgcolor: 'grey.50' }}>
          <Typography variant="h5" fontWeight={600} gutterBottom textAlign="center">
            ✨ Tính năng nổi bật
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="primary.main" gutterBottom>
                  📱 Camera Integration
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tích hợp camera để quét QR code nhanh chóng và chính xác
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="success.main" gutterBottom>
                  🔄 Real-time Updates
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Cập nhật thống kê điểm danh theo thời gian thực
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="warning.main" gutterBottom>
                  🔒 Security Features
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  QR code tự động làm mới và kiểm tra thời gian
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="error.main" gutterBottom>
                  📊 Analytics
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Thống kê chi tiết và báo cáo tự động
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Instructions */}
        <Paper sx={{ p: 3, mt: 3, borderRadius: 3, border: '1px dashed', borderColor: 'primary.main' }}>
          <Typography variant="h6" fontWeight={600} gutterBottom color="primary.main">
            📋 Hướng dẫn sử dụng Demo
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                🔍 Để test QR Scanner:
              </Typography>
              <Typography variant="body2" color="text.secondary" component="div">
                1. Nhấn "Mở Camera Quét QR"<br/>
                2. Cho phép truy cập camera<br/>
                3. Tạo QR code từ phần Generator trước<br/>
                4. Quét QR code đã tạo
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                📱 Để test QR Generator:
              </Typography>
              <Typography variant="body2" color="text.secondary" component="div">
                1. Nhấn "Mở QR Generator"<br/>
                2. Xem QR code được tạo<br/>
                3. Test các chức năng in, tải xuống<br/>
                4. Theo dõi thống kê real-time
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* QR Code Scanner */}
      <QRCodeScanner
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onSuccess={handleScannerSuccess}
        title="Demo QR Scanner"
        subtitle="Quét QR code demo để test tính năng"
      />

      {/* QR Code Generator */}
      <QRCodeGenerator
        open={generatorOpen}
        onClose={() => setGeneratorOpen(false)}
        sessionData={demoSession}
        title="Demo QR Generator"
        onSessionUpdate={(session) => {
          showInfo('Demo: Session đã được cập nhật')
        }}
      />
    </>
  )
}

export default QRCodeDemo
