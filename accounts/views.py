from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
from .serializers import StudentSignupSerializer, ProfessorLoginSerializer, UserSerializer

User = get_user_model()


@api_view(['POST'])
@permission_classes([AllowAny])
def student_signup(request):
    serializer = StudentSignupSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def professor_login(request):
    serializer = ProfessorLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = authenticate(
            username=serializer.validated_data['username'],
            password=serializer.validated_data['password']
        )
        
        if user and user.role == 'professor':
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        return Response({'error': 'Invalid credentials or not a professor'}, status=status.HTTP_401_UNAUTHORIZED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def student_login(request):
    serializer = ProfessorLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = authenticate(
            username=serializer.validated_data['username'],
            password=serializer.validated_data['password']
        )
        
        if user and user.role == 'student':
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        return Response({'error': 'Invalid credentials or not a student'}, status=status.HTTP_401_UNAUTHORIZED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_student_count(request):
    """Get total number of students"""
    if request.user.role != 'professor':
        return Response({'error': 'Only professors can access this'}, status=status.HTTP_403_FORBIDDEN)
    
    count = User.objects.filter(role='student').count()
    return Response({'count': count})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_students(request):
    """Get all students with their details"""
    if request.user.role != 'professor':
        return Response({'error': 'Only professors can access this'}, status=status.HTTP_403_FORBIDDEN)
    
    from swot.models import SWOTAnalysis
    from exams.models import StudentExam
    
    students = User.objects.filter(role='student').order_by('full_name')
    
    students_data = []
    for student in students:
        # Calculate average score from submitted exams
        submitted_exams = StudentExam.objects.filter(
            student=student,
            status__in=['submitted', 'graded'],
            score__isnull=False
        )
        
        if submitted_exams.exists():
            total_score = sum(exam.score for exam in submitted_exams if exam.score)
            total_possible = sum(exam.exam.total_marks for exam in submitted_exams)
            average = round((total_score / total_possible) * 20, 2) if total_possible > 0 else 0
        else:
            average = None
        
        # Check if student has SWOT analysis
        has_swot = SWOTAnalysis.objects.filter(student=student, is_completed=True).exists()
        
        students_data.append({
            'id': student.id,
            'name': student.full_name or f"{student.first_name} {student.last_name}" or student.username,
            'student_id': student.student_id or '-',
            'average': average,
            'has_swot': has_swot,
            'exam_count': submitted_exams.count(),
        })
    
    return Response(students_data)
