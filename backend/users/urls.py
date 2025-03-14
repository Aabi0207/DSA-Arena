from django.urls import path
from .views import UserRegistrationView, check_username, check_email

urlpatterns = [
    path('', UserRegistrationView.as_view(), name='user-register'),
    path('check-username/', check_username, name='check-username'),
    path('check-email/', check_email, name='check-email'),
]
