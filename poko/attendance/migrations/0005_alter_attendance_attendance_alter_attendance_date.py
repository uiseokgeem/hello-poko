from django.db import migrations, models


def convert_attendance_and_date(apps, schema_editor):
    Attendance = apps.get_model("attendance", "Attendance")

    # 출석 여부 변환: "출석" -> True, "결석" -> False
    for record in Attendance.objects.all():
        if record.attendance == "출석":
            record.attendance = True
        elif record.attendance == "결석":
            record.attendance = False
        record.save()


def convert_datetime_to_date(apps, schema_editor):
    Attendance = apps.get_model("attendance", "Attendance")

    # DateTimeField에서 시간 정보를 무시하고 날짜만 저장
    for record in Attendance.objects.all():
        if record.date is not None:
            record.date = record.date.date()  # DateTime에서 날짜만 추출
        else:
            record.date = "2024-01-01"  # 기본값 또는 다른 적절한 값 설정
        record.save()


class Migration(migrations.Migration):
    dependencies = [
        ("attendance", "0004_alter_attendance_name_alter_member_teacher"),
    ]

    operations = [
        migrations.AlterField(
            model_name="attendance",
            name="attendance",
            field=models.BooleanField(),
        ),
        migrations.AlterField(
            model_name="attendance",
            name="date",
            field=models.DateField(null=True),  # 일시적으로 null 허용
        ),
        migrations.RunPython(
            convert_attendance_and_date, reverse_code=migrations.RunPython.noop
        ),
        migrations.RunPython(
            convert_datetime_to_date, reverse_code=migrations.RunPython.noop
        ),
        migrations.AlterField(
            model_name="attendance",
            name="date",
            field=models.DateField(null=False),  # 나중에 다시 null=False로 수정
        ),
    ]

    atomic = False  # atomic 트랜잭션 비활성화
