import React, { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  alpha,
} from '@mui/material'
import QRCode from 'qrcode'

const QRCodeScanner = () => {
  const [qrCodeDataURL, setQrCodeDataURL] = useState('')

  useEffect(() => {
    // Generate a real QR code with actual data
    const generateRealQRCode = async () => {
      try {
        const qrData = 'EduAttend:session_12345_attendance'
        const dataURL = await QRCode.toDataURL(qrData, {
          width: 120,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        })
        setQrCodeDataURL(dataURL)
      } catch (error) {
        console.error('Error generating QR code:', error)
        // Fallback to a simple pattern if QR generation fails
        setQrCodeDataURL(generateFallbackQR())
      }
    }

    generateRealQRCode()
  }, [])

  // Fallback QR generation if library fails
  const generateFallbackQR = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = 120
    canvas.height = 120
    
    // White background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, 120, 120)
    
    // Black modules
    ctx.fillStyle = '#000000'
    const moduleSize = 4
    const modules = 25
    
    // Create a more realistic QR pattern
    const qrPattern = [
      [1,1,1,1,1,1,1,0,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0,1],
      [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1,1,1,0,1],
      [1,0,1,1,1,0,1,0,0,1,0,1,0,0,1,0,1,1,1,0,1,1,1,0,1],
      [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1,1,1,0,1],
      [1,0,0,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1],
      [0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [1,1,0,1,0,1,1,1,0,1,0,1,0,1,1,0,1,0,1,1,0,1,0,1,1],
      [0,1,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
      [1,0,1,0,1,0,1,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
      [0,1,0,1,0,1,0,1,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
      [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
      [0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0,1],
      [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1,1,1,0,1],
      [1,0,1,1,1,0,1,0,0,1,0,1,0,0,1,0,1,1,1,0,1,1,1,0,1],
      [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1,1,1,0,1],
      [1,0,0,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1],
      [0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [1,1,0,1,0,1,1,1,0,1,0,1,0,1,1,0,1,0,1,1,0,1,0,1,1],
      [0,1,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
      [1,0,1,0,1,0,1,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0]
    ]
    
    // Draw the QR pattern
    for (let i = 0; i < modules; i++) {
      for (let j = 0; j < modules; j++) {
        if (qrPattern[i] && qrPattern[i][j] === 1) {
          ctx.fillRect(j * moduleSize, i * moduleSize, moduleSize, moduleSize)
        }
      }
    }
    
    return canvas.toDataURL()
  }

  return (
    <Box sx={{ 
      position: 'relative', 
      display: 'flex', 
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      minHeight: 400
    }}>
      {/* Compact QR Scanner */}
      <Paper
        elevation={12}
        sx={{
          p: 3,
          borderRadius: 4,
          bgcolor: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
          border: '2px solid rgba(255,255,255,0.3)',
          width: 240,
          height: 320,
          position: 'relative',
          animation: 'gentleFloat 4s ease-in-out infinite',
          '@keyframes gentleFloat': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-8px)' },
          },
        }}
      >
        <Typography variant="h6" fontWeight="bold" color="#6366f1" gutterBottom sx={{ textAlign: 'center' }}>
          📱 QR Scanner
        </Typography>
        
        {/* QR Code Scanner Area - Compact */}
        <Box sx={{ 
          position: 'relative',
          width: '100%',
          height: 160,
          bgcolor: '#000',
          borderRadius: 2,
          overflow: 'hidden',
          mb: 2,
          border: '2px solid #6366f1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Real QR Code */}
          <Box sx={{
            position: 'relative',
            width: 100,
            height: 100,
            bgcolor: '#fff',
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            {qrCodeDataURL ? (
              <img 
                src={qrCodeDataURL} 
                alt="QR Code for EduAttend attendance" 
                style={{ 
                  width: '100%', 
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
            ) : (
              <Box sx={{
                width: '100%',
                height: '100%',
                bgcolor: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#666'
              }}>
                Loading QR...
              </Box>
            )}
          </Box>

          {/* Scanning Line - More subtle */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              background: 'linear-gradient(90deg, transparent 0%, #00ff00 50%, transparent 100%)',
              animation: 'scanLine 3s ease-in-out infinite',
              '@keyframes scanLine': {
                '0%': { transform: 'translateY(0px)', opacity: 0.8 },
                '50%': { transform: 'translateY(80px)', opacity: 1 },
                '100%': { transform: 'translateY(158px)', opacity: 0.8 },
              },
            }}
          />

          {/* Subtle Corner Indicators */}
          <Box sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            width: 16,
            height: 16,
            border: '2px solid #00ff00',
            borderRight: 'none',
            borderBottom: 'none',
            opacity: 0.7
          }} />
          <Box sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 16,
            height: 16,
            border: '2px solid #00ff00',
            borderLeft: 'none',
            borderBottom: 'none',
            opacity: 0.7
          }} />
          <Box sx={{
            position: 'absolute',
            bottom: 8,
            left: 8,
            width: 16,
            height: 16,
            border: '2px solid #00ff00',
            borderRight: 'none',
            borderTop: 'none',
            opacity: 0.7
          }} />
          <Box sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            width: 16,
            height: 16,
            border: '2px solid #00ff00',
            borderLeft: 'none',
            borderTop: 'none',
            opacity: 0.7
          }} />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
          Quét QR → Điểm danh tự động
        </Typography>
        
        <Box sx={{ 
          bgcolor: '#f0f9ff', 
          p: 1.5, 
          borderRadius: 2, 
          border: '1px solid #e0f2fe',
          textAlign: 'center'
        }}>
          <Typography variant="caption" color="#0369a1" sx={{ fontWeight: 600 }}>
            ✅ 25/30 sinh viên đã điểm danh
          </Typography>
        </Box>
      </Paper>
    </Box>
  )
}

export default QRCodeScanner