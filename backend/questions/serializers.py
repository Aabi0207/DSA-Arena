from rest_framework import serializers
from .models import DSASheet, Topic, Question, UserQuestionStatus, UserSheetProgress

class DSASheetSerializer(serializers.ModelSerializer):
    class Meta:
        model = DSASheet
        fields = ['id', 'name', 'description', 'image']


class QuestionDetailSerializer(serializers.ModelSerializer):
    user_status = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = ['id', 'question', 'link', 'solution', 'platform', 'difficulty', 'user_status']

    def get_user_status(self, obj):
        user = self.context.get('request').user
        if user.is_authenticated:
            status = UserQuestionStatus.objects.filter(user=user, question=obj).first()
            return status.status if status else None
        return None


class TopicDetailSerializer(serializers.ModelSerializer):
    questions = QuestionDetailSerializer(many=True, read_only=True)

    class Meta:
        model = Topic
        fields = ['id', 'name', 'questions']


class DSASheetDetailSerializer(serializers.ModelSerializer):
    topics = TopicDetailSerializer(many=True, read_only=True)
    user_progress = serializers.SerializerMethodField()
    total_questions = serializers.SerializerMethodField()

    class Meta:
        model = DSASheet
        fields = ['id', 'name', 'description', 'image', 'topics', 'user_progress', 'total_questions']

    def get_user_progress(self, obj):
        user = self.context.get('request').user
        if user.is_authenticated:
            progress = UserSheetProgress.objects.filter(user=user, sheet=obj).first()
            return {
                'solved_count': progress.solved_count if progress else 0
            }
        return None

    def get_total_questions(self, obj):
        return Question.objects.filter(topic__sheet=obj).count()
