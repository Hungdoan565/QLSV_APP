import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import gradeService from '../../services/gradeService'

// Subjects
export const fetchSubjects = createAsyncThunk(
  'grades/fetchSubjects',
  async (params, { rejectWithValue }) => {
    try {
      const response = await gradeService.getSubjects(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const createSubject = createAsyncThunk(
  'grades/createSubject',
  async (subjectData, { rejectWithValue }) => {
    try {
      const response = await gradeService.createSubject(subjectData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// Grades
export const fetchGrades = createAsyncThunk(
  'grades/fetchGrades',
  async (params, { rejectWithValue }) => {
    try {
      const response = await gradeService.getGrades(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const createGrade = createAsyncThunk(
  'grades/createGrade',
  async (gradeData, { rejectWithValue }) => {
    try {
      const response = await gradeService.createGrade(gradeData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const bulkCreateGrades = createAsyncThunk(
  'grades/bulkCreateGrades',
  async (gradesData, { rejectWithValue }) => {
    try {
      const response = await gradeService.bulkCreateGrades(gradesData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const fetchGradeSummary = createAsyncThunk(
  'grades/fetchGradeSummary',
  async ({ classId, subjectId }, { rejectWithValue }) => {
    try {
      const response = await gradeService.getGradeSummary(classId, subjectId)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const calculateFinalGrades = createAsyncThunk(
  'grades/calculateFinalGrades',
  async ({ classId, subjectId }, { rejectWithValue }) => {
    try {
      const response = await gradeService.calculateFinalGrades(classId, subjectId)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

const initialState = {
  subjects: [],
  grades: [],
  gradeSummary: null,
  isLoading: false,
  error: null,
  pagination: {
    count: 0,
    next: null,
    previous: null,
  },
}

const gradeSlice = createSlice({
  name: 'grades',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearGradeSummary: (state) => {
      state.gradeSummary = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch subjects
      .addCase(fetchSubjects.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.isLoading = false
        state.subjects = action.payload.results || action.payload
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Create subject
      .addCase(createSubject.fulfilled, (state, action) => {
        state.subjects.unshift(action.payload)
      })
      // Fetch grades
      .addCase(fetchGrades.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchGrades.fulfilled, (state, action) => {
        state.isLoading = false
        state.grades = action.payload.results || action.payload
        if (action.payload.count) {
          state.pagination = {
            count: action.payload.count,
            next: action.payload.next,
            previous: action.payload.previous,
          }
        }
      })
      .addCase(fetchGrades.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Create grade
      .addCase(createGrade.fulfilled, (state, action) => {
        state.grades.unshift(action.payload)
      })
      // Bulk create grades
      .addCase(bulkCreateGrades.fulfilled, (state, action) => {
        state.grades.unshift(...action.payload.created_grades)
      })
      // Fetch grade summary
      .addCase(fetchGradeSummary.fulfilled, (state, action) => {
        state.gradeSummary = action.payload
      })
      // Calculate final grades
      .addCase(calculateFinalGrades.fulfilled, (state, action) => {
        state.gradeSummary = action.payload
      })
  },
})

export const { clearError, clearGradeSummary } = gradeSlice.actions
export default gradeSlice.reducer
