import api from './api'

const studentService = {
  getStudents: (params) => api.get('/students/', { params }),
  getStudent: (id) => api.get(`/students/${id}/`),
  createStudent: (studentData) => api.post('/students/', studentData),
  updateStudent: (id, studentData) => api.put(`/students/${id}/`, studentData),
  deleteStudent: (id) => api.delete(`/students/${id}/`),
  importStudents: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/students/import-excel/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  exportStudents: (params) => api.get('/students/export-excel/', { 
    params,
    responseType: 'blob'
  }),
  getStudentStatistics: () => api.get('/students/statistics/'),
}

export default studentService
