from django.urls import path
from .views import DSASheetListView, DSASheetDetailView, get_user_sheet_progress, TopicsWithQuestionsView, update_question_status, UserNoteView

urlpatterns = [
    path('sheets/', DSASheetListView.as_view(), name='sheet-list'),
    path('sheets/<int:sheet_id>/', DSASheetDetailView.as_view(), name='sheet-detail'),
    path('progress/<str:user_name>/<int:sheet_id>/', get_user_sheet_progress, name='get_user_sheet_progress'),
    path('sheets/<int:sheet_id>/topics-with-questions/', TopicsWithQuestionsView.as_view(), name='topics-with-questions'),
    path("update-status/", update_question_status, name="update_question_status"),
    path('notes/', UserNoteView.as_view(), name='user-notes'),
]
