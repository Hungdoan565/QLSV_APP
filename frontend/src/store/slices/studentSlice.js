import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import studentService from '../../services/studentService'

// Async thunks
export const fetchStudents = createAsyncThunk(
  'students/fetchStudents',
  async (params, { rejectWithValue }) => {
    try {
      const response = await studentService.getStudents(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const fetchStudent = createAsyncThunk(
  'students/fetchStudent',
  async (id, { rejectWithValue }) => {
    try {
      const response = await studentService.getStudent(id)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const createStudent = createAsyncThunk(
  'students/createStudent',
  async (studentData, { rejectWithValue }) => {
    try {
      const response = await studentService.createStudent(studentData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const updateStudent = createAsyncThunk(
  'students/updateStudent',
  async ({ id, studentData }, { rejectWithValue }) => {
    try {
      const response = await studentService.updateStudent(id, studentData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const deleteStudent = createAsyncThunk(
  'students/deleteStudent',
  async (id, { rejectWithValue }) => {
    try {
      await studentService.deleteStudent(id)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const importStudents = createAsyncThunk(
  'students/importStudents',
  async (file, { rejectWithValue }) => {
    try {
      const response = await studentService.importStudents(file)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const exportStudents = createAsyncThunk(
  'students/exportStudents',
  async (params, { rejectWithValue }) => {
    try {
      const response = await studentService.exportStudents(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const fetchStudentStatistics = createAsyncThunk(
  'students/fetchStudentStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await studentService.getStudentStatistics()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

const initialState = {
  students: [],
  currentStudent: null,
  statistics: null,
  isLoading: false,
  error: null,
  pagination: {
    count: 0,
    next: null,
    previous: null,
  },
}

const studentSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCurrentStudent: (state) => {
      state.currentStudent = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch students
      .addCase(fetchStudents.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.isLoading = false
        state.students = action.payload.results
        state.pagination = {
          count: action.payload.count,
          next: action.payload.next,
          previous: action.payload.previous,
        }
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Fetch single student
      .addCase(fetchStudent.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchStudent.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentStudent = action.payload
      })
      .addCase(fetchStudent.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Create student
      .addCase(createStudent.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createStudent.fulfilled, (state, action) => {
        state.isLoading = false
        state.students.unshift(action.payload)
      })
      .addCase(createStudent.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Update student
      .addCase(updateStudent.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.students.findIndex(student => student.id === action.payload.id)
        if (index !== -1) {
          state.students[index] = action.payload
        }
        if (state.currentStudent && state.currentStudent.id === action.payload.id) {
          state.currentStudent = action.payload
        }
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Delete student
      .addCase(deleteStudent.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.isLoading = false
        state.students = state.students.filter(student => student.id !== action.payload)
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Import students
      .addCase(importStudents.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(importStudents.fulfilled, (state, action) => {
        state.isLoading = false
        // Add imported students to the list
        state.students.unshift(...action.payload.students)
      })
      .addCase(importStudents.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Fetch statistics
      .addCase(fetchStudentStatistics.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchStudentStatistics.fulfilled, (state, action) => {
        state.isLoading = false
        state.statistics = action.payload
      })
      .addCase(fetchStudentStatistics.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { clearError, clearCurrentStudent } = studentSlice.actions
export default studentSlice.reducer
