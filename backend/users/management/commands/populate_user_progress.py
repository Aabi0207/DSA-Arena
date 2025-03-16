from django.core.management.base import BaseCommand
from users.models import CustomUser
from questions.models import DSASheet, UserSheetProgress

class Command(BaseCommand):
    help = 'Populates UserSheetProgress for existing users'

    def handle(self, *args, **kwargs):
        users = CustomUser.objects.all()
        sheets = DSASheet.objects.all()

        created_count = 0

        for user in users:
            for sheet in sheets:
                if not UserSheetProgress.objects.filter(user=user, sheet=sheet).exists():
                    UserSheetProgress.objects.create(
                        user=user,
                        sheet=sheet,
                        solved_count=0,
                        solved_easy=0,
                        solved_medium=0,
                        solved_hard=0
                    )
                    created_count += 1

        self.stdout.write(self.style.SUCCESS(f'✅ Successfully populated progress for {created_count} entries.'))
