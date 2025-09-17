import React from 'react'
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  useTheme,
  useMediaQuery,
  Chip,
  Paper,
  Avatar,
  Rating,
  Divider,
  Stack,
  alpha,
} from '@mui/material'
import { motion } from 'framer-motion'
import {
  Dashboard,
  People,
  Class,
  EventAvailable,
  Assessment,
  Security,
  Speed,
  Support,
  QrCodeScanner,
  BarChart,
  AccessTime,
  CheckCircle,
  School,
  TrendingUp,
  CloudDone,
  PhoneIphone, // Thay cho Mobile
  ArrowForward,
  PlayArrow,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Helmet } from 'react-helmet-async'
import Navbar from '../../components/Layout/Navbar';

// Feature Card Component
const FeatureCard = ({ icon, title, description, delay = 0, color = 'primary' }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: true }}
    whileHover={{ y: -8 }}
  >
    <Card 
      elevation={0}
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        p: 3,
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: `${color}.main`,
          boxShadow: (theme) => `0 8px 40px ${alpha(theme.palette[color].main, 0.12)}`,
          '& .feature-icon': {
            transform: 'scale(1.1)',
            color: `${color}.main`,
          }
        }
      }}
    >
      <Box 
        className="feature-icon"
        sx={{ 
          width: 64, 
          height: 64,
          borderRadius: 2,
          bgcolor: alpha(color === 'primary' ? '#2563eb' : '#059669', 0.08),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
          transition: 'all 0.3s ease',
          color: color === 'primary' ? '#2563eb' : '#059669'
        }}
      >
        {React.cloneElement(icon, { sx: { fontSize: 32 } })}
      </Box>
      <Typography variant="h6" component="h3" fontWeight={600} gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
        {description}
      </Typography>
    </Card>
  </motion.div>
)

// Testimonial Card Component
const TestimonialCard = ({ avatar, name, role, school, rating, comment, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: true }}
  >
    <Card 
      elevation={0}
      sx={{ 
        p: 3, 
        height: '100%',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        '&:hover': {
          boxShadow: (theme) => theme.shadows[4],
        }
      }}
    >
      <Stack spacing={2}>
        <Rating value={rating} readOnly size="small" />
        <Typography variant="body2" color="text.secondary" fontStyle="italic" lineHeight={1.6}>
          "{comment}"
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar src={avatar} alt={name} sx={{ width: 40, height: 40 }} />
          <Box>
            <Typography variant="subtitle2" fontWeight={600}>
              {name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {role} • {school}
            </Typography>
          </Box>
        </Box>
      </Stack>
    </Card>
  </motion.div>
)

// Benefit Card Component  
const BenefitCard = ({ icon, title, description, stats }) => (
  <Box sx={{ textAlign: 'center' }}>
    <Box 
      sx={{ 
        width: 80, 
        height: 80,
        borderRadius: '50%',
        bgcolor: alpha('#059669', 0.08),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mx: 'auto',
        mb: 2,
        color: '#059669'
      }}
    >
      {React.cloneElement(icon, { sx: { fontSize: 36 } })}
    </Box>
    <Typography variant="h4" fontWeight={700} color="primary.main" gutterBottom>
      {stats}
    </Typography>
    <Typography variant="h6" fontWeight={600} gutterBottom>
      {title}
    </Typography>
    <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
      {description}
    </Typography>
  </Box>
)

