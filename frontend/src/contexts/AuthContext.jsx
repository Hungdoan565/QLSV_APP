import React, { createContext, useContext, useState, useEffect } from 'react';
import APIService from '../services/apiService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Initialize authentication state on app load
  useEffect(() => {
    initializeAuth();
  }, []);
  const initializeAuth = async () => {
    try {
      setLoading(true);
      
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (accessToken && refreshToken) {
        // Try to get user profile to verify token validity
        const userProfile = await APIService.getUserProfile();
        setUser(userProfile);
      }
    } catch (error) {
      console.warn('Auth initialization failed:', error.message);
      // If token verification fails, clear stored tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };
  const login = async (email, password) => {
    try {
      const response = await APIService.login(email, password);
      
      if (response.success) {
        // Store tokens in localStorage
        localStorage.setItem('accessToken', response.data.tokens.access);
        localStorage.setItem('refreshToken', response.data.tokens.refresh);
        
        setUser(response.user);
        
        return {
          success: true,
          user: response.user,
          requireApproval: response.user?.account_status === 'pending',
          message: response.message || 'Đăng nhập thành công!'
        };
      } else {
        return {
          success: false,
          message: response.error?.message || 'Đăng nhập thất bại'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Đăng nhập thất bại'
      };
    }
  };
  const register = async (userData) => {
    try {
      const response = await APIService.register(userData);
      
      if (response.success) {
        // Store tokens in localStorage
        localStorage.setItem('accessToken', response.data.tokens.access);
        localStorage.setItem('refreshToken', response.data.tokens.refresh);
        
        setUser(response.user);
        
        return {
          success: true,
          user: response.user,
          requireApproval: response.requireApproval,
          message: response.message || 'Đăng ký thành công!'
        };
      } else {
        return {
          success: false,
          message: response.error?.message || 'Đăng ký thất bại'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Đăng ký thất bại'
      };
    }
  };

  const logout = async () => {
    try {
      await APIService.logout();
    } catch (error) {
      // Even if logout request fails, clear local state
      console.error('Logout error:', error);
    } finally {
      // Clear tokens and user state
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const updatedUser = await APIService.updateProfile(profileData);
      setUser(updatedUser);
      return {
        success: true,
        user: updatedUser,
        message: 'Cập nhật thông tin thành công!'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Cập nhật thông tin thất bại'
      };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await APIService.changePassword(currentPassword, newPassword);
      return {
        success: true,
        message: 'Đổi mật khẩu thành công!'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Đổi mật khẩu thất bại'
      };
    }
  };

  // Helper functions to check user role and permissions
  const isAuthenticated = () => {
    return !!user && user.account_status === 'active';
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isTeacher = () => {
    return user?.role === 'teacher';
  };

  const isStudent = () => {
    return user?.role === 'student';
  };

  const hasPermission = (requiredRole) => {
    if (!isAuthenticated()) return false;
    
    const roleHierarchy = {
      'admin': 3,
      'teacher': 2,
      'student': 1
    };
    
    const userLevel = roleHierarchy[user.role] || 0;
    const requiredLevel = roleHierarchy[requiredRole] || 0;
    
    return userLevel >= requiredLevel;
  };

  const canAccessAdmin = () => {
    return isAuthenticated() && isAdmin();
  };

  const canAccessTeacher = () => {
    return isAuthenticated() && (isAdmin() || isTeacher());
  };

  const value = {
    // State
    user,
    loading,
    initialized,
    
    // Authentication methods
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    
    // Permission helpers
    isAuthenticated,
    isAdmin,
    isTeacher,
    isStudent,
    hasPermission,
    canAccessAdmin,
    canAccessTeacher,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
