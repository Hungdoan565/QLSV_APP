import api from './api'

const gradeService = {
  // Grades CRUD
  getGrades: (params) => api.get('/grades/', { params }),
  getGrade: (id) => api.get(`/grades/${id}/`),
  createGrade: (gradeData) => api.post('/grades/', gradeData),
  updateGrade: (id, gradeData) => api.put(`/grades/${id}/`, gradeData),
  deleteGrade: (id) => api.delete(`/grades/${id}/`),
  
  // Grade calculations and summaries
  getGradeStatistics: () => api.get('/grades/statistics/'),
  getStudentGradeSummary: (studentId) => api.get(`/grades/student/${studentId}/summary/`),
  getClassGradeSummary: (classId) => api.get(`/grades/class/${classId}/summary/`),
  
  // Export functionality
  exportGrades: (params) => api.get('/grades/export/', { 
    params,
    responseType: 'blob' 
  }),
}

export default gradeService
