import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Stack,
  Avatar,
  Badge
} from '@mui/material'
import {
  School as SchoolIcon,
  Grade as GradeIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Assessment as AssessmentIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon
} from '@mui/icons-material'

const StudentGradesView = ({ user }) => {
  const [grades, setGrades] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // Mock data for student grades
  useEffect(() => {
    const loadGrades = async () => {
      setIsLoading(true)
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock data with 10%-30%-60% system
        const mockGrades = [
          {
            id: 1,
            subject: 'Lập trình Web',
            subjectCode: 'CS101',
            teacher: 'ThS. Nguyễn Văn Minh',
            semester: '2024-1',
            components: {
              regular: {
                weight: 10,
                maxScore: 100,
                currentScore: 85,
                items: [
                  { name: 'Bài tập 1', score: 90, maxScore: 100, date: '2024-01-15' },
                  { name: 'Bài tập 2', score: 80, maxScore: 100, date: '2024-01-22' },
                  { name: 'Thuyết trình', score: 85, maxScore: 100, date: '2024-01-29' }
                ]
              },
              midterm: {
                weight: 30,
                maxScore: 100,
                currentScore: 78,
                items: [
                  { name: 'Giữa kỳ', score: 78, maxScore: 100, date: '2024-02-15' }
                ]
              },
              final: {
                weight: 60,
                maxScore: 100,
                currentScore: 92,
                items: [
                  { name: 'Cuối kỳ', score: 92, maxScore: 100, date: '2024-03-20' }
                ]
              }
            },
            finalGrade: 87.1,
            status: 'completed'
          },
          {
            id: 2,
            subject: 'Cơ sở dữ liệu',
            subjectCode: 'CS102',
            teacher: 'TS. Lê Thị Hoa',
            semester: '2024-1',
            components: {
              regular: {
                weight: 10,
                maxScore: 100,
                currentScore: 88,
                items: [
                  { name: 'Bài tập 1', score: 85, maxScore: 100, date: '2024-01-16' },
                  { name: 'Bài tập 2', score: 90, maxScore: 100, date: '2024-01-23' },
                  { name: 'Thực hành', score: 89, maxScore: 100, date: '2024-01-30' }
                ]
              },
              midterm: {
                weight: 30,
                maxScore: 100,
                currentScore: 82,
                items: [
                  { name: 'Giữa kỳ', score: 82, maxScore: 100, date: '2024-02-16' }
                ]
              },
              final: {
                weight: 60,
                maxScore: 100,
                currentScore: 0,
                items: []
              }
            },
            finalGrade: 0,
            status: 'in_progress'
          },
          {
            id: 3,
            subject: 'Mạng máy tính',
            subjectCode: 'CS103',
            teacher: 'ThS. Trần Văn Nam',
            semester: '2024-1',
            components: {
              regular: {
                weight: 10,
                maxScore: 100,
                currentScore: 75,
                items: [
                  { name: 'Bài tập 1', score: 70, maxScore: 100, date: '2024-01-17' },
                  { name: 'Bài tập 2', score: 80, maxScore: 100, date: '2024-01-24' }
                ]
              },
              midterm: {
                weight: 30,
                maxScore: 100,
                currentScore: 0,
                items: []
              },
              final: {
                weight: 60,
                maxScore: 100,
                currentScore: 0,
                items: []
              }
            },
            finalGrade: 0,
            status: 'in_progress'
          }
        ]
        
        setGrades(mockGrades)
      } catch (err) {
        console.error('Failed to load grades:', err)
        setError('Không thể tải điểm số')
      } finally {
        setIsLoading(false)
      }
    }

    loadGrades()
  }, [])

  const calculateFinalGrade = (components) => {
    const regular = (components.regular.currentScore * components.regular.weight) / 100
    const midterm = (components.midterm.currentScore * components.midterm.weight) / 100
    const final = (components.final.currentScore * components.final.weight) / 100
    
    return regular + midterm + final
  }

  const getGradeColor = (grade) => {
    if (grade >= 90) return 'success'
    if (grade >= 80) return 'info'
    if (grade >= 70) return 'warning'
    return 'error'
  }

  const getGradeText = (grade) => {
    if (grade >= 90) return 'Xuất sắc'
    if (grade >= 80) return 'Giỏi'
    if (grade >= 70) return 'Khá'
    if (grade >= 50) return 'Trung bình'
    return 'Yếu'
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon color="success" />
      case 'in_progress': return <WarningIcon color="warning" />
      default: return <InfoIcon color="info" />
    }
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error">
        {error}
      </Alert>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Điểm số của tôi
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Hệ thống chấm điểm: 10% (thường xuyên) + 30% (giữa kỳ) + 60% (cuối kỳ)
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight={600} color="primary.main">
                    {grades.filter(g => g.status === 'completed').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Môn đã hoàn thành
                  </Typography>
                </Box>
                <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight={600} color="warning.main">
                    {grades.filter(g => g.status === 'in_progress').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Môn đang học
                  </Typography>
                </Box>
                <WarningIcon sx={{ fontSize: 40, color: 'warning.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight={600} color="info.main">
                    {grades.length > 0 ? (grades.reduce((sum, g) => sum + g.finalGrade, 0) / grades.length).toFixed(1) : 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Điểm TB hiện tại
                  </Typography>
                </Box>
                <AssessmentIcon sx={{ fontSize: 40, color: 'info.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight={600} color="success.main">
                    {grades.filter(g => g.finalGrade >= 80).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Môn đạt loại giỏi
                  </Typography>
                </Box>
                <StarIcon sx={{ fontSize: 40, color: 'success.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Grades List */}
      {grades.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <GradeIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Chưa có điểm số nào
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Điểm số sẽ được cập nhật khi giảng viên chấm bài
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Box>
          {grades.map((grade) => (
            <Accordion key={grade.id} sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box display="flex" alignItems="center" width="100%">
                  <Box display="flex" alignItems="center" flexGrow={1}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      <SchoolIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {grade.subject} ({grade.subjectCode})
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {grade.teacher} • {grade.semester}
                      </Typography>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center" gap={2}>
                    {getStatusIcon(grade.status)}
                    <Chip
                      label={grade.finalGrade > 0 ? `${grade.finalGrade.toFixed(1)} - ${getGradeText(grade.finalGrade)}` : 'Chưa có điểm'}
                      color={grade.finalGrade > 0 ? getGradeColor(grade.finalGrade) : 'default'}
                      variant="outlined"
                    />
                  </Box>
                </Box>
              </AccordionSummary>
              
              <AccordionDetails>
                <Grid container spacing={3}>
                  {/* Regular Grade (10%) */}
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom color="info.main">
                          Thường xuyên (10%)
                        </Typography>
                        <Box display="flex" alignItems="center" mb={2}>
                          <Typography variant="h4" fontWeight={600} sx={{ mr: 2 }}>
                            {grade.components.regular.currentScore}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            / {grade.components.regular.maxScore}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={(grade.components.regular.currentScore / grade.components.regular.maxScore) * 100}
                          color="info"
                          sx={{ mb: 2 }}
                        />
                        <List dense>
                          {grade.components.regular.items.map((item, index) => (
                            <ListItem key={index} disablePadding>
                              <ListItemText
                                primary={item.name}
                                secondary={`${item.score}/${item.maxScore} - ${item.date}`}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Midterm Grade (30%) */}
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom color="warning.main">
                          Giữa kỳ (30%)
                        </Typography>
                        <Box display="flex" alignItems="center" mb={2}>
                          <Typography variant="h4" fontWeight={600} sx={{ mr: 2 }}>
                            {grade.components.midterm.currentScore}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            / {grade.components.midterm.maxScore}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={(grade.components.midterm.currentScore / grade.components.midterm.maxScore) * 100}
                          color="warning"
                          sx={{ mb: 2 }}
                        />
                        <List dense>
                          {grade.components.midterm.items.map((item, index) => (
                            <ListItem key={index} disablePadding>
                              <ListItemText
                                primary={item.name}
                                secondary={`${item.score}/${item.maxScore} - ${item.date}`}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Final Grade (60%) */}
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom color="error.main">
                          Cuối kỳ (60%)
                        </Typography>
                        <Box display="flex" alignItems="center" mb={2}>
                          <Typography variant="h4" fontWeight={600} sx={{ mr: 2 }}>
                            {grade.components.final.currentScore}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            / {grade.components.final.maxScore}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={(grade.components.final.currentScore / grade.components.final.maxScore) * 100}
                          color="error"
                          sx={{ mb: 2 }}
                        />
                        <List dense>
                          {grade.components.final.items.map((item, index) => (
                            <ListItem key={index} disablePadding>
                              <ListItemText
                                primary={item.name}
                                secondary={`${item.score}/${item.maxScore} - ${item.date}`}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* Final Grade Summary */}
                <Divider sx={{ my: 3 }} />
                <Box textAlign="center">
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    Điểm tổng kết
                  </Typography>
                  <Typography variant="h2" fontWeight={700} color="primary.main">
                    {grade.finalGrade > 0 ? grade.finalGrade.toFixed(1) : 'Chưa có'}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    {grade.finalGrade > 0 ? getGradeText(grade.finalGrade) : 'Chờ giảng viên chấm điểm'}
                  </Typography>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}
    </Box>
  )
}

export default StudentGradesView
