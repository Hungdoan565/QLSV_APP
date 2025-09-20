"""
WebSocket Consumer for Real-time Attendance Updates
Senior-level implementation with authentication and error handling
"""
import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from django.core.exceptions import ObjectDoesNotExist
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.conf import settings

logger = logging.getLogger(__name__)

class AttendanceConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for real-time attendance updates
    Features:
    - JWT authentication
    - Room-based subscriptions
    - Real-time notifications
    - Error handling and logging
    """
    
    async def connect(self):
        """Handle WebSocket connection"""
        try:
            # Extract token from query parameters
            token = self.scope.get('query_string', b'').decode().split('token=')[-1].split('&')[0]
            
            if not token:
                await self.close(code=4001, reason="No authentication token provided")
                return
            
            # Authenticate user
            user = await self.authenticate_user(token)
            if not user or user.is_anonymous:
                await self.close(code=4001, reason="Invalid authentication token")
                return
            
            self.user = user
            self.user_id = user.id
            self.user_role = getattr(user, 'role', 'student')
            
            # Accept connection
            await self.accept()
            
            # Join user-specific room
            await self.channel_layer.group_add(
                f"user_{self.user_id}",
                self.channel_name
            )
            
            # Join role-specific room
            await self.channel_layer.group_add(
                f"role_{self.user_role}",
                self.channel_name
            )
            
            logger.info(f"WebSocket connected: User {self.user_id} ({self.user_role})")
            
            # Send welcome message
            await self.send(text_data=json.dumps({
                'type': 'connection_established',
                'message': 'Connected to real-time updates',
                'user_id': self.user_id,
                'user_role': self.user_role,
                'timestamp': self.get_timestamp()
            }))
            
        except Exception as e:
            logger.error(f"WebSocket connection error: {e}")
            await self.close(code=4000, reason="Connection error")
    
    async def disconnect(self, close_code):
        """Handle WebSocket disconnection"""
        try:
            if hasattr(self, 'user_id'):
                # Leave user-specific room
                await self.channel_layer.group_discard(
                    f"user_{self.user_id}",
                    self.channel_name
                )
                
                # Leave role-specific room
                await self.channel_layer.group_discard(
                    f"role_{self.user_role}",
                    self.channel_name
                )
                
                logger.info(f"WebSocket disconnected: User {self.user_id}")
        except Exception as e:
            logger.error(f"WebSocket disconnection error: {e}")
    
    async def receive(self, text_data):
        """Handle incoming WebSocket messages"""
        try:
            data = json.loads(text_data)
            message_type = data.get('type')
            
            if message_type == 'subscribe_session':
                await self.handle_subscribe_session(data)
            elif message_type == 'unsubscribe_session':
                await self.handle_unsubscribe_session(data)
            elif message_type == 'ping':
                await self.send_pong()
            else:
                await self.send_error(f"Unknown message type: {message_type}")
                
        except json.JSONDecodeError:
            await self.send_error("Invalid JSON format")
        except Exception as e:
            logger.error(f"WebSocket receive error: {e}")
            await self.send_error("Message processing error")
    
    async def handle_subscribe_session(self, data):
        """Handle session subscription"""
        try:
            session_id = data.get('session_id')
            if not session_id:
                await self.send_error("Session ID is required")
                return
            
            # Verify user has access to this session
            has_access = await self.verify_session_access(session_id)
            if not has_access:
                await self.send_error("Access denied to this session")
                return
            
            # Join session room
            room_name = f"session_{session_id}"
            await self.channel_layer.group_add(room_name, self.channel_name)
            
            await self.send(text_data=json.dumps({
                'type': 'subscription_confirmed',
                'session_id': session_id,
                'message': f'Subscribed to session {session_id}',
                'timestamp': self.get_timestamp()
            }))
            
            logger.info(f"User {self.user_id} subscribed to session {session_id}")
            
        except Exception as e:
            logger.error(f"Session subscription error: {e}")
            await self.send_error("Subscription failed")
    
    async def handle_unsubscribe_session(self, data):
        """Handle session unsubscription"""
        try:
            session_id = data.get('session_id')
            if not session_id:
                await self.send_error("Session ID is required")
                return
            
            # Leave session room
            room_name = f"session_{session_id}"
            await self.channel_layer.group_discard(room_name, self.channel_name)
            
            await self.send(text_data=json.dumps({
                'type': 'unsubscription_confirmed',
                'session_id': session_id,
                'message': f'Unsubscribed from session {session_id}',
                'timestamp': self.get_timestamp()
            }))
            
            logger.info(f"User {self.user_id} unsubscribed from session {session_id}")
            
        except Exception as e:
            logger.error(f"Session unsubscription error: {e}")
            await self.send_error("Unsubscription failed")
    
    async def send_pong(self):
        """Send pong response to ping"""
        await self.send(text_data=json.dumps({
            'type': 'pong',
            'timestamp': self.get_timestamp()
        }))
    
    async def send_error(self, message):
        """Send error message to client"""
        await self.send(text_data=json.dumps({
            'type': 'error',
            'message': message,
            'timestamp': self.get_timestamp()
        }))
    
    # WebSocket event handlers for different message types
    async def attendance_update(self, event):
        """Handle attendance update messages"""
        await self.send(text_data=json.dumps({
            'type': 'attendance_update',
            'data': event['data'],
            'timestamp': self.get_timestamp()
        }))
    
    async def session_status_update(self, event):
        """Handle session status update messages"""
        await self.send(text_data=json.dumps({
            'type': 'session_status_update',
            'data': event['data'],
            'timestamp': self.get_timestamp()
        }))
    
    async def qr_code_update(self, event):
        """Handle QR code update messages"""
        await self.send(text_data=json.dumps({
            'type': 'qr_code_update',
            'data': event['data'],
            'timestamp': self.get_timestamp()
        }))
    
    async def notification(self, event):
        """Handle notification messages"""
        await self.send(text_data=json.dumps({
            'type': 'notification',
            'data': event['data'],
            'timestamp': self.get_timestamp()
        }))
    
    # Helper methods
    @database_sync_to_async
    def authenticate_user(self, token):
        """Authenticate user from JWT token"""
        try:
            access_token = AccessToken(token)
            user_id = access_token['user_id']
            
            from django.contrib.auth import get_user_model
            User = get_user_model()
            user = User.objects.get(id=user_id)
            
            return user
            
        except (InvalidToken, TokenError, ObjectDoesNotExist) as e:
            logger.warning(f"Authentication failed: {e}")
            return AnonymousUser()
    
    @database_sync_to_async
    def verify_session_access(self, session_id):
        """Verify user has access to session"""
        try:
            from apps.attendance.models import AttendanceSession
            from apps.classes.models import ClassInstance
            
            session = AttendanceSession.objects.select_related('class_obj').get(id=session_id)
            
            # Teachers can access their own sessions
            if self.user_role == 'teacher' and session.class_obj.teacher == self.user:
                return True
            
            # Students can access sessions for classes they're enrolled in
            if self.user_role == 'student':
                return session.class_obj.students.filter(id=self.user.id).exists()
            
            # Admins can access all sessions
            if self.user_role == 'admin':
                return True
            
            return False
            
        except ObjectDoesNotExist:
            return False
        except Exception as e:
            logger.error(f"Session access verification error: {e}")
            return False
    
    def get_timestamp(self):
        """Get current timestamp"""
        from django.utils import timezone
        return timezone.now().isoformat()


class NotificationConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for system-wide notifications
    """
    
    async def connect(self):
        """Handle WebSocket connection for notifications"""
        try:
            # Extract token from query parameters
            token = self.scope.get('query_string', b'').decode().split('token=')[-1].split('&')[0]
            
            if not token:
                await self.close(code=4001, reason="No authentication token provided")
                return
            
            # Authenticate user
            user = await self.authenticate_user(token)
            if not user or user.is_anonymous:
                await self.close(code=4001, reason="Invalid authentication token")
                return
            
            self.user = user
            self.user_id = user.id
            
            # Accept connection
            await self.accept()
            
            # Join notification room
            await self.channel_layer.group_add(
                f"notifications_{self.user_id}",
                self.channel_name
            )
            
            logger.info(f"Notification WebSocket connected: User {self.user_id}")
            
        except Exception as e:
            logger.error(f"Notification WebSocket connection error: {e}")
            await self.close(code=4000, reason="Connection error")
    
    async def disconnect(self, close_code):
        """Handle WebSocket disconnection"""
        try:
            if hasattr(self, 'user_id'):
                await self.channel_layer.group_discard(
                    f"notifications_{self.user_id}",
                    self.channel_name
                )
                
                logger.info(f"Notification WebSocket disconnected: User {self.user_id}")
        except Exception as e:
            logger.error(f"Notification WebSocket disconnection error: {e}")
    
    async def receive(self, text_data):
        """Handle incoming messages"""
        try:
            data = json.loads(text_data)
            message_type = data.get('type')
            
            if message_type == 'ping':
                await self.send(text_data=json.dumps({
                    'type': 'pong',
                    'timestamp': self.get_timestamp()
                }))
            else:
                await self.send(text_data=json.dumps({
                    'type': 'error',
                    'message': 'Unknown message type',
                    'timestamp': self.get_timestamp()
                }))
                
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Invalid JSON format',
                'timestamp': self.get_timestamp()
            }))
    
    async def notification_message(self, event):
        """Handle notification messages"""
        await self.send(text_data=json.dumps({
            'type': 'notification',
            'data': event['data'],
            'timestamp': self.get_timestamp()
        }))
    
    @database_sync_to_async
    def authenticate_user(self, token):
        """Authenticate user from JWT token"""
        try:
            access_token = AccessToken(token)
            user_id = access_token['user_id']
            
            from django.contrib.auth import get_user_model
            User = get_user_model()
            user = User.objects.get(id=user_id)
            
            return user
            
        except (InvalidToken, TokenError, ObjectDoesNotExist) as e:
            logger.warning(f"Notification authentication failed: {e}")
            return AnonymousUser()
    
    def get_timestamp(self):
        """Get current timestamp"""
        from django.utils import timezone
        return timezone.now().isoformat()
