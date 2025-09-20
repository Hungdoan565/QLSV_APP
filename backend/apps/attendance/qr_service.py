"""
QR Code Service for Attendance Management
Senior-level implementation with security and validation
"""
import qrcode
import json
import hashlib
import hmac
import time
from datetime import datetime, timedelta
from django.conf import settings
from django.core.cache import cache
from django.utils import timezone
from io import BytesIO
import base64
from typing import Dict, Optional, Tuple
import logging

logger = logging.getLogger(__name__)

class QRCodeService:
    """
    Enterprise-grade QR Code service for attendance management
    Features:
    - Secure token generation with HMAC
    - Time-based expiration
    - Session validation
    - Rate limiting protection
    """
    
    # Security constants
    QR_SECRET_KEY = getattr(settings, 'QR_SECRET_KEY', 'default-secret-key-change-in-production')
    QR_EXPIRY_MINUTES = 30  # QR codes expire in 30 minutes
    QR_RATE_LIMIT_WINDOW = 60  # Rate limit window in seconds
    QR_MAX_ATTEMPTS = 5  # Max attempts per window
    
    @classmethod
    def generate_session_token(cls, session_id: int, teacher_id: int) -> str:
        """
        Generate secure session token for QR code
        
        Args:
            session_id: Attendance session ID
            teacher_id: Teacher ID who created the session
            
        Returns:
            Secure token string
        """
        try:
            # Create payload with timestamp
            payload = {
                'session_id': session_id,
                'teacher_id': teacher_id,
                'timestamp': int(time.time()),
                'nonce': cls._generate_nonce()
            }
            
            # Create HMAC signature
            message = json.dumps(payload, sort_keys=True)
            signature = hmac.new(
                cls.QR_SECRET_KEY.encode(),
                message.encode(),
                hashlib.sha256
            ).hexdigest()
            
            # Combine payload and signature
            token_data = {
                'payload': payload,
                'signature': signature
            }
            
            # Encode as base64 for QR code
            token = base64.b64encode(
                json.dumps(token_data).encode()
            ).decode()
            
            logger.info(f"Generated QR token for session {session_id}")
            return token
            
        except Exception as e:
            logger.error(f"Error generating QR token: {e}")
            raise ValueError("Failed to generate QR token")
    
    @classmethod
    def generate_qr_code(cls, session_id: int, teacher_id: int, 
                       session_name: str = None) -> Tuple[str, str]:
        """
        Generate QR code image and token
        
        Args:
            session_id: Attendance session ID
            teacher_id: Teacher ID
            session_name: Optional session name for display
            
        Returns:
            Tuple of (qr_code_base64, token)
        """
        try:
            # Generate secure token
            token = cls.generate_session_token(session_id, teacher_id)
            
            # Create QR code data
            qr_data = {
                'type': 'attendance_checkin',
                'token': token,
                'session_id': session_id,
                'session_name': session_name or f"Session {session_id}",
                'generated_at': datetime.now().isoformat(),
                'expires_at': (datetime.now() + timedelta(minutes=cls.QR_EXPIRY_MINUTES)).isoformat()
            }
            
            # Generate QR code image
            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_L,
                box_size=10,
                border=4,
            )
            qr.add_data(json.dumps(qr_data))
            qr.make(fit=True)
            
            # Create image
            img = qr.make_image(fill_color="black", back_color="white")
            
            # Convert to base64
            buffer = BytesIO()
            img.save(buffer, format='PNG')
            img_str = base64.b64encode(buffer.getvalue()).decode()
            
            # Cache the token for validation
            cache_key = f"qr_token_{session_id}_{teacher_id}"
            cache.set(cache_key, token, timeout=cls.QR_EXPIRY_MINUTES * 60)
            
            logger.info(f"Generated QR code for session {session_id}")
            return img_str, token
            
        except Exception as e:
            logger.error(f"Error generating QR code: {e}")
            raise ValueError("Failed to generate QR code")
    
    @classmethod
    def validate_qr_token(cls, token: str) -> Dict:
        """
        Validate QR token and return session data
        
        Args:
            token: QR token to validate
            
        Returns:
            Dict with validation result and session data
            
        Raises:
            ValueError: If token is invalid or expired
        """
        try:
            # Decode token
            token_data = json.loads(base64.b64decode(token).decode())
            payload = token_data['payload']
            signature = token_data['signature']
            
            # Verify signature
            message = json.dumps(payload, sort_keys=True)
            expected_signature = hmac.new(
                cls.QR_SECRET_KEY.encode(),
                message.encode(),
                hashlib.sha256
            ).hexdigest()
            
            if not hmac.compare_digest(signature, expected_signature):
                raise ValueError("Invalid token signature")
            
            # Check expiration
            token_timestamp = payload['timestamp']
            current_timestamp = int(time.time())
            
            if current_timestamp - token_timestamp > cls.QR_EXPIRY_MINUTES * 60:
                raise ValueError("Token expired")
            
            # Check rate limiting
            if not cls._check_rate_limit(payload['session_id']):
                raise ValueError("Rate limit exceeded")
            
            logger.info(f"Validated QR token for session {payload['session_id']}")
            return {
                'valid': True,
                'session_id': payload['session_id'],
                'teacher_id': payload['teacher_id'],
                'timestamp': token_timestamp,
                'expires_at': token_timestamp + (cls.QR_EXPIRY_MINUTES * 60)
            }
            
        except Exception as e:
            logger.warning(f"QR token validation failed: {e}")
            raise ValueError(f"Invalid QR token: {str(e)}")
    
    @classmethod
    def _generate_nonce(cls) -> str:
        """Generate cryptographically secure nonce"""
        import secrets
        return secrets.token_hex(16)
    
    @classmethod
    def _check_rate_limit(cls, session_id: int) -> bool:
        """
        Check rate limiting for QR code generation
        
        Args:
            session_id: Session ID
            
        Returns:
            True if within rate limit, False otherwise
        """
        cache_key = f"qr_rate_limit_{session_id}"
        attempts = cache.get(cache_key, 0)
        
        if attempts >= cls.QR_MAX_ATTEMPTS:
            return False
        
        cache.set(cache_key, attempts + 1, timeout=cls.QR_RATE_LIMIT_WINDOW)
        return True
    
    @classmethod
    def revoke_qr_token(cls, session_id: int, teacher_id: int) -> bool:
        """
        Revoke QR token for a session
        
        Args:
            session_id: Session ID
            teacher_id: Teacher ID
            
        Returns:
            True if revoked successfully
        """
        try:
            cache_key = f"qr_token_{session_id}_{teacher_id}"
            cache.delete(cache_key)
            
            logger.info(f"Revoked QR token for session {session_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error revoking QR token: {e}")
            return False
    
    @classmethod
    def get_qr_status(cls, session_id: int, teacher_id: int) -> Dict:
        """
        Get QR code status for a session
        
        Args:
            session_id: Session ID
            teacher_id: Teacher ID
            
        Returns:
            Dict with QR status information
        """
        cache_key = f"qr_token_{session_id}_{teacher_id}"
        token = cache.get(cache_key)
        
        if not token:
            return {
                'active': False,
                'message': 'No active QR code for this session'
            }
        
        try:
            # Validate existing token
            validation_result = cls.validate_qr_token(token)
            return {
                'active': True,
                'expires_at': validation_result['expires_at'],
                'time_remaining': validation_result['expires_at'] - int(time.time())
            }
        except ValueError:
            return {
                'active': False,
                'message': 'QR code expired or invalid'
            }


