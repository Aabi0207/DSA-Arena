from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny
from .models import DSASheet, UserSheetProgress, CustomUser, Topic, Question, SCORE_MAPPING, UserQuestionStatus, UserNote, MarkdownNote
from .serializers import DSASheetSerializer, DSASheetDetailSerializer, UserSheetProgressSerializer, TopicWithQuestionsSerializer, UserNoteSerializer, SavedQuestionSerializer, SimpleQuestionWithNoteSerializer, MarkdownNoteSerializer
from users.utils import calculate_rank
from django.shortcuts import get_object_or_404
from django.http import StreamingHttpResponse
import google.generativeai as genai  # pip install google-generativeai
import json
from .utils import get_leetcode_problem_html
from django.conf import settings

GEMINI_API_KEY = settings.GEMINI_API_KEY
genai.configure(api_key=GEMINI_API_KEY)

# client = genai.Client()

model = genai.GenerativeModel("gemini-2.5-flash")

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
    

class TopicQuestionsNotesView(APIView):
    def post(self, request):
        # Get data from POST request
        username = request.data.get('username')
        topic_id = request.data.get('topic_id')
        
        # Validate required fields
        if not username or not topic_id:
            return Response(
                {'error': 'Both username and topic_id are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get user and topic
        try:
            user = CustomUser.objects.get(username=username)
            topic = Topic.objects.get(id=topic_id)
        except CustomUser.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Topic.DoesNotExist:
            return Response(
                {'error': 'Topic not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Get questions with notes
        questions = Question.objects.filter(topic=topic)
        data = []
        
        for question in questions:
            note = MarkdownNote.objects.filter(user=user, question=question).first()
            data.append({
                'id': question.id,
                'question': question.question,
                'content': note.content if note else ""
            })
        
        return Response(data, status=status.HTTP_200_OK)


class MarkdownNoteUpsertView(APIView):
    def post(self, request):
        # Get data from POST request
        username = request.data.get('username')
        question_id = request.data.get('question_id')
        content = request.data.get('content')
        
        # Validate required fields
        if not username or not question_id or not content:
            return Response(
                {'error': 'username, question_id and content are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get user and question
        try:
            user = CustomUser.objects.get(username=username)
            question = Question.objects.get(id=question_id)
        except CustomUser.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Question.DoesNotExist:
            return Response(
                {'error': 'Question not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Create or update note
        note, created = MarkdownNote.objects.update_or_create(
            user=user,
            question=question,
            defaults={'content': content}
        )
        
        # Return success response
        return Response(
            {
                'success': True,
                'id': note.id,
                'question_id': question_id,
                'content': content
            },
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
        )
    
@permission_classes([AllowAny])
@api_view(['POST'])
def my_streaming_view(request):
    email = request.data.get('email')
    if not email:
        return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = CustomUser.objects.get(email=email)
    except CustomUser.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    
    slug = request.data.get('slug')
    if not slug:
        return Response({"error": "Slug is required"}, status=400)

    preferred_lang = request.data.get('lang', 'C++')
    data = get_leetcode_problem_html(slug, preferred_lang)

    prompt = f"""
You are an expert coding mentor specializing in data structures and algorithms.

The user is solving the following LeetCode problem:

**Title:** {data['title']}

**Problem Description:**
{data['content_text']}

**Language:** {preferred_lang}

**Starter Code:**
```{preferred_lang.lower()}
{data['code']}
```

**Instructions:**
Please provide a comprehensive solution following this structure:

1. **Problem Understanding**: Briefly explain what the problem is asking for and identify key constraints.

2. **Approach Strategy**: 
   - Describe the algorithmic approach you'll use
   - Explain why this approach is suitable for this problem
   - Mention any alternative approaches if applicable

3. **Step-by-Step Solution**:
   - Break down the solution into logical steps
   - Explain the reasoning behind each step

4. **Complete Code Solution**: 
   - Provide the complete, working code in {preferred_lang}
   - Use the given starter code structure
   - Include clear comments explaining key logic
   - Follow language-specific best practices

5. **Example Walkthrough**: 
   - Walk through the solution with at least one example from the problem
   - Show how variables change during execution
   - Explain the flow of logic

6. **Complexity Analysis**:
   - Time Complexity: O(?) with explanation
   - Space Complexity: O(?) with explanation
   - Justify your complexity analysis

7. **Edge Cases & Considerations**:
   - Mention important edge cases to consider
   - Any potential pitfalls or optimizations

**Requirements:**
- Write clean, readable, and efficient code
- Use meaningful variable names
- Add inline comments for complex logic
- Ensure the solution handles all constraints mentioned in the problem
- Format code properly with consistent indentation

Please structure your response clearly with headers for each section.
"""

    try:
        # Generate streaming response from Gemini model
        response = model.generate_content(
            prompt,
            stream=True,
            generation_config=genai.types.GenerationConfig(
                temperature=0.7,
                top_p=0.8,
                top_k=40,
                max_output_tokens=8192,
            )
        )
        
        def generate_response():
            try:
                for chunk in response:
                    if chunk.text:
                        # Format each chunk as JSON for frontend consumption
                        data = {
                            'type': 'content',
                            'content': chunk.text,
                            'status': 'generating'
                        }
                        yield f"data: {json.dumps(data)}\n\n"
                
                # Send completion signal
                completion_data = {
                    'type': 'complete',
                    'content': '',
                    'status': 'completed'
                }
                yield f"data: {json.dumps(completion_data)}\n\n"
                
            except Exception as e:
                # Send error signal
                error_data = {
                    'type': 'error',
                    'content': str(e),
                    'status': 'error'
                }
                yield f"data: {json.dumps(error_data)}\n\n"
        
        # Return streaming response with appropriate headers
        streaming_response = StreamingHttpResponse(
            generate_response(),
            content_type='text/event-stream'
        )
        streaming_response['Cache-Control'] = 'no-cache'
        # streaming_response['Connection'] = 'keep-alive'
        streaming_response['X-Accel-Buffering'] = 'no'  # Disable nginx buffering
        
        return streaming_response
        
    except Exception as e:
        return Response(
            {'error': f'Failed to generate response: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )