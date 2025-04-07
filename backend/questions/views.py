from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny
from .models import DSASheet, UserSheetProgress, CustomUser, Topic, Question, SCORE_MAPPING, UserQuestionStatus, UserNote
from .serializers import DSASheetSerializer, DSASheetDetailSerializer, UserSheetProgressSerializer, TopicWithQuestionsSerializer, UserNoteSerializer, SavedQuestionSerializer
from users.utils import calculate_rank


class DSASheetListView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        sheets = DSASheet.objects.all().order_by('-created_at').reverse()
        serializer = DSASheetSerializer(sheets, many=True, context={"request": request})
        return Response(serializer.data)


class DSASheetDetailView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, sheet_id):
        try:
            sheet = DSASheet.objects.get(id=sheet_id)
        except DSASheet.DoesNotExist:
            return Response({'error': 'Sheet not found'}, status=404)

        serializer = DSASheetDetailSerializer(sheet, context={'request': request})
        return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_user_sheet_progress(request, user_name, sheet_id):
    try:
        user = CustomUser.objects.get(username=user_name)
    except CustomUser.DoesNotExist:
        return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    try:
        progress = UserSheetProgress.objects.get(user=user, sheet_id=sheet_id)
    except UserSheetProgress.DoesNotExist:
        return Response({'detail': 'Progress not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = UserSheetProgressSerializer(progress)
    return Response(serializer.data)


class TopicsWithQuestionsView(APIView):
    def get(self, request, sheet_id):
        email = request.GET.get('email')
        user = None

        if email:
            try:
                user = CustomUser.objects.get(email=email)
            except CustomUser.DoesNotExist:
                user = None

        topics = Topic.objects.filter(sheet_id=sheet_id).order_by('-id').prefetch_related('questions').reverse()
        serializer = TopicWithQuestionsSerializer(topics, many=True, context={'user': user})
        return Response(serializer.data, status=status.HTTP_200_OK)

    

@api_view(["POST"])
def update_question_status(request):
    email = request.data.get("email")
    question_id = request.data.get("question_id")
    action = request.data.get("action")  # Expected: "solve", "unsolve", "save", "unsave"

    if not email or not question_id or not action:
        return Response({"error": "Missing email, question_id, or action"}, status=400)

    try:
        user = CustomUser.objects.get(email=email)
    except CustomUser.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    try:
        question = Question.objects.get(id=question_id)
    except Question.DoesNotExist:
        return Response({"error": "Question not found"}, status=404)

    sheet = question.topic.sheet
    score_value = question.get_score()
    max_score = 1985  # Centralized value

    if action == "solve":
        status_obj, created = UserQuestionStatus.objects.get_or_create(
            user=user, question=question, status="SOLVED"
        )
        if created:
            user.score += score_value
            user.rank = calculate_rank(user.score, max_score)
            user.save()

            progress, _ = UserSheetProgress.objects.get_or_create(user=user, sheet=sheet)
            progress.solved_count += 1
            if question.difficulty == "EASY":
                progress.solved_easy += 1
            elif question.difficulty == "MEDIUM":
                progress.solved_medium += 1
            elif question.difficulty == "HARD":
                progress.solved_hard += 1
            progress.save()

    elif action == "unsolve":
        try:
            status_obj = UserQuestionStatus.objects.get(user=user, question=question, status="SOLVED")
            status_obj.delete()
            user.score = max(user.score - score_value, 0)
            user.rank = calculate_rank(user.score, max_score)
            user.save()

            try:
                progress = UserSheetProgress.objects.get(user=user, sheet=sheet)
                progress.solved_count = max(progress.solved_count - 1, 0)
                if question.difficulty == "EASY":
                    progress.solved_easy = max(progress.solved_easy - 1, 0)
                elif question.difficulty == "MEDIUM":
                    progress.solved_medium = max(progress.solved_medium - 1, 0)
                elif question.difficulty == "HARD":
                    progress.solved_hard = max(progress.solved_hard - 1, 0)
                progress.save()
            except UserSheetProgress.DoesNotExist:
                pass
        except UserQuestionStatus.DoesNotExist:
            pass

    elif action == "save":
        UserQuestionStatus.objects.get_or_create(user=user, question=question, status="SAVED")

    elif action == "unsave":
        UserQuestionStatus.objects.filter(user=user, question=question, status="SAVED").delete()

    else:
        return Response({"error": "Invalid action"}, status=400)

    return Response({"message": f"Question {action} successful"}, status=200)


class UserNoteView(APIView):
    def get(self, request):
        email = request.query_params.get('email')
        question_id = request.query_params.get('question_id')

        if not email or not question_id:
            return Response({'error': 'Email and question_id are required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.get(email=email)
            question = Question.objects.get(id=question_id)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Question.DoesNotExist:
            return Response({'error': 'Question not found.'}, status=status.HTTP_404_NOT_FOUND)

        notes = UserNote.objects.filter(user=user, question=question)
        serializer = UserNoteSerializer(notes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        email = request.data.get('email')
        question_id = request.data.get('question_id')
        content = request.data.get('content')

        if not email or not question_id or not content:
            return Response({'error': 'Email, question_id and content are required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.get(email=email)
            question = Question.objects.get(id=question_id)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Question.DoesNotExist:
            return Response({'error': 'Question not found.'}, status=status.HTTP_404_NOT_FOUND)

        note = UserNote.objects.create(user=user, question=question, content=content)
        serializer = UserNoteSerializer(note)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def delete(self, request):
        email = request.data.get('email')
        note_id = request.data.get('note_id')

        if not email or not note_id:
            return Response({'error': 'Email and note_id are required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.get(email=email)
            note = UserNote.objects.get(id=note_id, user=user)  # Ensure user owns the note
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        except UserNote.DoesNotExist:
            return Response({'error': 'Note not found or does not belong to user.'}, status=status.HTTP_404_NOT_FOUND)

        note.delete()
        return Response({'message': 'Note deleted successfully.'}, status=status.HTTP_200_OK)


class SavedQuestionsByTopicView(APIView):

    def get(self, request):
        email = request.query_params.get("email")
        if not email:
            return Response({"error": "Email is required"}, status=400)

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        saved_statuses = UserQuestionStatus.objects.filter(user=user, status="SAVED").select_related('question__topic__sheet')
        
        # Create mapping from topic to list of questions
        topic_map = {}
        for status in saved_statuses:
            question = status.question
            topic_obj = question.topic
            topic_key = f"{topic_obj.name} ({topic_obj.sheet.name})"
            
            if topic_key not in topic_map:
                topic_map[topic_key] = []

            topic_map[topic_key].append(question)

        result = []
        for topic_name, questions in topic_map.items():
            serialized_questions = SavedQuestionSerializer(questions, many=True, context={'user': user}).data
            result.append({
                "name": topic_name,
                "questions": serialized_questions
            })

        return Response(result)