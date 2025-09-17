import React, { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  Typography,
  Alert,
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  ValidatedTextField,
  ValidatedSelect,
  ValidatedDatePicker,
  ValidatedRadioGroup,
} from '../../components/Form/EnhancedForm'
import { useNotification } from '../../components/Notification/NotificationProvider'

// Validation schema
const studentSchema = yup.object({
  student_id: yup
    .string()
    .required('Mã sinh viên là bắt buộc')
    .matches(/^[A-Z0-9]+$/, 'Mã sinh viên chỉ chứa chữ hoa và số'),
  first_name: yup
    .string()
    .required('Họ là bắt buộc')
    .min(2, 'Họ phải có ít nhất 2 ký tự'),
  last_name: yup
    .string()
    .required('Tên là bắt buộc')
    .min(2, 'Tên phải có ít nhất 2 ký tự'),
  email: yup
    .string()
    .email('Email không hợp lệ')
    .required('Email là bắt buộc'),
  phone: yup
    .string()
    .matches(/^[0-9+\-\s()]*$/, 'Số điện thoại không hợp lệ')
    .nullable(),
  date_of_birth: yup
    .date()
    .max(new Date(), 'Ngày sinh không thể trong tương lai')
    .required('Ngày sinh là bắt buộc'),
  gender: yup
    .string()
    .oneOf(['male', 'female', 'other'], 'Giới tính không hợp lệ')
    .required('Giới tính là bắt buộc'),
  address: yup.string().nullable(),
})

const StudentForm = ({ 
  student = null, 
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
  const { showError, showSuccess } = useNotification()
  const [submitError, setSubmitError] = useState(null)

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(studentSchema),
    defaultValues: {
      student_id: '',
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      date_of_birth: null,
      gender: '',
      address: '',
      is_active: true,
    },
    mode: 'onChange'
  })

  // Load student data when editing
  useEffect(() => {
    if (student) {
      Object.keys(student).forEach(key => {
        if (student[key] !== undefined && student[key] !== null) {
          setValue(key, student[key])
        }
      })
    } else {
      reset()
    }
  }, [student, setValue, reset])

  const handleFormSubmit = async (data) => {
    try {
      setSubmitError(null)
      await onSubmit(data)
      if (!student) {
        showSuccess('Thêm sinh viên thành công!')
        reset()
      } else {
        showSuccess('Cập nhật sinh viên thành công!')
      }
    } catch (error) {
      const errorMessage = error.message || 'Có lỗi xảy ra. Vui lòng thử lại.'
      setSubmitError(errorMessage)
      showError(errorMessage)
    }
  }

  const genderOptions = [
    { value: 'male', label: 'Nam' },
    { value: 'female', label: 'Nữ' },
    { value: 'other', label: 'Khác' },
  ]

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
      {submitError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {submitError}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Thông tin cơ bản
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <ValidatedTextField
            name="student_id"
            control={control}
            label="Mã sinh viên *"
            placeholder="Ví dụ: SV2023001"
            disabled={!!student} // Disable when editing
            rules={{ required: 'Mã sinh viên là bắt buộc' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <ValidatedTextField
            name="email"
            control={control}
            label="Email *"
            type="email"
            placeholder="student@example.com"
            rules={{ required: 'Email là bắt buộc' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <ValidatedTextField
            name="first_name"
            control={control}
            label="Họ và tên đệm *"
            placeholder="Nguyễn Văn"
            rules={{ required: 'Họ là bắt buộc' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <ValidatedTextField
            name="last_name"
            control={control}
            label="Tên *"
            placeholder="An"
            rules={{ required: 'Tên là bắt buộc' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <ValidatedTextField
            name="phone"
            control={control}
            label="Số điện thoại"
            placeholder="0123456789"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <ValidatedDatePicker
            name="date_of_birth"
            control={control}
            label="Ngày sinh *"
            maxDate={new Date()}
            rules={{ required: 'Ngày sinh là bắt buộc' }}
          />
        </Grid>

        {/* Gender */}
        <Grid item xs={12}>
          <ValidatedRadioGroup
            name="gender"
            control={control}
            label="Giới tính *"
            options={genderOptions}
            row={true}
            rules={{ required: 'Vui lòng chọn giới tính' }}
          />
        </Grid>

        {/* Address */}
        <Grid item xs={12}>
          <ValidatedTextField
            name="address"
            control={control}
            label="Địa chỉ"
            placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
            multiline
            rows={3}
          />
        </Grid>

        {/* Form Summary */}
        {isDirty && (
          <Grid item xs={12}>
            <Alert severity="info">
              <Typography variant="body2">
                Có {Object.keys(errors).length} lỗi cần sửa để có thể lưu form.
              </Typography>
            </Alert>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}

export default StudentForm
