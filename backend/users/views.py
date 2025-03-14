from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from django.conf import settings
from .models import CustomUser
from .serializers import UserRegistrationSerializer
from rest_framework.decorators import api_view

class UserRegistrationView(APIView):
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            # Send email to admin (you)
            send_mail(
                subject="New User Registration Request",
                message=f"Username: {user.username}\nDisplay Name: {user.display_name}\nEmail: {user.email}",
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[settings.ADMIN_EMAIL],  # set this in settings.py
                fail_silently=False,
            )

            return Response({
                "message": "Registration successful. Admin will review your request.",
                "user": {
                "username": user.username,
                "display_name": user.display_name,
                "email": user.email,
            }
        }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def check_username(request):
    username = request.GET.get("username")
    if not username:
        return Response({"error": "Username not provided"}, status=status.HTTP_400_BAD_REQUEST)

    exists = CustomUser.objects.filter(username=username).exists()
    return Response({"exists": exists}, status=status.HTTP_200_OK)

@api_view(['GET'])
def check_email(request):
    email = request.GET.get("email")
    if not email:
        return Response({"error": "Email not provided"}, status=status.HTTP_400_BAD_REQUEST)

    exists = CustomUser.objects.filter(email=email).exists()
    return Response({"exists": exists}, status=status.HTTP_200_OK)
