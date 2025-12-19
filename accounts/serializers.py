from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class StudentSignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    
    class Meta:
        model = User
        fields = ['student_id', 'full_name', 'password']
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['student_id'],
            password=validated_data['password'],
            student_id=validated_data['student_id'],
            full_name=validated_data['full_name'],
            role='student'
        )
        return user


class ProfessorLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'role', 'student_id', 'full_name', 'email']
        read_only_fields = ['id', 'role']
