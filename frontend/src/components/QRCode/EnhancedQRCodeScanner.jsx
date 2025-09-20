import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
  Paper,
  Divider,
  Chip,
  Card,
  CardContent,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material'
import {
  QrCode as QrCodeIcon,
  CameraAlt as CameraIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Security as SecurityIcon,
  Schedule as ScheduleIcon,
  School as SchoolIcon,
  Verified as VerifiedIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material'
import QrScanner from 'qr-scanner'
import QRCodeService from '../../services/qrCodeService'
import { motion, AnimatePresence } from 'framer-motion'

const EnhancedQRCodeScanner = ({ 
  open, 
  onClose, 
  onScanSuccess, 
  onScanError,
  studentId,
  showValidation = true 
}) => {
  const videoRef = useRef(null)
  const qrScannerRef = useRef(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [scannedData, setScannedData] = useState(null)
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState(null)
  const [timeRemaining, setTimeRemaining] = useState(null)
  const [scanCount, setScanCount] = useState(0)
  const [activeStep, setActiveStep] = useState(0)
  const [securityChecks, setSecurityChecks] = useState({
    cameraPermission: false,
    qrFormat: false,
    expiration: false,
    validation: false
  })

  const steps = [
    'Camera Access',
    'QR Code Scan',
    'Security Validation',
    'Check-in Complete'
  ]

  useEffect(() => {
    if (open && videoRef.current) {
      startScanner()
      setActiveStep(0)
    } else {
      stopScanner()
    }

    return () => {
      stopScanner()
    }
  }, [open])

  const startScanner = async () => {
    try {
      setError(null)
      setIsScanning(true)
      setSecurityChecks(prev => ({ ...prev, cameraPermission: false }))
      
      // Check if camera is available
      const hasCamera = await QrScanner.hasCamera()
      if (!hasCamera) {
        throw new Error('No camera found on device')
      }

      // Request camera permission
      const cameras = await QrScanner.listCameras()
      if (cameras.length === 0) {
        throw new Error('No cameras available')
      }

      setSecurityChecks(prev => ({ ...prev, cameraPermission: true }))
      setActiveStep(1)

      // Create QR scanner
      qrScannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          handleScanSuccess(result.data)
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
          preferredCamera: 'environment',
          maxScansPerSecond: 5,
          returnDetailedScanResult: true
        }
      )

      await qrScannerRef.current.start()
      
    } catch (err) {
      console.error('Scanner error:', err)
      setError(err.message || 'Failed to start camera')
      setIsScanning(false)
    }
  }

  const stopScanner = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop()
      qrScannerRef.current.destroy()
      qrScannerRef.current = null
    }
    setIsScanning(false)
  }

  const handleScanSuccess = useCallback(async (data) => {
    try {
      setScanCount(prev => prev + 1)
      setError(null)
      setActiveStep(2)
      
      // Parse QR code data
      const qrData = QRCodeService.parseQRData(data)
      setScannedData(qrData)
      setSecurityChecks(prev => ({ ...prev, qrFormat: true }))
      
      // Check if QR code is expired
      if (QRCodeService.isExpired(qrData.expiresAt)) {
        setSecurityChecks(prev => ({ ...prev, expiration: false }))
        throw new Error('QR code has expired')
      }
      
      setSecurityChecks(prev => ({ ...prev, expiration: true }))
      
      // Update time remaining
      setTimeRemaining(QRCodeService.formatTimeRemaining(qrData.expiresAt))
      
      if (showValidation && studentId) {
        setIsValidating(true)
        
        // Validate QR code with backend
        const validationResult = await QRCodeService.validateQRCode({
          qr_token: qrData.token,
          student_id: studentId
        })
        
        setValidationResult(validationResult)
        setIsValidating(false)
        
        if (validationResult.success) {
          setSecurityChecks(prev => ({ ...prev, validation: true }))
          setSuccess(true)
          setActiveStep(3)
          setIsScanning(false)
          stopScanner()
          onScanSuccess?.(validationResult)
        } else {
          setSecurityChecks(prev => ({ ...prev, validation: false }))
          throw new Error(validationResult.message || 'Validation failed')
        }
      } else {
        // Just parse and return data without validation
        setSecurityChecks(prev => ({ ...prev, validation: true }))
        setSuccess(true)
        setActiveStep(3)
        setIsScanning(false)
        stopScanner()
        onScanSuccess?.(qrData)
      }
      
    } catch (error) {
      console.error('QR scan error:', error)
      setError(error.message)
      setIsValidating(false)
      onScanError?.(error)
    }
  }, [showValidation, studentId, onScanSuccess, onScanError])

  const handleClose = () => {
    stopScanner()
    setError(null)
    setSuccess(false)
    setScannedData(null)
    setValidationResult(null)
    setActiveStep(0)
    setSecurityChecks({
      cameraPermission: false,
      qrFormat: false,
      expiration: false,
      validation: false
    })
    onClose?.()
  }

  const handleRetry = () => {
    setError(null)
    setSuccess(false)
    setScannedData(null)
    setValidationResult(null)
    setActiveStep(0)
    setSecurityChecks({
      cameraPermission: false,
      qrFormat: false,
      expiration: false,
      validation: false
    })
    startScanner()
  }

  const SecurityCheckItem = ({ label, passed, icon: Icon }) => (
    <ListItem>
      <ListItemIcon>
        <Icon color={passed ? 'success' : 'error'} />
      </ListItemIcon>
      <ListItemText 
        primary={label}
        secondary={passed ? 'Passed' : 'Failed'}
      />
    </ListItem>
  )

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '600px' }
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <QrCodeIcon color="primary" />
            <Typography variant="h6">Secure QR Code Check-in</Typography>
          </Box>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stepper activeStep={activeStep} orientation="vertical">
          <Step>
            <StepLabel>Camera Access</StepLabel>
            <StepContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <CameraIcon color={securityChecks.cameraPermission ? 'success' : 'action'} />
                <Typography>
                  {securityChecks.cameraPermission ? 'Camera access granted' : 'Requesting camera access...'}
                </Typography>
              </Box>
              {!securityChecks.cameraPermission && (
                <CircularProgress size={20} />
              )}
            </StepContent>
          </Step>

          <Step>
            <StepLabel>QR Code Scan</StepLabel>
            <StepContent>
              <Box mb={2}>
                <Paper 
                  elevation={3} 
                  sx={{ 
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 2,
                    height: 300
                  }}
                >
                  <video
                    ref={videoRef}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  
                  {isScanning && (
                    <Box
                      position="absolute"
                      top="50%"
                      left="50%"
                      sx={{
                        transform: 'translate(-50%, -50%)',
                        background: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        padding: 2,
                        borderRadius: 1,
                        textAlign: 'center'
                      }}
                    >
                      <CameraIcon sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="body2">
                        Point camera at QR code
                      </Typography>
                      <Typography variant="caption" display="block">
                        Scans: {scanCount}
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Box>

              {scannedData && (
                <Card sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      QR Code Information
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <SchoolIcon />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Session" 
                          secondary={scannedData.sessionName}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <ScheduleIcon />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Time Remaining" 
                          secondary={timeRemaining}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              )}
            </StepContent>
          </Step>

          <Step>
            <StepLabel>Security Validation</StepLabel>
            <StepContent>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Security Checks
                  </Typography>
                  <List>
                    <SecurityCheckItem 
                      label="QR Format Valid" 
                      passed={securityChecks.qrFormat}
                      icon={VerifiedIcon}
                    />
                    <SecurityCheckItem 
                      label="Not Expired" 
                      passed={securityChecks.expiration}
                      icon={ScheduleIcon}
                    />
                    <SecurityCheckItem 
                      label="Backend Validation" 
                      passed={securityChecks.validation}
                      icon={SecurityIcon}
                    />
                  </List>
                </CardContent>
              </Card>

              {isValidating && (
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <CircularProgress size={20} />
                  <Typography>Validating with server...</Typography>
                </Box>
              )}
            </StepContent>
          </Step>

          <Step>
            <StepLabel>Check-in Complete</StepLabel>
            <StepContent>
              {success && validationResult && (
                <Card sx={{ mb: 2 }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
                      <Typography variant="h6" color="success.main">
                        Check-in Successful!
                      </Typography>
                    </Box>
                    
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <SchoolIcon />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Class" 
                          secondary={validationResult.sessionInfo?.class_name}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <ScheduleIcon />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Check-in Time" 
                          secondary={new Date(validationResult.checkInTime).toLocaleString()}
                        />
                      </ListItem>
                      {validationResult.isLate && (
                        <ListItem>
                          <ListItemIcon>
                            <WarningIcon color="warning" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Status" 
                            secondary="Late arrival"
                            secondaryTypographyProps={{ color: 'warning.main' }}
                          />
                        </ListItem>
                      )}
                    </List>
                  </CardContent>
                </Card>
              )}
            </StepContent>
          </Step>
        </Stepper>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Alert 
                severity="error" 
                sx={{ mt: 2 }}
                action={
                  <Button color="inherit" size="small" onClick={handleRetry}>
                    Retry
                  </Button>
                }
              >
                {error}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>
          Close
        </Button>
        {error && (
          <Button 
            onClick={handleRetry} 
            variant="contained"
            startIcon={<RefreshIcon />}
          >
            Retry
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default EnhancedQRCodeScanner
