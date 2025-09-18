import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

// Async thunks
export const fetchAttendance = createAsyncThunk(
  'attendance/fetchAttendance',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/attendance/')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tải danh sách điểm danh')
    }
  }
)

const initialState = {
  attendance: [],
  isLoading: false,
  error: null,
}

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch attendance
      .addCase(fetchAttendance.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.isLoading = false
        state.attendance = action.payload
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { clearError } = attendanceSlice.actions
export default attendanceSlice.reducer