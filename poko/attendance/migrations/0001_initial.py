# Generated by Django 5.0.6 on 2024-09-09 08:01

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Member",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=5, unique=True)),
                ("grade", models.CharField(default=None, max_length=3, null=True)),
                ("gender", models.CharField(default=None, max_length=3, null=True)),
                ("attendance_count", models.IntegerField(default=0)),
                ("absent_count", models.IntegerField(default=0)),
                (
                    "teacher",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="members",
                        to=settings.AUTH_USER_MODEL,
                        to_field="email",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Attendance",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("attendance", models.CharField(max_length=50)),
                ("date", models.DateTimeField()),
                (
                    "name",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="attendance",
                        to="attendance.member",
                        to_field="name",
                    ),
                ),
            ],
        ),
    ]