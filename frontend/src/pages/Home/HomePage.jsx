import React from 'react'
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  useTheme,
} from '@mui/material'
import {
  School,
  People,
  Assessment,
  QrCodeScanner,
  Login,
  PersonAdd,
} from '@mui/icons-material'
import { Link } from 'react-router-dom'

const HomePage = () => {
  const theme = useTheme()

  const features = [
    {
      icon: <People />,
      title: 'Quản lý Sinh viên',
      description: 'Quản lý thông tin sinh viên một cách hiệu quả'
    },
    {
      icon: <School />,
      title: 'Quản lý Lớp học',
      description: 'Tổ chức và quản lý các lớp học'
    },
    {
      icon: <Assessment />,
      title: 'Quản lý Điểm số',
      description: 'Theo dõi và quản lý điểm số sinh viên'
    },
    {
      icon: <QrCodeScanner />,
      title: 'Điểm danh QR',
      description: 'Điểm danh thông minh với công nghệ QR code'
    }
  ]

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <School sx={{ fontSize: 64, mb: 2 }} />
            <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>
              EduAttend
            </Typography>
            <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
              Hệ thống Quản lý Sinh viên Thông minh
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                component={Link}
                to="/login"
                variant="contained"
                size="large"
                startIcon={<Login />}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'grey.100',
                  },
                }}
              >
                Đăng nhập
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="outlined"
                size="large"
                startIcon={<PersonAdd />}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                Đăng ký
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom fontWeight="bold">
          Tính năng nổi bật
        </Typography>
        <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
          Hệ thống quản lý sinh viên toàn diện với công nghệ hiện đại
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      p: 2,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      color: 'white',
                      mb: 2,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          bgcolor: 'grey.100',
          py: 4,
          mt: 8,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" textAlign="center">
            © 2024 EduAttend - Hệ thống Quản lý Sinh viên. Tất cả quyền được bảo lưu.
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}

export default HomePage
