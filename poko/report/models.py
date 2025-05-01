from django.utils import timezone
import datetime

from django.db import models
from accounts.models import CustomUser
from attendance.models import Member
from django.db.models import Model


class UserCheck(models.Model):
    STATUS_CHOICES = [
        (0, "작성중"),
        (1, "작성완료"),
    ]

    worship_choice = [(0, "불참"), (1, "1부 예배"), (2, "2부 예배"), (3, "3부 예배")]
    qt_choice = [
        (0, "0회"),
        (1, "1회"),
        (2, "2회"),
        (3, "3회"),
        (4, "4회"),
        (5, "5회"),
        (6, "6회"),
        (7, "7회"),
    ]

    pray_choice = [
        (0, "0회"),
        (1, "1회"),
        (2, "2회"),
        (3, "3회"),
        (4, "4회"),
        (5, "5회"),
        (6, "6회"),
        (7, "7회"),
    ]

    meeting_choice = [(False, "불참"), (True, "참석")]

    teacher = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name="usercheck",
    )
    pray = models.OneToOneField(
        "Pray",
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="usercheck",
    )

    title = models.CharField(max_length=30, null=True, default=None)
    worship = models.IntegerField(
        null=True,
        default=None,
        choices=worship_choice,
    )
    qt = models.IntegerField(
        null=True,
        default=None,
        choices=qt_choice,
    )
    pray = models.IntegerField(
        null=True,
        default=None,
        choices=pray_choice,
    )
    meeting = models.BooleanField(default=True, choices=meeting_choice)  # 교사모임 참석 여부
    date = models.DateTimeField(default=timezone.now)
    date_sunday = models.DateField(null=True, blank=True)
    week_number = models.IntegerField(null=True, blank=True)  # date_sunday 기준 주차별 정보
    status = models.IntegerField(choices=STATUS_CHOICES, default=0)

    def save(self, *args, **kwargs):
        self.date_sunday = self.date + datetime.timedelta(
            days=(6 - self.date.weekday())
        )
        self.week_number = self.date_sunday.isocalendar()[1]
        super().save(*args, **kwargs)


class Pray(models.Model):
    # 청소년부를 위한 기도
    pray_Dept = models.CharField(max_length=300, null=True, default=None)
    # 반 모임을 위한 기도
    pray_group = models.CharField(max_length=300, null=True, default=None)
    # 사용자에 대한 기도
    pray_user = models.CharField(max_length=300, null=True, default=None)


class MemberCheck(models.Model):
    STATUS_CHOICES = [
        (0, "작성중"),
        (1, "작성완료"),
    ]

    gqs_choice = [(False, "불참"), (True, "참석")]

    member_name = models.ForeignKey(
        Member,
        related_name="membercheck",
        on_delete=models.CASCADE,
    )
    # 어느 주차의 어떤 선생님의 학생 기록
    user_check = models.ForeignKey(
        UserCheck, on_delete=models.CASCADE, null=True, blank=True
    )
    # GQS 참석 여부
    gqs_attendance = models.BooleanField(default=False)
    # 목양일지 세부내용
    care_note = models.TextField(null=True, blank=True)
    # 문의사항/긴급사항
    issue = models.CharField(max_length=300, null=True, default=None)
    # 작성 시점 날짜
    date = models.DateTimeField(default=timezone.now)
    # 작성 시점 가까운 일요일
    date_sunday = models.DateField(null=True, blank=True)
    # date_sunday 기준 주차별 정보
    week_number = models.IntegerField(null=True, blank=True)
    status = models.IntegerField(choices=STATUS_CHOICES, default=0)

    def save(self, *args, **kwargs):
        self.date_sunday = self.date + datetime.timedelta(
            days=(6 - self.date.weekday())
        )
        self.week_number = self.date_sunday.isocalendar()[1]
        super().save(*args, **kwargs)


class Feedback(models.Model):
    teacher = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name="comments",
    )
    member_check = models.ForeignKey(
        MemberCheck, on_delete=models.CASCADE, related_name="comment"
    )
    feedback = models.CharField(max_length=500)
    date = models.DateTimeField(default=timezone.now)
