from django.db import models
from users.models import CustomUser

DIFFICULTY_CHOICES = [
    ("UNMARKED", "Unmarked"),
    ("EASY", "Easy"),
    ("MEDIUM", "Medium"),
    ("HARD", "Hard"),
]

STATUS_CHOICES = [
    ("SAVED", "Saved"),
    ("SOLVED", "Solved"),
]

SCORE_MAPPING = {
    "UNMARKED": 10,
    "EASY": 5,
    "MEDIUM": 10,
    "HARD": 15,
}

class DSASheet(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to='sheet_images/', blank=True, null=True)  # ✅ New image field
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Topic(models.Model):
    sheet = models.ForeignKey(DSASheet, on_delete=models.CASCADE, related_name='topics')
    name = models.CharField(max_length=100)

    class Meta:
        unique_together = ('sheet', 'name')

    def __str__(self):
        return f"{self.name} ({self.sheet.name})"

class Question(models.Model):
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name='questions')
    question = models.CharField(max_length=255)
    link = models.URLField()
    solution = models.URLField(blank=True, null=True)  # ✅ New solution field
    platform = models.CharField(max_length=100)
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES, default="UNMARKED")

    def get_score(self):
        return SCORE_MAPPING.get(self.difficulty, 10)

    def __str__(self):
        return self.question

class UserQuestionStatus(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='question_statuses')
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='user_statuses')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'question', 'status')

    def __str__(self):
        return f"{self.user.display_name} - {self.question.question} ({self.status})"

class UserSheetProgress(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='sheet_progress')
    sheet = models.ForeignKey(DSASheet, on_delete=models.CASCADE, related_name='user_progress')
    
    solved_count = models.PositiveIntegerField(default=0)
    solved_easy = models.PositiveIntegerField(default=0)
    solved_medium = models.PositiveIntegerField(default=0)
    solved_hard = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ('user', 'sheet')

    def __str__(self):
        return f"{self.user.display_name} - {self.sheet.name} Progress"


class UserNote(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='notes')
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='notes')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']  # newest first

    def __str__(self):
        return f"Note by {self.user.display_name} on {self.question.question}"
