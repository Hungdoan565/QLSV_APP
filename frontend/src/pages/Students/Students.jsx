import React, { useEffect, useState } from 'react'
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
  TextField,
  InputAdornment,
} from '@mui/material'
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Search,
  PersonAdd,
} from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { fetchStudents, deleteStudent } from '../../store/slices/studentSlice'

const Students = () => {
  const dispatch = useDispatch()
  const { students, isLoading, error } = useSelector((state) => state.students)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStudent, setSelectedStudent] = useState(null)

  useEffect(() => {
    dispatch(fetchStudents())
  }, [dispatch])

  const handleDeleteStudent = async (student) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa sinh viên "${student.full_name}"?`)) {
      try {
        await dispatch(deleteStudent(student.id)).unwrap()
        alert('Xóa sinh viên thành công')
      } catch (error) {
        alert('Có lỗi xảy ra khi xóa sinh viên')
      }
    }
  }

  const filteredStudents = students.filter(student =>
    student.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.student_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Quản lý Sinh viên
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Quản lý thông tin sinh viên, thêm mới, cập nhật và theo dõi
        </Typography>
      </Box>

      {/* Action Bar */}
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
          <TextField
            size="small"
            placeholder="Tìm kiếm sinh viên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 300 }}
          />
          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            size="small"
          >
            Thêm sinh viên
          </Button>
        </Box>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Data Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã SV</TableCell>
                <TableCell>Họ tên</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Giới tính</TableCell>
                <TableCell>Ngày sinh</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.student_id}</TableCell>
                  <TableCell>{student.full_name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>
                    {student.gender === 'male' ? 'Nam' : student.gender === 'female' ? 'Nữ' : 'Khác'}
                  </TableCell>
                  <TableCell>
                    {student.date_of_birth ? new Date(student.date_of_birth).toLocaleDateString('vi-VN') : '-'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={student.is_active ? 'Hoạt động' : 'Không hoạt động'}
                      color={student.is_active ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" color="primary" title="Xem chi tiết">
                      <Visibility />
                    </IconButton>
                    <IconButton size="small" color="primary" title="Chỉnh sửa">
                      <Edit />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error" 
                      title="Xóa"
                      onClick={() => handleDeleteStudent(student)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {filteredStudents.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            {searchTerm ? 'Không tìm thấy sinh viên nào' : 'Chưa có sinh viên nào'}
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default Students