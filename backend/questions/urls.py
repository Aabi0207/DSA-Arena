from django.urls import path
from .views import DSASheetListView, DSASheetDetailView, get_user_sheet_progress

urlpatterns = [
    path('sheets/', DSASheetListView.as_view(), name='sheet-list'),
    path('sheets/<int:sheet_id>/', DSASheetDetailView.as_view(), name='sheet-detail'),
    path('progress/<str:user_name>/<int:sheet_id>/', get_user_sheet_progress, name='get_user_sheet_progress'),
]
