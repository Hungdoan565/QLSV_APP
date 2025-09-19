import api from './api'

const classService = {
  // Classes CRUD
  getClasses: (params) => api.get('/classes/', { params }),
  getClass: (id) => api.get(`/classes/${id}/`),
  createClass: (classData) => api.post('/classes/', classData),
  updateClass: (id, classData) => api.put(`/classes/${id}/`, classData),
  deleteClass: (id) => api.delete(`/classes/${id}/`),
  
  // Student management
  getClassStudents: (classId) => api.get(`/classes/${classId}/students/`),
  addStudentToClass: (classId, studentId) => api.post(`/classes/${classId}/students/`, { student_id: studentId }),
  removeStudentFromClass: (classId, studentId) => api.delete(`/classes/${classId}/students/${studentId}/remove/`),
  getAvailableStudents: (classId) => api.get(`/classes/${classId}/available-students/`),
  
  // Statistics and analytics
  getClassStatistics: () => api.get('/classes/statistics/'),
}

export default classService
