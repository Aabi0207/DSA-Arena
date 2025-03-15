from django.contrib import admin
from .models import DSASheet, Topic, Question, UserQuestionStatus, UserSheetProgress

@admin.register(DSASheet)
class DSASheetAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'created_at')
    search_fields = ('name',)

@admin.register(Topic)
class TopicAdmin(admin.ModelAdmin):
    list_display = ('name', 'sheet')
    list_filter = ('sheet',)
    search_fields = ('name',)

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('question', 'topic', 'platform', 'difficulty')
    list_filter = ('topic__sheet', 'topic', 'platform', 'difficulty')
    search_fields = ('question', 'platform')

@admin.register(UserQuestionStatus)
class UserQuestionStatusAdmin(admin.ModelAdmin):
    list_display = ('user', 'question', 'status', 'updated_at')
    list_filter = ('status', 'question__topic__sheet')
    search_fields = ('user__email', 'question__question')

@admin.register(UserSheetProgress)
class UserSheetProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'sheet', 'solved_count')
    list_filter = ('sheet',)
    search_fields = ('user__email', 'sheet__name')
