from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ("email", "username", "display_name", "is_staff", "is_accepted")
    list_filter = ("is_staff", "is_superuser", "is_active", "is_accepted")

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal Info", {"fields": ("username", "display_name", "tagline", "pronouns", "location")}),
        ("Profile Links", {"fields": ("github", "linkedin", "portfolio")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "is_accepted", "groups", "user_permissions")}),
        ("DSA Arena Info", {"fields": ("score", "rank", "privilege", "profile_photo", "profile_banner")}),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "username", "display_name", "password1", "password2"),
        }),
    )

    search_fields = ("email", "username", "display_name")
    ordering = ("email",)

admin.site.register(CustomUser, CustomUserAdmin)
