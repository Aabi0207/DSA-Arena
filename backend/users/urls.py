from django.urls import path
from .views import UserRegistrationView, check_username, check_email, UserLoginView

urlpatterns = [
    path('', UserRegistrationView.as_view(), name='user-register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('check-username/', check_username, name='check-username'),
    path('check-email/', check_email, name='check-email'),
]
