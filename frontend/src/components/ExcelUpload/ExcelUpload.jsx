import React, { useState, useRef } from 'react'
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
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip
} from '@mui/material'
import {
  Upload as UploadIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Description as FileIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material'
import { motion } from 'framer-motion'

const ExcelUpload = ({ 
  open, 
  onClose, 
  onUploadSuccess, 
  uploadEndpoint,
  acceptedTypes = ['.xlsx', '.xls'],
  maxFileSize = 5 * 1024 * 1024 // 5MB
}) => {
  const fileInputRef = useRef(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [uploadResult, setUploadResult] = useState(null)

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      validateFile(file)
    }
  }

  const validateFile = (file) => {
    setError(null)
    
    // Check file type
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
    if (!acceptedTypes.includes(fileExtension)) {
      setError(`Chỉ chấp nhận file Excel (.xlsx, .xls)`)
      return
    }
    
    // Check file size
    if (file.size > maxFileSize) {
      setError(`File quá lớn. Kích thước tối đa: ${Math.round(maxFileSize / 1024 / 1024)}MB`)
      return
    }
    
    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile || !uploadEndpoint) return
    
    try {
      setUploading(true)
      setError(null)
      setUploadProgress(0)
      
      const formData = new FormData()
      formData.append('file', selectedFile)
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)
      
      // Make API call
      const response = await fetch(uploadEndpoint, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      
      clearInterval(progressInterval)
      setUploadProgress(100)
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }
      
      const result = await response.json()
      setUploadResult(result)
      setSuccess(true)
      
      if (onUploadSuccess) {
        onUploadSuccess(result)
      }
      
    } catch (err) {
      console.error('Upload error:', err)
      setError(err.message || 'Lỗi upload file')
    } finally {
      setUploading(false)
    }
  }

  const handleClose = () => {
    setSelectedFile(null)
    setUploading(false)
    setUploadProgress(0)
    setError(null)
    setSuccess(false)
    setUploadResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onClose()
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      validateFile(files[0])
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <UploadIcon />
            <Typography variant="h6">Upload File Excel</Typography>
          </Box>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success ? (
          <Box textAlign="center">
            <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            <Alert severity="success" sx={{ mb: 2 }}>
              Upload thành công!
            </Alert>
            
            {uploadResult && (
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="h6" gutterBottom>
                  Kết quả upload:
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Tổng số dòng" 
                      secondary={uploadResult.total_rows || 'N/A'} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Dòng thành công" 
                      secondary={uploadResult.success_rows || 'N/A'} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Dòng lỗi" 
                      secondary={uploadResult.error_rows || 'N/A'} 
                    />
                  </ListItem>
                </List>
              </Paper>
            )}
          </Box>
        ) : (
          <Box>
            {/* Upload Area */}
            <Paper
              sx={{
                p: 4,
                textAlign: 'center',
                border: '2px dashed',
                borderColor: selectedFile ? 'primary.main' : 'grey.300',
                bgcolor: selectedFile ? 'primary.light' : 'grey.50',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'primary.light'
                }
              }}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={acceptedTypes.join(',')}
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              
              <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                {selectedFile ? 'File đã chọn' : 'Kéo thả file Excel vào đây'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                hoặc click để chọn file
              </Typography>
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Chấp nhận: {acceptedTypes.join(', ')} (Tối đa {Math.round(maxFileSize / 1024 / 1024)}MB)
              </Typography>
            </Paper>

            {/* Selected File Info */}
            {selectedFile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Paper sx={{ p: 2, mt: 2, bgcolor: 'grey.50' }}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <FileIcon color="primary" />
                    <Box flex={1}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {selectedFile.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatFileSize(selectedFile.size)}
                      </Typography>
                    </Box>
                    <Chip 
                      label="Sẵn sàng upload" 
                      color="success" 
                      size="small" 
                    />
                  </Box>
                </Paper>
              </motion.div>
            )}

            {/* Upload Progress */}
            {uploading && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Đang upload... {uploadProgress}%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={uploadProgress} 
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>
          {success ? 'Đóng' : 'Hủy'}
        </Button>
        {selectedFile && !uploading && !success && (
          <Button 
            variant="contained" 
            onClick={handleUpload}
            startIcon={<UploadIcon />}
            disabled={!selectedFile}
          >
            Upload File
          </Button>
        )}
        {uploading && (
          <Button 
            variant="contained" 
            disabled
            startIcon={<CircularProgress size={20} />}
          >
            Đang upload...
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default ExcelUpload
