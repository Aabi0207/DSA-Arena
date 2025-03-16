from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from .models import DSASheet, UserSheetProgress, CustomUser
from .serializers import DSASheetSerializer, DSASheetDetailSerializer, UserSheetProgressSerializer

class DSASheetListView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        sheets = DSASheet.objects.all().order_by('-created_at')
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