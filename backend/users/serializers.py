from rest_framework import serializers
from .models import CustomUser
from django.contrib.auth.hashers import make_password
import random
import os

DEFAULT_PROFILE_PHOTOS = {f"{i}.jpg" for i in range(1, 11)}   # 1.jpg to 10.jpg
DEFAULT_PROFILE_BANNERS = {f"{i}.jpg" for i in range(1, 8)}


class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'display_name', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        validated_data['is_accepted'] = True
        random_num = random.randint(1, 10)
        validated_data['profile_photo'] = f'profile_pics/{random_num}.jpg'
        random_num = random.randint(1, 7)
        validated_data['profile_banner'] = f'profile_banner/{random_num}.jpg'
        validated_data['privilege'] = "Brahmin"
        return CustomUser.objects.create(**validated_data)


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            "email", "username", "display_name", "tagline", "pronouns", "location",
            "profile_photo", "profile_banner", "github", "linkedin", "portfolio",
            "score", "rank", "privilege", "is_accepted", "date_joined"
        ]


class ProfilePhotoUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['profile_photo']

    def update(self, instance, validated_data):
        old_photo = instance.profile_photo.path if instance.profile_photo else None
        new_photo = validated_data.get('profile_photo', None)

        if new_photo and old_photo and os.path.exists(old_photo):
            old_filename = os.path.basename(old_photo)

            # Prevent deleting default-assigned images
            if old_filename not in DEFAULT_PROFILE_PHOTOS and old_filename != new_photo.name:
                os.remove(old_photo)

        return super().update(instance, validated_data)


class ProfileBannerUpdateSerializer(serializers.ModelSerializer):
    class Meta: 
        model = CustomUser
        fields = ['profile_banner']

    def update(self, instance, validated_data):
        old_banner = instance.profile_banner.path if instance.profile_banner else None
        new_banner = validated_data.get('profile_banner', None)

        if new_banner and old_banner and os.path.exists(old_banner):
            old_filename = os.path.basename(old_banner)

            # Prevent deleting default-assigned images
            if old_filename not in DEFAULT_PROFILE_BANNERS and old_filename != new_banner.name:
                os.remove(old_banner)

        return super().update(instance, validated_data)
    

class ProfileInfoUpdateSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'display_name', 'tagline', 'pronouns', 'location']

    def validate(self, data):
        try:
            user = CustomUser.objects.get(username=data['username'])
            data['user_instance'] = user
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("User not found with the given username.")
        return data

    def update(self, instance, validated_data):
        # username already used for lookup
        instance.display_name = validated_data.get('display_name', instance.display_name)
        instance.tagline = validated_data.get('tagline', instance.tagline)
        instance.pronouns = validated_data.get('pronouns', instance.pronouns)
        instance.location = validated_data.get('location', instance.location)
        instance.save()
        return instance
    

class SocialLinksUpdateSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'github', 'linkedin', 'portfolio']

    def validate(self, data):
        try:
            user = CustomUser.objects.get(username=data['username'])
            data['user_instance'] = user
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("User not found with the given username.")
        return data

    def update(self, instance, validated_data):
        instance.github = validated_data.get('github', instance.github)
        instance.linkedin = validated_data.get('linkedin', instance.linkedin)
        instance.portfolio = validated_data.get('portfolio', instance.portfolio)
        instance.save()
        return instance


class UserSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username','display_name', 'profile_photo', 'score', 'rank']