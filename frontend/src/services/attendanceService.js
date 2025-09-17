import api from './api'

const attendanceService = {
  // Attendance sessions
  getSessions: (params) => api.get('/attendance/sessions/', { params }),
  getSession: (id) => api.get(`/attendance/sessions/${id}/`),
  createSession: (sessionData) => api.post('/attendance/sessions/', sessionData),
  updateSession: (id, sessionData) => api.put(`/attendance/sessions/${id}/`, sessionData),
  deleteSession: (id) => api.delete(`/attendance/sessions/${id}/`),
  generateQRCode: (sessionId) => api.get(`/attendance/sessions/${sessionId}/qr-code/`, {
    responseType: 'blob'
  }),
  
  // Attendance records
  getAttendances: (params) => api.get('/attendance/', { params }),
  getAttendance: (id) => api.get(`/attendance/${id}/`),
  createAttendance: (attendanceData) => api.post('/attendance/', attendanceData),
  updateAttendance: (id, attendanceData) => api.put(`/attendance/${id}/`, attendanceData),
  deleteAttendance: (id) => api.delete(`/attendance/${id}/`),
  bulkCreateAttendance: (attendanceData) => api.post('/attendance/bulk-create/', attendanceData),
  checkInWithQR: (qrData) => api.post('/attendance/check-in-qr/', qrData),
  
  // Attendance summaries
  getAttendanceSummary: (classId) => api.get(`/attendance/summary/${classId}/`),
  calculateAttendanceSummary: (classId) => api.post(`/attendance/calculate/${classId}/`),
  exportAttendance: (classId) => api.get(`/attendance/export/${classId}/`, {
    responseType: 'blob'
  }),
}

export default attendanceService
