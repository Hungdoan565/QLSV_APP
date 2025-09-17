import React, { useState, useEffect, useRef } from 'react'
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Chip,
  Stack,
  Paper,
} from '@mui/material'
import {
  QrCodeScanner as QrIcon,
  Close,
  CameraAlt,
  FlashOn,
  FlashOff,
  Refresh,
  CheckCircle,
  Error as ErrorIcon,
} from '@mui/icons-material'
import { Html5QrcodeScanner, Html5QrcodeScannerState } from 'html5-qrcode'
import { motion, AnimatePresence } from 'framer-motion'
import { useNotification } from '../Notification/NotificationProvider'
import attendanceService from '../../services/attendanceService'

const QRCodeScanner = ({ 
  open, 
  onClose, 
  onSuccess,
  title = "Quét QR Code Điểm Danh",
  subtitle = "Hướng camera vào QR code để điểm danh"
}) => {
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState(null)
  const [error, setError] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [scannerReady, setScannerReady] = useState(false)
  const [cameraPermission, setCameraPermission] = useState(null)
  
  const scannerRef = useRef(null)
  const { showSuccess, showError, showWarning } = useNotification()

  // Initialize scanner when dialog opens
  useEffect(() => {
    if (open && !scannerRef.current) {
      initializeScanner()
    }
    return () => {
      cleanupScanner()
    }
  }, [open])

  const initializeScanner = async () => {
    try {
      // Check camera permission
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      stream.getTracks().forEach(track => track.stop())
      setCameraPermission('granted')
      
      // Initialize HTML5 QR Code Scanner
      const scanner = new Html5QrcodeScanner(
        "qr-reader", 
        { 
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          showTorchButtonIfSupported: true,
          showZoomSliderIfSupported: true,
          defaultZoomValueIfSupported: 2,
        },
        false
      )

      scanner.render(onScanSuccess, onScanFailure)
      scannerRef.current = scanner
      setScannerReady(true)
      setIsScanning(true)
    } catch (error) {
      console.error('Camera initialization error:', error)
      setCameraPermission('denied')
      setError('Không thể truy cập camera. Vui lòng cho phép quyền truy cập camera.')
    }
  }

  const cleanupScanner = () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.getState() === Html5QrcodeScannerState.SCANNING) {
          scannerRef.current.clear()
        }
      } catch (err) {
        console.warn('Scanner cleanup warning:', err)
      }
      scannerRef.current = null
    }
    setIsScanning(false)
    setScannerReady(false)
  }

  const onScanSuccess = async (decodedText, decodedResult) => {
    console.log('QR Code scanned:', decodedText)
    
    // Stop scanning immediately
    setIsScanning(false)
    if (scannerRef.current) {
      try {
        scannerRef.current.clear()
      } catch (err) {
        console.warn('Scanner clear warning:', err)
      }
    }

    setIsProcessing(true)
    setError(null)

    try {
      // Parse QR code data
      const qrData = parseQRCodeData(decodedText)
      
      if (!qrData) {
        throw new Error('QR code không hợp lệ cho điểm danh')
      }

      // Mark attendance
      const result = await attendanceService.checkInWithQR({
        session_id: qrData.sessionId,
        qr_code_data: decodedText,
        location: await getCurrentLocation()
      })

      setScanResult({
        success: true,
        message: result.message,
        data: result.attendance
      })

      showSuccess(result.message)
      
      // Call success callback
      if (onSuccess) {
        onSuccess(result)
      }

      // Auto close after success
      setTimeout(() => {
        handleClose()
      }, 2000)

    } catch (error) {
      console.error('Attendance marking error:', error)
      const errorMessage = error.message || 'Điểm danh thất bại'
      setError(errorMessage)
      showError(errorMessage)
      
      setScanResult({
        success: false,
        message: errorMessage
      })

      // Allow retry after 3 seconds
      setTimeout(() => {
        setScanResult(null)
        setError(null)
        if (open) {
          initializeScanner()
        }
      }, 3000)
    } finally {
      setIsProcessing(false)
    }
  }

  const onScanFailure = (error) => {
    // Don't show errors for normal scan failures (when no QR detected)
    if (!error.includes('NotFoundException')) {
      console.warn('QR Code scan failure:', error)
    }
  }

  const parseQRCodeData = (data) => {
    try {
      // Expected format: ATTENDANCE:sessionId:timestamp:random
      if (data.startsWith('ATTENDANCE:')) {
        const parts = data.split(':')
        if (parts.length >= 2) {
          return {
            sessionId: parts[1],
            timestamp: parts[2] || null,
            random: parts[3] || null
          }
        }
      }
      
      // Try JSON format
      const jsonData = JSON.parse(data)
      if (jsonData.type === 'attendance' && jsonData.sessionId) {
        return jsonData
      }
      
      return null
    } catch {
      return null
    }
  }

  const getCurrentLocation = () => {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy
            })
          },
          () => {
            resolve(null) // Location not required, continue without it
          },
          { timeout: 5000, enableHighAccuracy: false }
        )
      } else {
        resolve(null)
      }
    })
  }

  const handleClose = () => {
    cleanupScanner()
    setScanResult(null)
    setError(null)
    setIsProcessing(false)
    setCameraPermission(null)
    onClose()
  }

  const handleRetry = () => {
    setScanResult(null)
    setError(null)
    setIsProcessing(false)
    initializeScanner()
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: '500px'
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <QrIcon color="primary" sx={{ fontSize: 28 }} />
            <Box>
              <Typography variant="h6" fontWeight={600}>
                {title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={handleClose} edge="end">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <AnimatePresence mode="wait">
          {/* Camera Permission Denied */}
          {cameraPermission === 'denied' && (
            <motion.div
              key="permission-denied"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card sx={{ bgcolor: 'error.50', border: '1px solid', borderColor: 'error.200' }}>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Cần quyền truy cập camera
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Để quét QR code, ứng dụng cần quyền truy cập camera. 
                    Vui lòng cho phép truy cập camera và thử lại.
                  </Typography>
                  <Button 
                    variant="contained" 
                    startIcon={<Refresh />}
                    onClick={handleRetry}
                    sx={{ mt: 2 }}
                  >
                    Thử lại
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Processing */}
          {isProcessing && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Card sx={{ bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <CircularProgress size={48} sx={{ mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Đang xử lý điểm danh...
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Vui lòng chờ trong giây lát
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Scan Result */}
          {scanResult && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card sx={{ 
                bgcolor: scanResult.success ? 'success.50' : 'error.50', 
                border: '1px solid', 
                borderColor: scanResult.success ? 'success.200' : 'error.200' 
              }}>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  {scanResult.success ? (
                    <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                  ) : (
                    <ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
                  )}
                  <Typography variant="h6" gutterBottom>
                    {scanResult.success ? 'Điểm danh thành công!' : 'Điểm danh thất bại'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {scanResult.message}
                  </Typography>
                  {scanResult.success && scanResult.data && (
                    <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 2 }}>
                      <Chip 
                        label={`Thời gian: ${new Date(scanResult.data.marked_at).toLocaleTimeString('vi-VN')}`}
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    </Stack>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Scanner Interface */}
          {cameraPermission === 'granted' && !isProcessing && !scanResult && (
            <motion.div
              key="scanner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Box sx={{ textAlign: 'center' }}>
                {/* Scanner Container */}
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 2, 
                    border: '2px dashed', 
                    borderColor: 'primary.main',
                    borderRadius: 3,
                    bgcolor: 'grey.50',
                    mb: 2
                  }}
                >
                  <div id="qr-reader" style={{ width: '100%' }}></div>
                </Paper>

                {/* Status */}
                {isScanning && (
                  <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                    <Box sx={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: '50%', 
                      bgcolor: 'success.main',
                      animation: 'pulse 2s infinite'
                    }} />
                    <Typography variant="body2" color="success.main" fontWeight={600}>
                      Đang quét...
                    </Typography>
                  </Stack>
                )}

                {/* Instructions */}
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  💡 Giữ camera ổn định và hướng vào QR code để được quét tự động
                </Typography>
              </Box>
            </motion.div>
          )}

          {/* Error State */}
          {error && !isProcessing && !scanResult && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Alert 
                severity="error" 
                sx={{ mb: 2 }}
                action={
                  <Button 
                    color="inherit" 
                    size="small" 
                    onClick={handleRetry}
                    startIcon={<Refresh />}
                  >
                    Thử lại
                  </Button>
                }
              >
                {error}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} variant="outlined">
          Đóng
        </Button>
        {error && !isProcessing && (
          <Button 
            onClick={handleRetry} 
            variant="contained"
            startIcon={<Refresh />}
          >
            Thử lại
          </Button>
        )}
      </DialogActions>

      {/* Pulse animation for scanning indicator */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </Dialog>
  )
}

export default QRCodeScanner
