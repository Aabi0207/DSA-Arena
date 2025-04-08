from django.urls import path
from .views import DSASheetListView, DSASheetDetailView, get_user_sheet_progress, TopicsWithQuestionsView, update_question_status, UserNoteView, SavedQuestionsByTopicView, TopicQuestionsNotesView, MarkdownNoteUpsertView

urlpatterns = [
    path('sheets/', DSASheetListView.as_view(), name='sheet-list'),
    path('sheets/<int:sheet_id>/', DSASheetDetailView.as_view(), name='sheet-detail'),
    path('progress/<str:user_name>/<int:sheet_id>/', get_user_sheet_progress, name='get_user_sheet_progress'),
    path('sheets/<int:sheet_id>/topics-with-questions/', TopicsWithQuestionsView.as_view(), name='topics-with-questions'),
    path("update-status/", update_question_status, name="update_question_status"),
    path('notes/', UserNoteView.as_view(), name='user-notes'),
    path('saved/', SavedQuestionsByTopicView.as_view(), name='saved-questions'),
    path('topic/questions-notes/', TopicQuestionsNotesView.as_view()),
    path('markdown-note/upsert/', MarkdownNoteUpsertView.as_view()),
]
