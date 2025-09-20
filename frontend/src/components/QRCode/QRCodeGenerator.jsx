import React, { useState, useEffect, useCallback } from 'react'
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip
} from '@mui/material'
import {
  QrCode as QrCodeIcon,
  Refresh as RefreshIcon,
  Security as SecurityIcon,
  Schedule as ScheduleIcon,
  School as SchoolIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Stop as StopIcon,
  PlayArrow as PlayArrowIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material'
import QRCodeService from '../../services/qrCodeService'
import { motion, AnimatePresence } from 'framer-motion'

const QRCodeGenerator = ({ session, onQRGenerated, onQRRevoked }) => {
  const [qrData, setQrData] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isRevoking, setIsRevoking] = useState(false)
  const [error, setError] = useState(null)
  const [qrStatus, setQrStatus] = useState(null)
  const [timeRemaining, setTimeRemaining] = useState(null)
  const [isActive, setIsActive] = useState(false)
  const [showQRDialog, setShowQRDialog] = useState(false)

  // Check QR status on component mount
  useEffect(() => {
    if (session?.id) {
      checkQRStatus()
    }
  }, [session?.id])

  // Update time remaining every second
  useEffect(() => {
    if (qrData?.expiresAt) {
      const interval = setInterval(() => {
        const remaining = QRCodeService.formatTimeRemaining(qrData.expiresAt)
        setTimeRemaining(remaining)
        
        if (QRCodeService.isExpired(qrData.expiresAt)) {
          setIsActive(false)
          clearInterval(interval)
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [qrData?.expiresAt])

  const checkQRStatus = useCallback(async () => {
    try {
      const status = await QRCodeService.getQRStatus(session.id)
      setQrStatus(status.qrStatus)
      setIsActive(status.qrStatus.active)
    } catch (error) {
      console.error('Failed to check QR status:', error)
    }
  }, [session?.id])

  const generateQRCode = useCallback(async () => {
    try {
      setIsGenerating(true)
      setError(null)

      const result = await QRCodeService.generateQRCode({
        session_id: session.id,
        session_name: session.session_name
      })

      setQrData(result)
      setIsActive(true)
      setShowQRDialog(true)
      onQRGenerated?.(result)

    } catch (error) {
      console.error('QR generation failed:', error)
      setError(error.message)
    } finally {
      setIsGenerating(false)
    }
  }, [session, onQRGenerated])

  const revokeQRCode = useCallback(async () => {
    try {
      setIsRevoking(true)
      setError(null)

      await QRCodeService.revokeQRCode(session.id)
      
      setQrData(null)
      setIsActive(false)
      setShowQRDialog(false)
      onQRRevoked?.()

    } catch (error) {
      console.error('QR revocation failed:', error)
      setError(error.message)
    } finally {
      setIsRevoking(false)
    }
  }, [session?.id, onQRRevoked])

  const downloadQRCode = () => {
    if (qrData?.qrCode) {
      const link = document.createElement('a')
      link.href = `data:image/png;base64,${qrData.qrCode}`
      link.download = `qr-code-session-${session.id}.png`
      link.click()
    }
  }

  const shareQRCode = async () => {
    if (qrData?.qrCode && navigator.share) {
      try {
        const blob = await fetch(`data:image/png;base64,${qrData.qrCode}`)
          .then(res => res.blob())
        
        const file = new File([blob], `qr-code-session-${session.id}.png`, {
          type: 'image/png'
        })

        await navigator.share({
          title: `QR Code for ${session.session_name}`,
          text: `Attendance QR Code for ${session.session_name}`,
          files: [file]
        })
      } catch (error) {
        console.error('Share failed:', error)
      }
    }
  }

  const getStatusColor = () => {
    if (!isActive) return 'default'
    if (timeRemaining === 'Expired') return 'error'
    if (timeRemaining && timeRemaining.includes('s')) return 'warning'
    return 'success'
  }

  const getStatusIcon = () => {
    if (!isActive) return <StopIcon />
    if (timeRemaining === 'Expired') return <WarningIcon />
    return <CheckCircleIcon />
  }

  return (
    <>
      <Card elevation={2}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h6" component="h2">
              QR Code Attendance
            </Typography>
            <Chip
              icon={getStatusIcon()}
              label={isActive ? 'Active' : 'Inactive'}
              color={getStatusColor()}
              size="small"
            />
          </Box>

          {session && (
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <SchoolIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Session" 
                  secondary={session.session_name}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ScheduleIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Time" 
                  secondary={`${session.start_time} - ${session.end_time}`}
                />
              </ListItem>
              {isActive && timeRemaining && (
                <ListItem>
                  <ListItemIcon>
                    <SecurityIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Expires in" 
                    secondary={timeRemaining}
                  />
                </ListItem>
              )}
            </List>
          )}

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {isActive && timeRemaining && timeRemaining !== 'Expired' && (
            <Box mt={2}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Time Remaining
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={100 - (parseInt(timeRemaining) / 30) * 100}
                color={timeRemaining.includes('s') ? 'warning' : 'primary'}
              />
            </Box>
          )}
        </CardContent>

        <CardActions>
          {!isActive ? (
            <Button
              variant="contained"
              startIcon={<QrCodeIcon />}
              onClick={generateQRCode}
              disabled={isGenerating}
              fullWidth
            >
              {isGenerating ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Generating...
                </>
              ) : (
                'Generate QR Code'
              )}
            </Button>
          ) : (
            <Box display="flex" gap={1} width="100%">
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={generateQRCode}
                disabled={isGenerating}
                size="small"
              >
                Refresh
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<StopIcon />}
                onClick={revokeQRCode}
                disabled={isRevoking}
                size="small"
              >
                Revoke
              </Button>
            </Box>
          )}
        </CardActions>
      </Card>

      {/* QR Code Display Dialog */}
      <Dialog
        open={showQRDialog}
        onClose={() => setShowQRDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">
              QR Code for {session?.session_name}
            </Typography>
            <IconButton onClick={() => setShowQRDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          {qrData && (
            <Box textAlign="center">
              <Box
                component="img"
                src={`data:image/png;base64,${qrData.qrCode}`}
                alt="QR Code"
                sx={{
                  maxWidth: '100%',
                  height: 'auto',
                  border: '1px solid #ddd',
                  borderRadius: 1,
                  mb: 2
                }}
              />

              <Typography variant="body2" color="text.secondary" gutterBottom>
                Students can scan this QR code to check in
              </Typography>

              {timeRemaining && (
                <Chip
                  icon={<ScheduleIcon />}
                  label={`Expires in ${timeRemaining}`}
                  color={timeRemaining === 'Expired' ? 'error' : 'primary'}
                  sx={{ mt: 1 }}
                />
              )}

              <Divider sx={{ my: 2 }} />

              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <SchoolIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Class" 
                    secondary={qrData.sessionInfo?.class_name}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <ScheduleIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Session Time" 
                    secondary={`${qrData.sessionInfo?.start_time} - ${qrData.sessionInfo?.end_time}`}
                  />
                </ListItem>
                {qrData.sessionInfo?.location && (
                  <ListItem>
                    <ListItemIcon>
                      <LocationIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Location" 
                      secondary={qrData.sessionInfo.location}
                    />
                  </ListItem>
                )}
              </List>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setShowQRDialog(false)}>
            Close
          </Button>
          <Tooltip title="Download QR Code">
            <IconButton onClick={downloadQRCode} color="primary">
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Share QR Code">
            <IconButton onClick={shareQRCode} color="primary">
              <ShareIcon />
            </IconButton>
          </Tooltip>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default QRCodeGenerator