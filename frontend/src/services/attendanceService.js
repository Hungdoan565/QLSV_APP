import api from './api'

const attendanceService = {
  // Attendance sessions
  getSessions: (params) => api.get('/attendance/sessions/', { params }),
  getSession: (id) => api.get(`/attendance/sessions/${id}/`),
  createSession: (sessionData) => api.post('/attendance/sessions/', sessionData),
  updateSession: (id, sessionData) => api.put(`/attendance/sessions/${id}/`, sessionData),
  deleteSession: (id) => api.delete(`/attendance/sessions/${id}/`),
  
  // QR Code functionality
  generateQRCode: (sessionId) => api.post(`/attendance/sessions/${sessionId}/generate-qr/`),
  checkInWithQR: (qrData) => api.post('/attendance/check-in-qr/', qrData),
  getAttendanceAnalytics: (sessionId) => api.get(`/attendance/sessions/${sessionId}/analytics/`),
  
  // Attendance records
  getAttendances: (params) => api.get('/attendance/', { params }),
  getAttendance: (id) => api.get(`/attendance/${id}/`),
  createAttendance: (attendanceData) => api.post('/attendance/', attendanceData),
  updateAttendance: (id, attendanceData) => api.put(`/attendance/${id}/`, attendanceData),
  deleteAttendance: (id) => api.delete(`/attendance/${id}/`),
  
  // Statistics and export
  getAttendanceStatistics: () => api.get('/attendance/statistics/'),
  exportAttendance: (params) => api.get('/attendance/export/', { 
    params,
    responseType: 'blob' 
  }),
}

export default attendanceService
