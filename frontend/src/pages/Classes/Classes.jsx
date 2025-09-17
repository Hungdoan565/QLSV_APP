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
  People,
} from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { fetchClasses } from '../../store/slices/classSlice'

const Classes = () => {
  const dispatch = useDispatch()
  const { classes, isLoading, error } = useSelector((state) => state.classes)

  useEffect(() => {
    dispatch(fetchClasses())
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
          Quản lý lớp học
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
        >
          Thêm lớp học
        </Button>
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
                <TableCell>Mã lớp</TableCell>
                <TableCell>Tên lớp</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell>Giảng viên</TableCell>
                <TableCell>Số sinh viên</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {classes.map((classItem) => (
                <TableRow key={classItem.id}>
                  <TableCell>{classItem.class_id}</TableCell>
                  <TableCell>{classItem.class_name}</TableCell>
                  <TableCell>{classItem.description || '-'}</TableCell>
                  <TableCell>
                    {classItem.teacher?.first_name} {classItem.teacher?.last_name}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <People sx={{ mr: 1, fontSize: 16 }} />
                      {classItem.current_students_count}/{classItem.max_students}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={classItem.is_active ? 'Hoạt động' : 'Không hoạt động'}
                      color={classItem.is_active ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
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

export default Classes
