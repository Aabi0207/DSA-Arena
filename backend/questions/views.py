from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import DSASheet
from .serializers import DSASheetSerializer

class DSASheetListView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        sheets = DSASheet.objects.all().order_by('-created_at')
        serializer = DSASheetSerializer(sheets, many=True, context={"request": request})
        return Response(serializer.data)
