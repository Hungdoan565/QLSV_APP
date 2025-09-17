import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import classService from '../../services/classService'

// Async thunks
export const fetchClasses = createAsyncThunk(
  'classes/fetchClasses',
  async (params, { rejectWithValue }) => {
    try {
      const response = await classService.getClasses(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const fetchClass = createAsyncThunk(
  'classes/fetchClass',
  async (id, { rejectWithValue }) => {
    try {
      const response = await classService.getClass(id)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const createClass = createAsyncThunk(
  'classes/createClass',
  async (classData, { rejectWithValue }) => {
    try {
      const response = await classService.createClass(classData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const updateClass = createAsyncThunk(
  'classes/updateClass',
  async ({ id, classData }, { rejectWithValue }) => {
    try {
      const response = await classService.updateClass(id, classData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const deleteClass = createAsyncThunk(
  'classes/deleteClass',
  async (id, { rejectWithValue }) => {
    try {
      await classService.deleteClass(id)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const fetchClassStudents = createAsyncThunk(
  'classes/fetchClassStudents',
  async (classId, { rejectWithValue }) => {
    try {
      const response = await classService.getClassStudents(classId)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const addStudentToClass = createAsyncThunk(
  'classes/addStudentToClass',
  async ({ classId, studentId }, { rejectWithValue }) => {
    try {
      const response = await classService.addStudentToClass(classId, studentId)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const removeStudentFromClass = createAsyncThunk(
  'classes/removeStudentFromClass',
  async ({ classId, studentId }, { rejectWithValue }) => {
    try {
      await classService.removeStudentFromClass(classId, studentId)
      return { classId, studentId }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const fetchClassStatistics = createAsyncThunk(
  'classes/fetchClassStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await classService.getClassStatistics()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

const initialState = {
  classes: [],
  currentClass: null,
  classStudents: [],
  statistics: null,
  isLoading: false,
  error: null,
  pagination: {
    count: 0,
    next: null,
    previous: null,
  },
}

const classSlice = createSlice({
  name: 'classes',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCurrentClass: (state) => {
      state.currentClass = null
    },
    clearClassStudents: (state) => {
      state.classStudents = []
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch classes
      .addCase(fetchClasses.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.isLoading = false
        state.classes = action.payload.results
        state.pagination = {
          count: action.payload.count,
          next: action.payload.next,
          previous: action.payload.previous,
        }
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Fetch single class
      .addCase(fetchClass.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchClass.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentClass = action.payload
      })
      .addCase(fetchClass.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Create class
      .addCase(createClass.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createClass.fulfilled, (state, action) => {
        state.isLoading = false
        state.classes.unshift(action.payload)
      })
      .addCase(createClass.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Update class
      .addCase(updateClass.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateClass.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.classes.findIndex(cls => cls.id === action.payload.id)
        if (index !== -1) {
          state.classes[index] = action.payload
        }
        if (state.currentClass && state.currentClass.id === action.payload.id) {
          state.currentClass = action.payload
        }
      })
      .addCase(updateClass.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Delete class
      .addCase(deleteClass.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteClass.fulfilled, (state, action) => {
        state.isLoading = false
        state.classes = state.classes.filter(cls => cls.id !== action.payload)
      })
      .addCase(deleteClass.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Fetch class students
      .addCase(fetchClassStudents.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchClassStudents.fulfilled, (state, action) => {
        state.isLoading = false
        state.classStudents = action.payload
      })
      .addCase(fetchClassStudents.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Add student to class
      .addCase(addStudentToClass.fulfilled, (state, action) => {
        state.classStudents.push(action.payload)
      })
      // Remove student from class
      .addCase(removeStudentFromClass.fulfilled, (state, action) => {
        state.classStudents = state.classStudents.filter(
          student => student.id !== action.payload.studentId
        )
      })
      // Fetch statistics
      .addCase(fetchClassStatistics.fulfilled, (state, action) => {
        state.statistics = action.payload
      })
  },
})

export const { clearError, clearCurrentClass, clearClassStudents } = classSlice.actions
export default classSlice.reducer
