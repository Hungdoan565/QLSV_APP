import React from 'react'
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Container,
  Alert,
  Stack
} from '@mui/material'
import { 
  ErrorOutline, 
  Refresh, 
  Home 
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback 
        error={this.state.error}
        resetError={() => this.setState({ hasError: false, error: null, errorInfo: null })}
      />
    }

    return this.props.children
  }
}

const ErrorFallback = ({ error, resetError }) => {
  const navigate = useNavigate()

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          textAlign: 'center',
          borderTop: '4px solid',
          borderColor: 'error.main'
        }}
      >
        <ErrorOutline 
          sx={{ 
            fontSize: 80, 
            color: 'error.main',
            mb: 2 
          }} 
        />
        
        <Typography variant="h4" component="h1" gutterBottom color="error">
          Oops! Đã xảy ra lỗi
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Xin lỗi, ứng dụng đã gặp phải một lỗi không mong muốn. 
          Vui lòng thử lại hoặc liên hệ với bộ phận hỗ trợ.
        </Typography>

        {error && process.env.NODE_ENV === 'development' && (
          <Alert severity="error" sx={{ textAlign: 'left', mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Chi tiết lỗi (Development Mode):
            </Typography>
            <Typography variant="body2" component="pre" sx={{ fontSize: '0.75rem' }}>
              {error.toString()}
            </Typography>
          </Alert>
        )}

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={resetError}
            color="primary"
          >
            Thử lại
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Home />}
            onClick={() => navigate('/dashboard')}
            color="primary"
          >
            Về trang chủ
          </Button>
        </Stack>
      </Paper>
    </Container>
  )
}

export default ErrorBoundary