const HomePage = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector((state) => state.auth)

  // Core Features
  const features = [
    {
      icon: <QrCodeScanner />,
      title: 'Điểm danh QR Code',
      description: 'Sinh viên quét QR Code để điểm danh nhanh chóng, chính xác. Giáo viên theo dõi real-time và xuất báo cáo tự động.',
      color: 'primary'
    },
    {
      icon: <BarChart />,
      title: 'Báo cáo & Thống kê',
      description: 'Dashboard trực quan với biểu đồ phân tích tỷ lệ tham dự, xu hướng học tập và cảnh báo sinh viên vắng nhiều.',
      color: 'secondary'
    },
    {
      icon: <People />,
      title: 'Quản lý Sinh viên',
      description: 'Quản lý thông tin sinh viên toàn diện: hồ sơ, lịch sử học tập, kết quả điểm danh theo từng môn học.',
      color: 'primary'
    },
    {
      icon: <Class />,
      title: 'Quản lý Lớp học',
      description: 'Tạo lớp, phân công giảng viên, thiết lập thời khóa biểu và theo dõi tiến độ giảng dạy một cách hiệu quả.',
      color: 'secondary'
    },
    {
      icon: <PhoneIphone />, // Thay Mobile bằng PhoneIphone
      title: 'Mobile Friendly',
      description: 'Giao diện responsive hoàn hảo trên mọi thiết bị. Giáo viên và sinh viên có thể sử dụng mọi lúc, mọi nơi.',
      color: 'primary'
    },
    {
      icon: <CloudDone />,
      title: 'Cloud & Bảo mật',
      description: 'Dữ liệu được lưu trữ cloud an toàn với mã hóa end-to-end. Sao lưu tự động và khôi phục dễ dàng.',
      color: 'secondary'
    }
  ]

  // Benefits & Stats
  const benefits = [
    {
      icon: <AccessTime />,
      title: 'Tiết kiệm thời gian',
      description: 'Giảm 80% thời gian điểm danh thủ công. Giáo viên có thể tập trung vào giảng dạy thay vì hành chính.',
      stats: '80%'
    },
    {
      icon: <CheckCircle />,
      title: 'Độ chính xác cao',
      description: 'Loại bỏ hoàn toàn sai sót trong điểm danh. Dữ liệu được đồng bộ real-time và backup tự động.',
      stats: '99.9%'
    },
    {
      icon: <TrendingUp />,
      title: 'Tăng hiệu quả',
      description: 'Cải thiện tỷ lệ tham dự lớp học. Sinh viên chủ động hơn khi có hệ thống theo dõi minh bạch.',
      stats: '65%'
    }
  ]

  // Testimonials
  const testimonials = [
    {
      avatar: '/api/placeholder/40/40',
      name: 'TS. Nguyễn Minh Hoa',
      role: 'Trưởng khoa CNTT',
      school: 'ĐH Bách Khoa HN',
      rating: 5,
      comment: 'Hệ thống này đã thay đổi hoàn toàn cách chúng tôi quản lý điểm danh. Tiết kiệm rất nhiều thời gian và công sức cho giảng viên.'
    },
    {
      avatar: '/api/placeholder/40/40',
      name: 'ThS. Lê Văn Minh',
      role: 'Giảng viên',
      school: 'ĐH Công Nghệ',
      rating: 5,
      comment: 'Giao diện thân thiện, dễ sử dụng. Sinh viên rất thích tính năng QR Code và tôi có thể theo dõi tham dự real-time.'
    },
    {
      avatar: '/api/placeholder/40/40',
      name: 'PGS. Trần Thị Lan',
      role: 'Phó Hiệu trưởng',
      school: 'ĐH Kinh tế Quốc dân',
      rating: 5,
      comment: 'Báo cáo thống kê rất chi tiết, giúp nhà trường có cái nhìn tổng quan về tình hình học tập của sinh viên.'
    }
  ]

  const tags = [
    { label: 'Miễn phí', color: 'success' },
    { label: 'Dễ sử dụng', color: 'info' },
    { label: 'Bảo mật cao', color: 'warning' },
    { label: 'Hỗ trợ 24/7', color: 'error' }
  ]
  return (
    <>
      <Helmet>
        <title>EduAttend - Hệ thống Điểm danh Thông minh cho Giáo dục</title>
        <meta 
          name="description" 
          content="Đơn giản hóa việc quản lý điểm danh với công nghệ QR Code hiện đại. Tiết kiệm thời gian, tăng độ chính xác và cải thiện trải nghiệm giảng dạy." 
        />
        <meta name="keywords" content="điểm danh sinh viên, quản lý lớp học, QR code, giáo dục, trường đại học" />
      </Helmet>
      <Navbar />
      <Box sx={{ bgcolor: 'background.default' }}>
        {/* Hero Section - Modern Education Focus */}
        <Box 
          sx={{ 
            background: `linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)`,
            pt: { xs: 8, md: 12 }, 
            pb: { xs: 8, md: 12 },
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              width: '50%',
              height: '100%',
              background: `linear-gradient(135deg, ${alpha('#2563eb', 0.05)} 0%, ${alpha('#059669', 0.05)} 100%)`,
              borderRadius: '0 0 0 50%'
            }
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  {/* Trust Badge */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <School sx={{ color: '#059669', fontSize: 20 }} />
                    <Typography variant="body2" fontWeight={600} color="#059669">
                      Được tin dùng bởi 500+ trường học
                    </Typography>
                  </Box>

                  <Typography
                    variant={isMobile ? 'h3' : 'h2'}
                    component="h1"
                    fontWeight={700}
                    sx={{ 
                      color: '#1e293b',
                      lineHeight: 1.2,
                      mb: 3
                    }}
                  >
                    Đơn giản hóa{' '}
                    <Box component="span" sx={{ color: '#2563eb' }}>
                      Điểm danh
                    </Box>
                    <br />
                    Nâng cao{' '}
                    <Box component="span" sx={{ color: '#059669' }}>
                      Hiệu quả Giảng dạy
                    </Box>
                  </Typography>
                  
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#64748b',
                      lineHeight: 1.6,
                      mb: 4,
                      fontWeight: 400
                    }}
                  >
                    Hệ thống điểm danh QR Code hiện đại giúp giáo viên tiết kiệm thời gian,
                    sinh viên tham gia dễ dàng và nhà trường theo dõi hiệu quả.
                  </Typography>

                  {/* Tags */}
                  <Box sx={{ mb: 4 }}>
                    {tags.map((tag, index) => (
                      <motion.span
                        key={tag.label}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                      >
                        <Chip
                          label={tag.label}
                          color={tag.color}
                          variant="outlined"
                          sx={{ 
                            mr: 1, 
                            mb: 1,
                            fontWeight: 500,
                            '&:hover': {
                              bgcolor: alpha(theme.palette[tag.color].main, 0.08)
                            }
                          }}
                        />
                      </motion.span>
                    ))}
                  </Box>

                  {/* CTA Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                  >
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
                        endIcon={<ArrowForward />}
                        sx={{
                          bgcolor: '#2563eb',
                          px: 4,
                          py: 1.5,
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          borderRadius: 2,
                          textTransform: 'none',
                          boxShadow: `0 4px 14px ${alpha('#2563eb', 0.3)}`,
                          '&:hover': {
                            bgcolor: '#1d4ed8',
                            transform: 'translateY(-2px)',
                            boxShadow: `0 6px 20px ${alpha('#2563eb', 0.4)}`,
                          }
                        }}
                      >
                        {isAuthenticated ? 'Vào Hệ thống' : 'Bắt đầu Miễn phí'}
                      </Button>
                      
                      {!isAuthenticated && (
                        <Button
                          variant="outlined"
                          size="large"
                          startIcon={<PlayArrow />}
                          sx={{
                            borderColor: '#64748b',
                            color: '#64748b',
                            px: 4,
                            py: 1.5,
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            borderRadius: 2,
                            textTransform: 'none',
                            '&:hover': {
                              borderColor: '#2563eb',
                              color: '#2563eb',
                              bgcolor: alpha('#2563eb', 0.05),
                            }
                          }}
                        >
                          Xem Demo
                        </Button>
                      )}
                    </Stack>
                  </motion.div>
                </motion.div>
              </Grid>

              {/* Hero Visual */}
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      borderRadius: 4,
                      bgcolor: 'white',
                      border: '1px solid',
                      borderColor: 'divider',
                      position: 'relative',
                    }}
                  >
                    {/* Mock QR Scanner Interface */}
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        Điểm danh nhanh chóng
                      </Typography>
                      <Box 
                        sx={{ 
                          width: 200, 
                          height: 200, 
                          mx: 'auto',
                          border: '3px solid #2563eb',
                          borderRadius: 3,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: alpha('#2563eb', 0.05),
                          position: 'relative'
                        }}
                      >
                        <QrCodeScanner sx={{ fontSize: 80, color: '#2563eb' }} />
                        
                        {/* Scanning Animation */}
                        <motion.div
                          animate={{ y: [-20, 20, -20] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          style={{
                            position: 'absolute',
                            width: '90%',
                            height: 2,
                            backgroundColor: '#059669',
                            borderRadius: 1
                          }}
                        />
                      </Box>
                      
                      <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 2 }}>
                        <CheckCircle sx={{ color: '#059669', fontSize: 20 }} />
                        <Typography variant="body2" color="#059669" fontWeight={600}>
                          Điểm danh thành công!
                        </Typography>
                      </Stack>
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Benefits Section */}
        <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'white' }}>
          <Container maxWidth="lg">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Typography
                variant="h3"
                component="h2"
                textAlign="center"
                fontWeight={700}
                color="#1e293b"
                gutterBottom
              >
                Tại sao chọn EduAttend?
              </Typography>
              <Typography
                variant="h6"
                textAlign="center"
                color="#64748b"
                sx={{ mb: 8, maxWidth: 600, mx: 'auto', fontWeight: 400, lineHeight: 1.6 }}
              >
                Được thiết kế đặc biệt cho môi trường giáo dục Việt Nam
              </Typography>
            </motion.div>

            <Grid container spacing={6}>
              {benefits.map((benefit, index) => (
                <Grid item xs={12} md={4} key={benefit.title}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: true }}
                  >
                    <BenefitCard
                      icon={benefit.icon}
                      title={benefit.title}
                      description={benefit.description}
                      stats={benefit.stats}
                    />
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Features Section */}
        <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#f8fafc' }}>
          <Container maxWidth="lg">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Typography
                variant="h3"
                component="h2"
                textAlign="center"
                fontWeight={700}
                color="#1e293b"
                gutterBottom
              >
                Tính năng Đầy đủ & Hiện đại
              </Typography>
              <Typography
                variant="h6"
                textAlign="center"
                color="#64748b"
                sx={{ mb: 8, maxWidth: 700, mx: 'auto', fontWeight: 400, lineHeight: 1.6 }}
              >
                Từ điểm danh QR Code đến báo cáo thống kê chi tiết, 
                mọi thứ bạn cần cho việc quản lý lớp học hiệu quả
              </Typography>
            </motion.div>

            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={4} key={feature.title}>
                  <FeatureCard
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    color={feature.color}
                    delay={index * 0.1}
                  />
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Testimonials Section */}
        <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'white' }}>
          <Container maxWidth="lg">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Typography
                variant="h3"
                component="h2"
                textAlign="center"
                fontWeight={700}
                color="#1e293b"
                gutterBottom
              >
                Được Tin dùng bởi Giáo viên
              </Typography>
              <Typography
                variant="h6"
                textAlign="center"
                color="#64748b"
                sx={{ mb: 8, maxWidth: 600, mx: 'auto', fontWeight: 400, lineHeight: 1.6 }}
              >
                Hàng trăm trường học đã chọn EduAttend để nâng cao hiệu quả quản lý
              </Typography>
            </motion.div>

            <Grid container spacing={4}>
              {testimonials.map((testimonial, index) => (
                <Grid item xs={12} md={4} key={testimonial.name}>
                  <TestimonialCard
                    {...testimonial}
                    delay={index * 0.2}
                  />
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Final CTA Section */}
        <Box 
          sx={{ 
            py: { xs: 8, md: 12 },
            background: `linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)`,
            color: 'white'
          }}
        >
          <Container maxWidth="md">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" component="h3" fontWeight={700} gutterBottom>
                  Sẵn sàng Trải nghiệm?
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 4, 
                    opacity: 0.9,
                    maxWidth: 500, 
                    mx: 'auto',
                    fontWeight: 400,
                    lineHeight: 1.6
                  }}
                >
                  Thiết lập hệ thống điểm danh cho lớp học của bạn chỉ trong 5 phút.
                  Hoàn toàn miễn phí!
                </Typography>
                
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={2} 
                  justifyContent="center"
                >
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
                    endIcon={<ArrowForward />}
                    sx={{
                      bgcolor: 'white',
                      color: '#2563eb',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 2,
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: '#f8fafc',
                        transform: 'translateY(-2px)',
                      }
                    }}
                  >
                    {isAuthenticated ? 'Vào Dashboard' : 'Bắt đầu Ngay'}
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 2,
                      textTransform: 'none',
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                      }
                    }}
                  >
                    Tìm hiểu thêm
                  </Button>
                </Stack>
              </Box>
            </motion.div>
          </Container>
        </Box>
      </Box>
    </>
  )
}

export default HomePage
