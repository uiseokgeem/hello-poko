# Generated by Django 5.0.6 on 2024-07-05 08:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0002_customuser_registration_number"),
    ]

    operations = [
        migrations.AlterField(
            model_name="customuser",
            name="password",
            field=models.CharField(
                error_messages={
                    "blank": "비밀번호를 입력해주세요.",
                    "max_length": "비밀번호는 128자 이내여야 합니다.",
                    "null": "비밀번호를 입력해주세요.",
                    "required": "비밀번호를 입력해주세요.",
                },
                max_length=128,
                verbose_name="password",
            ),
        ),
    ]
