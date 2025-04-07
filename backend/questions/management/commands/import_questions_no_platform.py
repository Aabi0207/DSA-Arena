from django.core.management.base import BaseCommand
from questions.models import DSASheet, Topic, Question
from users.models import CustomUser
import csv

# Difficulty mapping to ensure it matches the DIFFICULTY_CHOICES
DIFFICULTY_MAPPING = {
    "Easy": "EASY",
    "Medium": "MEDIUM",
    "Hard": "HARD",
    "Unmarked": "UNMARKED",  # For cases where difficulty is not provided
}

# Helper to extract platform from problem link
def get_platform_from_link(link):
    if "leetcode.com" in link:
        return "leetcode"
    elif "geeksforgeeks.org" in link:
        return "geeksforgeeks"
    elif "interviewbit.com" in link:
        return "interviewbit"
    else:
        return "misc"

class Command(BaseCommand):
    help = 'Imports questions from a TSV file and handles platform and difficulty'

    def add_arguments(self, parser):
        parser.add_argument('tsv_file', type=str, help='Path to the TSV file with questions')
        parser.add_argument('sheet_name', type=str, help='Name of the DSASheet')

    def handle(self, *args, **kwargs):
        tsv_file = kwargs['tsv_file']
        sheet_name = kwargs['sheet_name']

        # Get or create the sheet
        sheet, created = DSASheet.objects.get_or_create(name=sheet_name)

        topic_cache = {}

        with open(tsv_file, newline='', encoding='utf-8') as f:
            reader = csv.DictReader(f, delimiter='\t')
            created_count = 0

            for row in reader:
                topic_name = row['Topic'].strip()
                question_text = row['Problem Name'].strip()
                problem_link = row['Problem Link'].strip()
                # solution_link = row['Solution Link'].strip()
                difficulty_str = row['Difficulty'].strip()

                difficulty = DIFFICULTY_MAPPING.get(difficulty_str, "UNMARKED")
                platform = get_platform_from_link(problem_link)

                if topic_name not in topic_cache:
                    topic, _ = Topic.objects.get_or_create(sheet=sheet, name=topic_name)
                    topic_cache[topic_name] = topic
                else:
                    topic = topic_cache[topic_name]

                if not Question.objects.filter(topic=topic, question=question_text).exists():
                    Question.objects.create(
                        topic=topic,
                        question=question_text,
                        link=problem_link,
                        # solution=solution_link,
                        difficulty=difficulty,
                        platform=platform
                    )
                    created_count += 1

        self.stdout.write(self.style.SUCCESS(
            f'✅ Successfully imported {created_count} questions with correct difficulty and extracted platform.'
        ))
