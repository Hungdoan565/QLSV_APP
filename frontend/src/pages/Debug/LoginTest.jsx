import React, { useState } from 'react'
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Stack,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { login } from '../../store/slices/authSlice'
import AuthUtils from '../../utils/authUtils'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

const LoginTest = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, isLoading, error } = useSelector((state) => state.auth)
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [message, setMessage] = useState('')
  const [testResults, setTestResults] = useState([])
  const [debugLogs, setDebugLogs] = useState([])

  const testCredentials = [
    { role: 'Admin', email: 'admin@test.com', password: 'Admin123456' },
    { role: 'Teacher', email: 'teacher@test.com', password: 'Teacher123456' },
    { role: 'Student', email: 'student@test.com', password: 'Student123456' }
  ]

  const addDebugLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString()
    setDebugLogs(prev => [...prev, { timestamp, message, type }])
    console.log(`[${timestamp}] ${message}`)
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setMessage('')
    addDebugLog(`Attempting login with email: ${formData.email}`, 'info')
    
    try {
      addDebugLog('Dispatching login action...', 'info')
      const result = await dispatch(login({
        email: formData.email,
        password: formData.password
      })).unwrap()
      
      addDebugLog(`Login successful! User: ${JSON.stringify(result.user)}`, 'success')
      setMessage(`✅ Đăng nhập thành công! Role: ${result.user.role}`)
      
      // Test dashboard redirect
      const dashboardPath = AuthUtils.getDashboardPath(result.user)
      addDebugLog(`Redirecting to dashboard: ${dashboardPath}`, 'info')
      setMessage(prev => prev + ` - Redirecting to: ${dashboardPath}`)
      
      setTimeout(() => {
        navigate(dashboardPath)
      }, 2000)
      
    } catch (error) {
      addDebugLog(`Login failed: ${JSON.stringify(error)}`, 'error')
      setMessage(`❌ Lỗi: ${error.message || error.error?.message || 'Unknown error'}`)
    }
  }

  const testAllCredentials = async () => {
    const results = []
    addDebugLog('Starting batch login test...', 'info')
    
    for (const cred of testCredentials) {
      try {
        addDebugLog(`Testing ${cred.role} login...`, 'info')
        const result = await dispatch(login({
          email: cred.email,
          password: cred.password
        })).unwrap()
        
        results.push({
          role: cred.role,
          email: cred.email,
          status: '✅ Success',
          user: result.user,
          dashboardPath: AuthUtils.getDashboardPath(result.user)
        })
        addDebugLog(`${cred.role} login successful`, 'success')
      } catch (error) {
        results.push({
          role: cred.role,
          email: cred.email,
          status: `❌ Failed: ${error.message || error.error?.message}`,
          user: null,
          dashboardPath: null
        })
        addDebugLog(`${cred.role} login failed: ${error.message}`, 'error')
      }
    }
    
    setTestResults(results)
    addDebugLog('Batch login test completed', 'info')
  }

  const testBackendConnection = async () => {
    try {
      addDebugLog('Testing backend connection...', 'info')
      const response = await fetch('http://localhost:8000/api/auth/health/')
      if (response.ok) {
        const data = await response.text()
        addDebugLog(`Backend is running: ${data}`, 'success')
      } else {
        addDebugLog(`Backend responded with status: ${response.status}`, 'warning')
      }
    } catch (error) {
      addDebugLog(`Backend connection failed: ${error.message}`, 'error')
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          🔐 Authentication Debug Center
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Senior-level debugging tool for authentication system
        </Typography>

        {/* Backend Connection Test */}
        <Box sx={{ mb: 3 }}>
          <Button
            variant="outlined"
            onClick={testBackendConnection}
            sx={{ mb: 2 }}
          >
            Test Backend Connection
          </Button>
        </Box>

        {/* Current User Info */}
        {user && (
          <Alert severity="success" sx={{ mb: 3 }}>
            <Typography variant="h6">Current User:</Typography>
            <Typography>Name: {user.first_name} {user.last_name}</Typography>
            <Typography>Email: {user.email}</Typography>
            <Typography>Role: {user.role}</Typography>
            <Typography>Status: {user.account_status}</Typography>
          </Alert>
        )}

        {/* Manual Login Form */}
        <Box component="form" onSubmit={handleLogin} sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Manual Login Test
          </Typography>
          
          <Stack spacing={2}>
            <TextField
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              name="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : null}
              fullWidth
            >
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
          </Stack>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Quick Test Buttons */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Quick Test với Test Users
          </Typography>
          
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            {testCredentials.map((cred, index) => (
              <Button
                key={index}
                variant="outlined"
                onClick={() => {
                  setFormData({ email: cred.email, password: cred.password })
                }}
                sx={{ flex: 1 }}
              >
                {cred.role}
              </Button>
            ))}
          </Stack>
          
          <Button
            variant="contained"
            onClick={testAllCredentials}
            fullWidth
            sx={{ mb: 2 }}
          >
            Test All Credentials
          </Button>
        </Box>

        {/* Test Results */}
        {testResults.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Test Results:
            </Typography>
            {testResults.map((result, index) => (
              <Alert 
                key={index} 
                severity={result.status.includes('✅') ? 'success' : 'error'}
                sx={{ mb: 1 }}
              >
                <Typography variant="body2">
                  <strong>{result.role}:</strong> {result.email} - {result.status}
                </Typography>
                {result.dashboardPath && (
                  <Typography variant="caption" display="block">
                    Dashboard: {result.dashboardPath}
                  </Typography>
                )}
              </Alert>
            ))}
          </Box>
        )}

        {/* Debug Logs */}
        <Accordion sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Debug Logs ({debugLogs.length})</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
              {debugLogs.map((log, index) => (
                <Typography
                  key={index}
                  variant="body2"
                  color={log.type === 'error' ? 'error.main' : log.type === 'success' ? 'success.main' : 'text.secondary'}
                  sx={{ mb: 0.5, fontFamily: 'monospace' }}
                >
                  [{log.timestamp}] {log.message}
                </Typography>
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Messages */}
        {message && (
          <Alert severity={message.includes('✅') ? 'success' : 'error'} sx={{ mt: 2 }}>
            {message}
          </Alert>
        )}

        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {JSON.stringify(error)}
          </Alert>
        )}
      </Paper>
    </Container>
  )
}

export default LoginTest