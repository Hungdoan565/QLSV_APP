import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import attendanceService from '../../services/attendanceService'

// Attendance sessions
export const fetchSessions = createAsyncThunk(
  'attendance/fetchSessions',
  async (params, { rejectWithValue }) => {
    try {
      const response = await attendanceService.getSessions(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const createSession = createAsyncThunk(
  'attendance/createSession',
  async (sessionData, { rejectWithValue }) => {
    try {
      const response = await attendanceService.createSession(sessionData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// Attendance records
export const fetchAttendances = createAsyncThunk(
  'attendance/fetchAttendances',
  async (params, { rejectWithValue }) => {
    try {
      const response = await attendanceService.getAttendances(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const createAttendance = createAsyncThunk(
  'attendance/createAttendance',
  async (attendanceData, { rejectWithValue }) => {
    try {
      const response = await attendanceService.createAttendance(attendanceData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const bulkCreateAttendance = createAsyncThunk(
  'attendance/bulkCreateAttendance',
  async (attendanceData, { rejectWithValue }) => {
    try {
      const response = await attendanceService.bulkCreateAttendance(attendanceData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const checkInWithQR = createAsyncThunk(
  'attendance/checkInWithQR',
  async (qrData, { rejectWithValue }) => {
    try {
      const response = await attendanceService.checkInWithQR(qrData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const fetchAttendanceSummary = createAsyncThunk(
  'attendance/fetchAttendanceSummary',
  async (classId, { rejectWithValue }) => {
    try {
      const response = await attendanceService.getAttendanceSummary(classId)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const calculateAttendanceSummary = createAsyncThunk(
  'attendance/calculateAttendanceSummary',
  async (classId, { rejectWithValue }) => {
    try {
      const response = await attendanceService.calculateAttendanceSummary(classId)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

const initialState = {
  sessions: [],
  attendances: [],
  attendanceSummary: null,
  isLoading: false,
  error: null,
  pagination: {
    count: 0,
    next: null,
    previous: null,
  },
}

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearAttendanceSummary: (state) => {
      state.attendanceSummary = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch sessions
      .addCase(fetchSessions.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchSessions.fulfilled, (state, action) => {
        state.isLoading = false
        state.sessions = action.payload.results || action.payload
      })
      .addCase(fetchSessions.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Create session
      .addCase(createSession.fulfilled, (state, action) => {
        state.sessions.unshift(action.payload)
      })
      // Fetch attendances
      .addCase(fetchAttendances.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchAttendances.fulfilled, (state, action) => {
        state.isLoading = false
        state.attendances = action.payload.results || action.payload
        if (action.payload.count) {
          state.pagination = {
            count: action.payload.count,
            next: action.payload.next,
            previous: action.payload.previous,
          }
        }
      })
      .addCase(fetchAttendances.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Create attendance
      .addCase(createAttendance.fulfilled, (state, action) => {
        state.attendances.unshift(action.payload)
      })
      // Bulk create attendance
      .addCase(bulkCreateAttendance.fulfilled, (state, action) => {
        state.attendances.unshift(...action.payload.created_attendances)
      })
      // Check in with QR
      .addCase(checkInWithQR.fulfilled, (state, action) => {
        state.attendances.unshift(action.payload.attendance)
      })
      // Fetch attendance summary
      .addCase(fetchAttendanceSummary.fulfilled, (state, action) => {
        state.attendanceSummary = action.payload
      })
      // Calculate attendance summary
      .addCase(calculateAttendanceSummary.fulfilled, (state, action) => {
        state.attendanceSummary = action.payload
      })
  },
})

export const { clearError, clearAttendanceSummary } = attendanceSlice.actions
export default attendanceSlice.reducer
