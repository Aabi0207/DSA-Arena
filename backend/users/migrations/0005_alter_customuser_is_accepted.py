# Generated by Django 5.1.7 on 2025-03-19 12:16

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("users", "0004_customuser_profile_banner"),
    ]

    operations = [
        migrations.AlterField(
            model_name="customuser",
            name="is_accepted",
            field=models.BooleanField(default=True),
        ),
    ]
