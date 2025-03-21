from django.urls import path
from .views import UserRegistrationView, check_username, check_email, UserLoginView, UserProfileView, UpdateProfileBannerView, UpdateProfilePhotoView, all_users_summary
from .views import update_profile_info, update_social_links

urlpatterns = [
    path('', UserRegistrationView.as_view(), name='user-register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('check-username/', check_username, name='check-username'),
    path('check-email/', check_email, name='check-email'),
    path("profile/", UserProfileView.as_view(), name="user-profile"),
    path('update-photo/', UpdateProfilePhotoView.as_view(), name='update-profile-photo'),
    path('update-banner/', UpdateProfileBannerView.as_view(), name='update-profile-banner'),
    path('profile-info/', update_profile_info, name='update_profile_info'),
    path('social-links/', update_social_links, name='update_social_links'),
    path('summary/', all_users_summary, name='all_users_summary'),
]
