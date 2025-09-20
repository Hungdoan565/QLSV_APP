/**
 * QR Code Service for Frontend
 * Senior-level implementation with error handling and security
 */
import apiService from '../apiService';

class QRCodeService {
  /**
   * Generate QR code for attendance session
   * @param {Object} data - Session data
   * @param {number} data.session_id - Session ID
   * @param {string} data.session_name - Optional session name
   * @returns {Promise<Object>} QR code data
   */
  static async generateQRCode(data) {
    try {
      const response = await apiService.post('/attendance/generate-qr/', data);
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to generate QR code');
      }
      
      return {
        success: true,
        qrCode: response.data.qr_code,
        token: response.data.token,
        sessionId: response.data.session_id,
        expiresInMinutes: response.data.expires_in_minutes,
        sessionInfo: response.data.session_info
      };
    } catch (error) {
      console.error('QR Code generation failed:', error);
      throw new Error(
        error.response?.data?.error || 
        error.message || 
        'Failed to generate QR code'
      );
    }
  }

  /**
   * Validate QR code and check in student
   * @param {Object} data - Validation data
   * @param {string} data.qr_token - QR token from scanned code
   * @param {number} data.student_id - Student ID
   * @returns {Promise<Object>} Check-in result
   */
  static async validateQRCode(data) {
    try {
      const response = await apiService.post('/attendance/validate-qr/', data);
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'QR validation failed');
      }
      
      return {
        success: true,
        message: response.data.message,
        attendanceId: response.data.attendance_id,
        sessionInfo: response.data.session_info,
        checkInTime: response.data.check_in_time,
        isLate: response.data.is_late
      };
    } catch (error) {
      console.error('QR Code validation failed:', error);
      throw new Error(
        error.response?.data?.error || 
        error.message || 
        'Failed to validate QR code'
      );
    }
  }

  /**
   * Get QR code status for a session
   * @param {number} sessionId - Session ID
   * @returns {Promise<Object>} QR status data
   */
  static async getQRStatus(sessionId) {
    try {
      const response = await apiService.get(`/attendance/qr-status/${sessionId}/`);
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to get QR status');
      }
      
      return {
        success: true,
        qrStatus: response.data.qr_status,
        sessionInfo: response.data.session_info
      };
    } catch (error) {
      console.error('Get QR status failed:', error);
      throw new Error(
        error.response?.data?.error || 
        error.message || 
        'Failed to get QR status'
      );
    }
  }

  /**
   * Revoke QR code for a session
   * @param {number} sessionId - Session ID
   * @returns {Promise<Object>} Revoke result
   */
  static async revokeQRCode(sessionId) {
    try {
      const response = await apiService.post(`/attendance/revoke-qr/${sessionId}/`);
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to revoke QR code');
      }
      
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.error('Revoke QR code failed:', error);
      throw new Error(
        error.response?.data?.error || 
        error.message || 
        'Failed to revoke QR code'
      );
    }
  }

  /**
   * Parse QR code data from scanned result
   * @param {string} qrData - Raw QR code data
   * @returns {Object} Parsed QR data
   */
  static parseQRData(qrData) {
    try {
      const parsed = JSON.parse(qrData);
      
      // Validate QR code structure
      if (!parsed.type || parsed.type !== 'attendance_checkin') {
        throw new Error('Invalid QR code type');
      }
      
      if (!parsed.token) {
        throw new Error('Missing QR token');
      }
      
      // Check expiration
      if (parsed.expires_at) {
        const expiresAt = new Date(parsed.expires_at);
        const now = new Date();
        
        if (now > expiresAt) {
          throw new Error('QR code has expired');
        }
      }
      
      return {
        valid: true,
        type: parsed.type,
        token: parsed.token,
        sessionId: parsed.session_id,
        sessionName: parsed.session_name,
        generatedAt: parsed.generated_at,
        expiresAt: parsed.expires_at
      };
    } catch (error) {
      console.error('QR code parsing failed:', error);
      throw new Error('Invalid QR code format');
    }
  }

  /**
   * Format time remaining for display
   * @param {string} expiresAt - Expiration timestamp
   * @returns {string} Formatted time remaining
   */
  static formatTimeRemaining(expiresAt) {
    try {
      const expires = new Date(expiresAt);
      const now = new Date();
      const diffMs = expires - now;
      
      if (diffMs <= 0) {
        return 'Expired';
      }
      
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffSecs = Math.floor((diffMs % (1000 * 60)) / 1000);
      
      if (diffMins > 0) {
        return `${diffMins}m ${diffSecs}s`;
      } else {
        return `${diffSecs}s`;
      }
    } catch (error) {
      return 'Unknown';
    }
  }

  /**
   * Check if QR code is expired
   * @param {string} expiresAt - Expiration timestamp
   * @returns {boolean} True if expired
   */
  static isExpired(expiresAt) {
    try {
      const expires = new Date(expiresAt);
      const now = new Date();
      return now > expires;
    } catch (error) {
      return true; // Assume expired if can't parse
    }
  }
}

export default QRCodeService;
