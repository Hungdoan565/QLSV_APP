import React from 'react'
import {
  Grid,
  MenuItem,
  Box,
  Avatar,
  Typography,
  IconButton,
  Divider
} from '@mui/material'
import {
  Person,
  Email,
  Phone,
  CalendarToday,
  PhotoCamera,
  School
} from '@mui/icons-material'
import * as yup from 'yup'
import dayjs from 'dayjs'

import {
  useEnhancedForm,
  ValidatedTextField,
  ValidatedSelect,
  ValidatedDatePicker,
  ValidatedCheckbox
} from '../../components/Form/EnhancedForm'

// Validation schema
const studentSchema = yup.object({
  student_id: yup
    .string()
    .required('Mã sinh viên là bắt buộc')
    .min(6, 'Mã sinh viên phải có ít nhất 6 ký tự'),
  full_name: yup
    .string()
    .required('Họ tên là bắt buộc')
    .min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  email: yup
    .string()
    .email('Email không hợp lệ')
    .required('Email là bắt buộc'),
  phone: yup
    .string()
    .matches(/^[0-9+\-\s()]*$/, 'Số điện thoại không hợp lệ')
    .min(10, 'Số điện thoại phải có ít nhất 10 số'),
  date_of_birth: yup
    .date()
    .required('Ngày sinh là bắt buộc')
    .max(new Date(), 'Ngày sinh không thể ở tương lai'),
  gender: yup
    .string()
    .required('Giới tính là bắt buộc')
    .oneOf(['male', 'female', 'other'], 'Giới tính không hợp lệ'),
  address: yup.string(),
  is_active: yup.boolean()
})

const genderOptions = [
  { value: 'male', label: 'Nam' },
  { value: 'female', label: 'Nữ' },
  { value: 'other', label: 'Khác' }
]

const StudentForm = ({ student = null, onSubmit, loading = false }) => {
  const isEdit = !!student

  // Default form values
  const defaultValues = {
    student_id: student?.student_id || '',
    full_name: student?.full_name || '',
    email: student?.email || '',
    phone: student?.phone || '',
    date_of_birth: student?.date_of_birth || null,
    gender: student?.gender || '',
    address: student?.address || '',
    is_active: student?.is_active ?? true
  }

  const {
    control,
    handleFormSubmit,
    formState: { errors },
    reset,
    watch
  } = useEnhancedForm(studentSchema, defaultValues)

  const watchedName = watch('full_name')

  const handleSubmit = (data) => {
    // Format date for backend
    const formattedData = {
      ...data,
      date_of_birth: data.date_of_birth ? dayjs(data.date_of_birth).format('YYYY-MM-DD') : null
    }
    onSubmit(formattedData)
  }

  return (
    <Box>
      {/* Avatar Section */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
          <Avatar
            sx={{ 
              width: 100, 
              height: 100, 
              mx: 'auto', 
              mb: 2,
              bgcolor: 'primary.main',
              fontSize: '2rem'
            }}
          >
            {watchedName ? watchedName.charAt(0).toUpperCase() : <Person />}
          </Avatar>
          <IconButton
            sx={{
              position: 'absolute',
              bottom: 16,
              right: -8,
              bgcolor: 'background.paper',
              boxShadow: 2,
              '&:hover': { boxShadow: 4 }
            }}
            size="small"
          >
            <PhotoCamera fontSize="small" />
          </IconButton>
        </Box>
        <Typography variant="h6" color="text.secondary">
          {isEdit ? 'Cập nhật thông tin sinh viên' : 'Thêm sinh viên mới'}
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <form onSubmit={handleFormSubmit(handleSubmit)}>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <School /> Thông tin cơ bản
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <ValidatedTextField
              name="student_id"
              control={control}
              label="Mã sinh viên"
              placeholder="Nhập mã sinh viên"
              disabled={loading || isEdit} // Don't allow editing student ID
              startAdornment={
                <School sx={{ color: 'action.active', mr: 1 }} />
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <ValidatedTextField
              name="full_name"
              control={control}
              label="Họ và tên"
              placeholder="Nhập họ và tên đầy đủ"
              disabled={loading}
              startAdornment={
                <Person sx={{ color: 'action.active', mr: 1 }} />
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <ValidatedTextField
              name="email"
              control={control}
              label="Email"
              type="email"
              placeholder="example@email.com"
              disabled={loading}
              startAdornment={
                <Email sx={{ color: 'action.active', mr: 1 }} />
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <ValidatedTextField
              name="phone"
              control={control}
              label="Số điện thoại"
              placeholder="0987654321"
              disabled={loading}
              startAdornment={
                <Phone sx={{ color: 'action.active', mr: 1 }} />
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <ValidatedDatePicker
              name="date_of_birth"
              control={control}
              label="Ngày sinh"
              maxDate={new Date()}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <ValidatedSelect
              name="gender"
              control={control}
              label="Giới tính"
              options={genderOptions}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12}>
            <ValidatedTextField
              name="address"
              control={control}
              label="Địa chỉ"
              placeholder="Nhập địa chỉ đầy đủ"
              multiline
              rows={3}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12}>
            <ValidatedCheckbox
              name="is_active"
              control={control}
              label="Tài khoản hoạt động"
              disabled={loading}
            />
          </Grid>
        </Grid>
      </form>
    </Box>
  )
}

export default StudentForm