class QRCodeValidator:
    """
    QR Code validation service with comprehensive checks
    """
    
    @staticmethod
    def validate_session_access(session_id: int, student_id: int) -> Tuple[bool, str]:
        """
        Validate if student can access the session
        
        Args:
            session_id: Session ID
            student_id: Student ID
            
        Returns:
            Tuple of (is_valid, message)
        """
        try:
            from .models import AttendanceSession, ClassInstance
            
            # Get session
            session = AttendanceSession.objects.select_related('class_obj').get(id=session_id)
            
            # Check if session is active
            if not session.is_active:
                return False, "Session is not active"
            
            # Check if session is not expired
            if session.end_time < timezone.now():
                return False, "Session has ended"
            
            # Check if student is enrolled in the class
            if not session.class_obj.students.filter(id=student_id).exists():
                return False, "Student not enrolled in this class"
            
            return True, "Valid session access"
            
        except AttendanceSession.DoesNotExist:
            return False, "Session not found"
        except Exception as e:
            logger.error(f"Error validating session access: {e}")
            return False, "Validation error"
    
    @staticmethod
    def check_duplicate_checkin(session_id: int, student_id: int) -> Tuple[bool, str]:
        """
        Check if student has already checked in
        
        Args:
            session_id: Session ID
            student_id: Student ID
            
        Returns:
            Tuple of (is_duplicate, message)
        """
        try:
            from .models import Attendance
            
            existing_attendance = Attendance.objects.filter(
                session_id=session_id,
                student_id=student_id
            ).first()
            
            if existing_attendance:
                if existing_attendance.status == 'present':
                    return True, "Student has already checked in"
                elif existing_attendance.status == 'absent':
                    return False, "Student marked absent, can check in"
            
            return False, "No existing attendance record"
            
        except Exception as e:
            logger.error(f"Error checking duplicate checkin: {e}")
            return False, "Check error"
