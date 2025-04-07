from django.db.models.signals import post_save
from django.dispatch import receiver
from users.models import CustomUser
from .models import DSASheet, UserSheetProgress

@receiver(post_save, sender=DSASheet)
def create_progress_for_new_sheet(sender, instance, created, **kwargs):
    if created:
        users = CustomUser.objects.all()
        for user in users:
            UserSheetProgress.objects.create(
                user=user,
                sheet=instance,
                solved_count=0,
                solved_easy=0,
                solved_medium=0,
                solved_hard=0
            )
