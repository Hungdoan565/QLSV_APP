import apiService from './apiService'

const studentService = {
  getStudents: (params) => apiService.axiosInstance.get('/students/', { params }),
  getStudent: (id) => apiService.axiosInstance.get(`/students/${id}/`),
  createStudent: (studentData) => apiService.axiosInstance.post('/students/', studentData),
  updateStudent: (id, studentData) => apiService.axiosInstance.put(`/students/${id}/`, studentData),
  deleteStudent: (id) => apiService.axiosInstance.delete(`/students/${id}/`),
  importStudents: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiService.axiosInstance.post('/students/import-excel/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  exportStudents: (params) => apiService.axiosInstance.get('/students/export-excel/', { 
    params,
    responseType: 'blob'
  }),
  getStudentStatistics: () => apiService.axiosInstance.get('/students/statistics/'),
}

export default studentService
