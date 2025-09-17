import api from './api'

const gradeService = {
  // Subjects
  getSubjects: (params) => api.get('/grades/subjects/', { params }),
  getSubject: (id) => api.get(`/grades/subjects/${id}/`),
  createSubject: (subjectData) => api.post('/grades/subjects/', subjectData),
  updateSubject: (id, subjectData) => api.put(`/grades/subjects/${id}/`, subjectData),
  deleteSubject: (id) => api.delete(`/grades/subjects/${id}/`),
  
  // Grades
  getGrades: (params) => api.get('/grades/', { params }),
  getGrade: (id) => api.get(`/grades/${id}/`),
  createGrade: (gradeData) => api.post('/grades/', gradeData),
  updateGrade: (id, gradeData) => api.put(`/grades/${id}/`, gradeData),
  deleteGrade: (id) => api.delete(`/grades/${id}/`),
  bulkCreateGrades: (gradesData) => api.post('/grades/bulk-create/', gradesData),
  
  // Grade summaries
  getGradeSummary: (classId, subjectId) => api.get(`/grades/summary/${classId}/${subjectId}/`),
  calculateFinalGrades: (classId, subjectId) => api.post(`/grades/calculate/${classId}/${subjectId}/`),
  exportGrades: (classId, subjectId) => api.get(`/grades/export/${classId}/${subjectId}/`, {
    responseType: 'blob'
  }),
}

export default gradeService
