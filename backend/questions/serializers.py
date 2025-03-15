from rest_framework import serializers
from .models import DSASheet

class DSASheetSerializer(serializers.ModelSerializer):
    class Meta:
        model = DSASheet
        fields = ['id', 'name', 'description', 'image']
