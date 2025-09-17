import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Chip,
  Alert,
  Stack,
  Card,
  CardContent,
  Avatar,
  Grid,
  TextField,
  InputAdornment,
  Fab,
  useTheme,
  alpha,
} from '@mui/material'
import {
  Add,
  Edit,
  Delete,
  Visibility,
  FileUpload,
  FileDownload,
  Search,
  FilterList,
  Person,
  PersonAdd,
  School,
  Email,
  Phone,
  CalendarToday,
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { fetchStudents, deleteStudent } from '../../store/slices/studentSlice'
import { Helmet } from 'react-helmet-async'

// Components
import EnhancedDataTable from '../../components/Table/EnhancedDataTable'
import EnhancedModal, { ModalActions } from '../../components/Modal/EnhancedModal'
import { EnhancedButton } from '../../components/Button/EnhancedButton'
import { useNotification } from '../../components/Notification/NotificationProvider'
import StudentForm from './StudentForm'

const Students = () => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const { students, isLoading, error } = useSelector((state) => state.students)
  const { showSuccess, showError, showWarning } = useNotification()

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)

  // View mode state
  const [viewMode, setViewMode] = useState('table') // 'table' or 'grid'
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    dispatch(fetchStudents())
  }, [dispatch])

  // Table columns configuration
  const columns = [
    {
      id: 'avatar',
      label: '',
      sortable: false,
      minWidth: 60,
      render: (value, row) => (
        <Avatar sx={{ bgcolor: 'primary.main' }}>
          {row.full_name?.charAt(0)?.toUpperCase()}
        </Avatar>
      )
    },
    { id: 'student_id', label: 'Mã SV', minWidth: 120 },
    { id: 'full_name', label: 'Họ tên', minWidth: 180 },
    { id: 'email', label: 'Email', minWidth: 200 },
    {
      id: 'gender',
      label: 'Giới tính',
      minWidth: 100,
      render: (value) => value === 'male' ? 'Nam' : value === 'female' ? 'Nữ' : 'Khác'
    },
    {
      id: 'date_of_birth',
      label: 'Ngày sinh',
      type: 'date',
      minWidth: 120
    },
    {
      id: 'is_active',
      label: 'Trạng thái',
      type: 'chip',
      minWidth: 120,
      render: (value) => (
        <Chip
          label={value ? 'Hoạt động' : 'Không hoạt động'}
          color={value ? 'success' : 'default'}
          size="small"
        />
      )
    }
  ]

  // Row actions
  const rowActions = [
    {
      icon: <Visibility />,
      tooltip: 'Xem chi tiết',
      onClick: (row) => handleViewStudent(row),
      color: 'info'
    },
    {
      icon: <Edit />,
      tooltip: 'Chỉnh sửa',
      onClick: (row) => handleEditStudent(row),
      color: 'primary'
    },
    {
      icon: <Delete />,
      tooltip: 'Xóa',
      onClick: (row) => handleDeleteStudent(row),
      color: 'error'
    }
  ]

  // Event handlers
  const handleViewStudent = (student) => {
    setSelectedStudent(student)
    setViewModalOpen(true)
  }

  const handleEditStudent = (student) => {
    setSelectedStudent(student)
    setEditModalOpen(true)
  }

  const handleDeleteStudent = (student) => {
    setSelectedStudent(student)
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedStudent) return
    
    try {
      await dispatch(deleteStudent(selectedStudent.id)).unwrap()
      showSuccess('Xóa sinh viên thành công')
      setDeleteModalOpen(false)
      setSelectedStudent(null)
    } catch (error) {
      showError('Có lỗi xảy ra khi xóa sinh viên')
    }
  }

  const handleAddSuccess = () => {
    showSuccess('Thêm sinh viên thành công')
    setAddModalOpen(false)
    dispatch(fetchStudents())
  }

  const handleEditSuccess = () => {
    showSuccess('Cập nhật sinh viên thành công')
    setEditModalOpen(false)
    setSelectedStudent(null)
    dispatch(fetchStudents())
  }

  return (
    <>
      <Helmet>
        <title>Quản lý Sinh viên - Hệ thống Quản lý Sinh viên</title>
        <meta name="description" content="Quản lý thông tin sinh viên, thêm, sửa, xóa sinh viên" />
      </Helmet>

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
        <Card elevation={2} sx={{ mb: 3 }}>
          <CardContent>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              alignItems={{ xs: 'stretch', sm: 'center' }}
              justifyContent="space-between"
            >
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flex: 1 }}>
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
                  variant="outlined"
                  startIcon={<FilterList />}
                  size="small"
                >
                  Bộ lọc
                </Button>
              </Box>

              <Stack direction="row" spacing={1}>
                <EnhancedButton
                  variant="outlined"
                  startIcon={<FileUpload />}
                  size="small"
                  tooltip="Import dữ liệu từ Excel"
                >
                  Import
                </EnhancedButton>
                <EnhancedButton
                  variant="outlined"
                  startIcon={<FileDownload />}
                  size="small"
                  tooltip="Export dữ liệu ra Excel"
                >
                  Export
                </EnhancedButton>
                <EnhancedButton
                  variant="contained"
                  startIcon={<PersonAdd />}
                  onClick={() => setAddModalOpen(true)}
                  size="small"
                >
                  Thêm sinh viên
                </EnhancedButton>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Data Table */}
        <EnhancedDataTable
          data={students}
          columns={columns}
          loading={isLoading}
          error={error}
          title="Danh sách sinh viên"
          subtitle={`Tổng cộng ${students.length} sinh viên`}
          searchable={true}
          sortable={true}
          exportable={true}
          rowActions={rowActions}
          emptyMessage="Không có sinh viên nào"
          onRowClick={(event, row) => handleViewStudent(row)}
        />

        {/* Floating Action Button for mobile */}
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            display: { xs: 'flex', sm: 'none' }
          }}
          onClick={() => setAddModalOpen(true)}
        >
          <Add />
        </Fab>

        {/* Modals */}
        {/* Add Student Modal */}
        <EnhancedModal
          open={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          title="Thêm sinh viên mới"
          subtitle="Nhập thông tin sinh viên để thêm vào hệ thống"
          maxWidth="md"
          actions={
            <>
              <ModalActions.Cancel onClick={() => setAddModalOpen(false)} />
              <ModalActions.Save 
                onClick={() => {
                  // This will be handled by the form submission
                }}
                loading={isLoading}
              />
            </>
          }
        >
          <StudentForm onSubmit={handleAddSuccess} loading={isLoading} />
        </EnhancedModal>

        {/* Edit Student Modal */}
        <EnhancedModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          title="Chỉnh sửa thông tin sinh viên"
          subtitle={selectedStudent?.full_name}
          maxWidth="md"
          actions={
            <>
              <ModalActions.Cancel onClick={() => setEditModalOpen(false)} />
              <ModalActions.Save 
                onClick={() => {
                  // This will be handled by the form submission
                }}
                loading={isLoading}
              />
            </>
          }
        >
          <StudentForm 
            student={selectedStudent}
            onSubmit={handleEditSuccess}
            loading={isLoading}
          />
        </EnhancedModal>

        {/* View Student Modal */}
        <EnhancedModal
          open={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          title="Thông tin sinh viên"
          subtitle={selectedStudent?.full_name}
          maxWidth="sm"
          actions={
            <>
              <ModalActions.Cancel onClick={() => setViewModalOpen(false)} />
              <EnhancedButton
                variant="contained"
                startIcon={<Edit />}
                onClick={() => {
                  setViewModalOpen(false)
                  handleEditStudent(selectedStudent)
                }}
              >
                Chỉnh sửa
              </EnhancedButton>
            </>
          }
        >
          {selectedStudent && (
            <Grid container spacing={2}>
              <Grid item xs={12} sx={{ textAlign: 'center' }}>
                <Avatar
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    mx: 'auto', 
                    mb: 2,
                    bgcolor: 'primary.main',
                    fontSize: '2rem'
                  }}
                >
                  {selectedStudent.full_name?.charAt(0)?.toUpperCase()}
                </Avatar>
                <Typography variant="h6">{selectedStudent.full_name}</Typography>
                <Chip
                  label={selectedStudent.is_active ? 'Hoạt động' : 'Không hoạt động'}
                  color={selectedStudent.is_active ? 'success' : 'default'}
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Mã sinh viên</Typography>
                    <Typography variant="body1">{selectedStudent.student_id}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Email</Typography>
                    <Typography variant="body1">{selectedStudent.email}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Số điện thoại</Typography>
                    <Typography variant="body1">{selectedStudent.phone || 'Chưa cập nhật'}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Giới tính</Typography>
                    <Typography variant="body1">
                      {selectedStudent.gender === 'male' ? 'Nam' : selectedStudent.gender === 'female' ? 'Nữ' : 'Khác'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Ngày sinh</Typography>
                    <Typography variant="body1">
                      {selectedStudent.date_of_birth ? 
                        new Date(selectedStudent.date_of_birth).toLocaleDateString('vi-VN') : 
                        'Chưa cập nhật'
                      }
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Địa chỉ</Typography>
                    <Typography variant="body1">{selectedStudent.address || 'Chưa cập nhật'}</Typography>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          )}
        </EnhancedModal>

        {/* Delete Student Modal */}
        <EnhancedModal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Xác nhận xóa sinh viên"
          subtitle={`Bạn có chắc chắn muốn xóa sinh viên "${selectedStudent?.full_name}"?`}
          variant="warning"
          maxWidth="sm"
          actions={
            <>
              <ModalActions.Cancel onClick={() => setDeleteModalOpen(false)} />
              <ModalActions.Delete 
                onClick={confirmDelete}
                loading={isLoading}
              />
            </>
          }
        >
          <Typography variant="body1" color="text.secondary">
            Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan đến sinh viên này sẽ bị xóa.
          </Typography>
        </EnhancedModal>
      </Box>
    </>
  )
}

export default Students
