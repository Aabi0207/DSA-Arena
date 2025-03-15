import random
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models

# Custom User Manager
class CustomUserManager(BaseUserManager):
    def create_user(self, email, username, display_name, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, display_name=display_name, **extra_fields)
        user.set_password(password)

        # Assign random profile image between 1.jpg and 20.jpg
        random_number = random.randint(1, 10)
        user.profile_photo = f"profile_pics/{random_number}.jpg"

        # Set default score and rank
        user.score = 0
        user.rank = "JADHAV"
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, display_name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, username, display_name, password, **extra_fields)

# Varna choices for privilege field
VARNA_CHOICES = [
    ("BRAHMIN", "Brahmin"),
    ("KSHATRIYA", "Kshatriya"),
    ("VAISHYA", "Vaishya"),
    ("SHUDRA", "Shudra"),
]

# Custom User Model
class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=30, unique=True)
    display_name = models.CharField(max_length=100)

    tagline = models.CharField(max_length=255, blank=True, null=True)
    pronouns = models.CharField(max_length=50, blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)

    profile_photo = models.ImageField(upload_to="profile_pics/", blank=True, null=True)
    profile_banner = models.ImageField(upload_to="profile_banner/", blank=True, null=True)

    github = models.URLField(blank=True, null=True)
    linkedin = models.URLField(blank=True, null=True)
    portfolio = models.URLField(blank=True, null=True)

    score = models.IntegerField(default=0)
    rank = models.CharField(max_length=50, default="JADHAV", blank=True, null=True)

    privilege = models.CharField(
        max_length=50,
        choices=VARNA_CHOICES,
        blank=True,
        null=True
    )

    is_accepted = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    date_joined = models.DateTimeField(auto_now_add=True, blank=True, null=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'display_name']

    def __str__(self):
        return self.display_name
