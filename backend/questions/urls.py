from django.urls import path
from .views import DSASheetListView

urlpatterns = [
    path('sheets/', DSASheetListView.as_view(), name='sheet-list'),
]
