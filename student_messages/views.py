from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Message
from .serializers import MessageSerializer, MessageCreateSerializer


class MessageViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = MessageSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'student':
            return Message.objects.filter(student=user)
        elif user.role == 'professor':
            return Message.objects.filter(professor=user) | Message.objects.filter(professor__isnull=True)
        return Message.objects.none()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return MessageCreateSerializer
        return MessageSerializer
    
    def perform_create(self, serializer):
        """Create message from student"""
        if self.request.user.role != 'student':
            raise PermissionError("Only students can send messages")
        serializer.save(student=self.request.user)
    
    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Mark message as read"""
        message = self.get_object()
        if request.user.role != 'professor':
            return Response({'error': 'Only professors can mark messages as read'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        message.is_read = True
        message.save()
        return Response({'status': 'Message marked as read'})
    
    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        """Get count of unread messages"""
        if request.user.role != 'professor':
            return Response({'error': 'Only professors can check unread count'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        count = Message.objects.filter(
            professor=request.user,
            is_read=False
        ).count() + Message.objects.filter(
            professor__isnull=True,
            is_read=False
        ).count()
        
        return Response({'count': count})
