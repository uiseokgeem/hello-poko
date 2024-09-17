# Generated by Django 5.0.6 on 2024-09-16 08:13

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("attendance", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="attendance",
            name="name",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="attendance",
                to="attendance.member",
            ),
        ),
    ]