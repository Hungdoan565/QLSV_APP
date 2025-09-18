import api from './api'

const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login/', credentials)
      return {
        success: true,
        data: response.data,
        user: response.data.user,
        message: response.data.message
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || { message: 'Đăng nhập thất bại' }
      }
    }
  },
  
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register/', userData)
      return {
        success: true,
        data: response.data,
        user: response.data.user,
        message: response.data.message
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || { message: 'Đăng ký thất bại' }
      }
    }
  },
  
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile/')
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || { message: 'Lấy thông tin thất bại' }
      }
    }
  },
  
  updateProfile: (userData) => api.put('/auth/profile/update/', userData),
  changePassword: (passwordData) => api.post('/auth/change-password/', passwordData),
  refreshToken: (refreshToken) => api.post('/auth/token/refresh/', { refresh: refreshToken }),
}

export default authService
