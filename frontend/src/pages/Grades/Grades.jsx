import React, { useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material'
import {
  Add,
  Edit,
  Delete,
  Visibility,
  FileDownload,
} from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { fetchGrades } from '../../store/slices/gradeSlice'

const Grades = () => {
  const dispatch = useDispatch()
  const { grades, isLoading, error } = useSelector((state) => state.grades)

  useEffect(() => {
    dispatch(fetchGrades())
  }, [dispatch])

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Quản lý điểm số
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<FileDownload />}
            sx={{ mr: 1 }}
          >
            Export Excel
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
          >
            Thêm điểm
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sinh viên</TableCell>
                <TableCell>Lớp học</TableCell>
                <TableCell>Môn học</TableCell>
                <TableCell>Loại điểm</TableCell>
                <TableCell>Điểm số</TableCell>
                <TableCell>Xếp loại</TableCell>
                <TableCell>Ghi chú</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {grades.map((grade) => (
                <TableRow key={grade.id}>
                  <TableCell>{grade.student?.full_name}</TableCell>
                  <TableCell>{grade.class_obj?.class_name}</TableCell>
                  <TableCell>{grade.subject?.subject_name}</TableCell>
                  <TableCell>
                    <Chip
                      label={
                        grade.grade_type === 'midterm' ? 'Giữa kỳ' :
                        grade.grade_type === 'final' ? 'Cuối kỳ' :
                        grade.grade_type === 'assignment' ? 'Bài tập' :
                        grade.grade_type === 'quiz' ? 'Kiểm tra' : 'Khác'
                      }
                      color="primary"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {grade.score}/{grade.max_score}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={grade.letter_grade}
                      color={
                        grade.letter_grade === 'A+' || grade.letter_grade === 'A' ? 'success' :
                        grade.letter_grade === 'B+' || grade.letter_grade === 'B' ? 'info' :
                        grade.letter_grade === 'C+' || grade.letter_grade === 'C' ? 'warning' : 'error'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{grade.comment || '-'}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" color="primary">
                      <Visibility />
                    </IconButton>
                    <IconButton size="small" color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  )
}

export default Grades
