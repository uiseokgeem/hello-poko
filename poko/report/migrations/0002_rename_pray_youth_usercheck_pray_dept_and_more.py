# Generated by Django 5.0.6 on 2024-07-19 08:41

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("report", "0001_initial"),
    ]

    operations = [
        migrations.RenameField(
            model_name="usercheck",
            old_name="pray_youth",
            new_name="pray_Dept",
        ),
        migrations.AddField(
            model_name="membercheck",
            name="date_sunday",
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="membercheck",
            name="week_number",
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="usercheck",
            name="date_sunday",
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="usercheck",
            name="pray",
            field=models.IntegerField(
                choices=[
                    (0, "0회"),
                    (1, "1회"),
                    (2, "2회"),
                    (3, "3회"),
                    (4, "4회"),
                    (5, "5회"),
                    (6, "6회"),
                    (7, "7회"),
                ],
                default=None,
                null=True,
            ),
        ),
        migrations.AddField(
            model_name="usercheck",
            name="status",
            field=models.CharField(
                choices=[(0, "작성중"), (1, "작성완료")], default="0", max_length=50
            ),
        ),
        migrations.AddField(
            model_name="usercheck",
            name="week_number",
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="comment",
            name="date",
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AlterField(
            model_name="membercheck",
            name="date",
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AlterField(
            model_name="membercheck",
            name="gqs",
            field=models.BooleanField(
                choices=[(False, "불참"), (True, "참석")], default=True
            ),
        ),
        migrations.AlterField(
            model_name="membercheck",
            name="status",
            field=models.CharField(
                choices=[(0, "작성중"), (1, "작성완료")], default="0", max_length=50
            ),
        ),
        migrations.AlterField(
            model_name="usercheck",
            name="date",
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AlterField(
            model_name="usercheck",
            name="meeting",
            field=models.BooleanField(
                choices=[(False, "불참"), (True, "참석")], default=True
            ),
        ),
    ]
