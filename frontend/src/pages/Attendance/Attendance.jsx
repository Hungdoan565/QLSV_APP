import React from 'react'
import {
  Box,
  Typography,
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
  Button,
} from '@mui/material'
import {
  Add,
  Edit,
  Delete,
  Visibility,
  QrCodeScanner,
} from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAttendance } from '../../store/slices/attendanceSlice'

const Attendance = () => {
  const dispatch = useDispatch()
  const { attendance, isLoading, error } = useSelector((state) => state.attendance)

  React.useEffect(() => {
    dispatch(fetchAttendance())
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
          Quản lý điểm danh
        </Typography>
        <Button
          variant="contained"
          startIcon={<QrCodeScanner />}
        >
          Điểm danh QR
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
                <TableCell>Sinh viên</TableCell>
                <TableCell>Lớp học</TableCell>
                <TableCell>Ngày điểm danh</TableCell>
                <TableCell>Thời gian</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Ghi chú</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendance.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    {record.student?.first_name} {record.student?.last_name}
                  </TableCell>
                  <TableCell>{record.class?.class_name}</TableCell>
                  <TableCell>
                    {record.date ? new Date(record.date).toLocaleDateString('vi-VN') : '-'}
                  </TableCell>
                  <TableCell>
                    {record.time ? new Date(record.time).toLocaleTimeString('vi-VN') : '-'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={record.status === 'present' ? 'Có mặt' : record.status === 'absent' ? 'Vắng mặt' : 'Muộn'}
                      color={record.status === 'present' ? 'success' : record.status === 'absent' ? 'error' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{record.notes || '-'}</TableCell>
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

export default Attendance