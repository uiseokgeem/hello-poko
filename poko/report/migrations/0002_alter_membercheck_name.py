# Generated by Django 5.0.6 on 2024-09-16 08:11

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("attendance", "0001_initial"),
        ("report", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="membercheck",
            name="name",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="membercheck",
                to="attendance.member",
            ),
        ),
    ]
