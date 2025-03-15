from rest_framework import serializers
from .models import CustomUser
from django.contrib.auth.hashers import make_password
import random

class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'display_name', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        validated_data['is_accepted'] = False
        random_num = random.randint(1, 10)
        validated_data['profile_photo'] = f'profile_pics/{random_num}.jpg'
        random_num = random.randint(1, 3)
        validated_data['profile_banner'] = f'profile_banner/{random_num}.jpg'
        return CustomUser.objects.create(**validated_data)
