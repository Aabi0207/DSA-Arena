from django.core.management.base import BaseCommand
from questions.models import DSASheet, Topic, Question
from users.models import CustomUser
import csv

class Command(BaseCommand):
    help = 'Reimport NeetCode DSA questions after deleting old ones'

    def add_arguments(self, parser):
        parser.add_argument('tsv_file', type=str, help='Path to the TSV file with NeetCode questions')
        parser.add_argument('sheet_name', type=str, help='Name of the DSASheet (NeetCode)')

    def handle(self, *args, **kwargs):
        tsv_file = kwargs['tsv_file']
        sheet_name = kwargs['sheet_name']

        # 1. Delete existing NeetCode questions and topics
        try:
            sheet = DSASheet.objects.get(name=sheet_name)
            # Delete topics and questions related to NeetCode sheet
            sheet.topics.all().delete()
            sheet.delete()
            self.stdout.write(self.style.SUCCESS(f'✅ Successfully deleted all topics and questions for sheet: {sheet_name}.'))
        except DSASheet.DoesNotExist:
            self.stdout.write(self.style.WARNING(f'⚠️ No sheet found with name: {sheet_name}.'))

        # 2. Recreate the NeetCode sheet and import questions with updated data
        sheet = DSASheet.objects.create(
            name=sheet_name,
            description=f"NeetCode DSA Sheet (Reimported)",
        )

        topic_cache = {}

        with open(tsv_file, newline='', encoding='utf-8') as f:
            reader = csv.DictReader(f, delimiter='\t')
            created_count = 0

            for row in reader:
                topic_name = row['Topic'].strip()
                question_text = row['Problem Name'].strip()
                problem_link = row['Problem Link'].strip()
                solution_link = row['Solution Link'].strip()
                difficulty = row['Difficulty'].strip().upper()

                # Get or create the topic
                if topic_name not in topic_cache:
                    topic, _ = Topic.objects.get_or_create(sheet=sheet, name=topic_name)
                    topic_cache[topic_name] = topic
                else:
                    topic = topic_cache[topic_name]

                # Create the question with platform = "leetcode" and difficulty = "UNMARKED"
                if not Question.objects.filter(topic=topic, question=question_text).exists():
                    Question.objects.create(
                        topic=topic,
                        question=question_text,
                        link=problem_link,
                        solution=solution_link,
                        difficulty=difficulty,  # Default difficulty
                        platform="leetcode"     # Set platform to lowercase "leetcode"
                    )
                    created_count += 1

        self.stdout.write(self.style.SUCCESS(f'✅ Successfully reimported {created_count} NeetCode questions into the sheet: {sheet_name}.'))
