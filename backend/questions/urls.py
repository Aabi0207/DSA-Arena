from django.urls import path
from .views import DSASheetListView, DSASheetDetailView

urlpatterns = [
    path('sheets/', DSASheetListView.as_view(), name='sheet-list'),
    path('sheets/<int:sheet_id>/', DSASheetDetailView.as_view(), name='sheet-detail'),
]
