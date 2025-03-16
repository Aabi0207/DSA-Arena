from rest_framework import serializers
from .models import DSASheet, Topic, Question, UserQuestionStatus, UserSheetProgress
from questions.models import Topic, Question

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


class UserSheetProgressSerializer(serializers.ModelSerializer):
    total_questions = serializers.SerializerMethodField()
    total_easy = serializers.SerializerMethodField()
    total_medium = serializers.SerializerMethodField()
    total_hard = serializers.SerializerMethodField()

    class Meta:
        model = UserSheetProgress
        fields = [
            'solved_count',
            'solved_easy',
            'solved_medium',
            'solved_hard',
            'total_questions',
            'total_easy',
            'total_medium',
            'total_hard',
        ]

    def get_total_questions(self, obj):
        return Question.objects.filter(topic__sheet=obj.sheet).count()

    def get_total_easy(self, obj):
        return Question.objects.filter(topic__sheet=obj.sheet, difficulty='EASY').count()

    def get_total_medium(self, obj):
        return Question.objects.filter(topic__sheet=obj.sheet, difficulty='MEDIUM').count()

    def get_total_hard(self, obj):
        return Question.objects.filter(topic__sheet=obj.sheet, difficulty='HARD').count()
    

class TopicWithQuestionsSerializer(serializers.ModelSerializer):
    questions = serializers.SerializerMethodField()

    class Meta:
        model = Topic
        fields = ['id', 'name', 'questions']  # <-- questions must be included here

    def get_questions(self, topic):
        user = self.context.get('user')
        questions = topic.questions.all()

        data = []
        for q in questions:
            data.append({
                'id': q.id,
                'question': q.question,
                'link': q.link,
                'solution': q.solution,
                'platform': q.platform,
                'difficulty': q.difficulty,
                'is_saved': UserQuestionStatus.objects.filter(user=user, question=q, status="SAVED").exists() if user and user.is_authenticated else False,
                'is_solved': UserQuestionStatus.objects.filter(user=user, question=q, status="SOLVED").exists() if user and user.is_authenticated else False,
            })
        return data
