from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import CustomUser
from questions.models import DSASheet, UserSheetProgress

@receiver(post_save, sender=CustomUser)
def create_user_sheet_progress(sender, instance, created, **kwargs):
    if created:
        sheets = DSASheet.objects.all()
        for sheet in sheets:
            UserSheetProgress.objects.create(
                user=instance,
                sheet=sheet,
                solved_count=0,
                solved_easy=0,
                solved_medium=0,
                solved_hard=0
            )
