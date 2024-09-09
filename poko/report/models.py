from django.utils import timezone
import datetime

from django.db import models
from accounts.models import CustomUser
from attendance.models import Member
from django.db.models import Model


class MemberCheck(models.Model):
    STATUS_CHOICES = [
        (0, "작성중"),
        (1, "작성완료"),
    ]

    gqs_choice = [(False, "불참"), (True, "참석")]

    name = models.ForeignKey(
        Member,
        related_name="membercheck",
        on_delete=models.CASCADE,
        to_field="name",
    )
    gqs = models.BooleanField(default=True, choices=gqs_choice)  # GQS 참석 여부
    pray_member = models.CharField(max_length=300, null=True, default=None)
    date = models.DateTimeField(default=timezone.now)
    date_sunday = models.DateField(null=True, blank=True)
    week_number = models.IntegerField(null=True, blank=True)  # date_sunday 기준 주차별 정보
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default="0")

    def save(self, *args, **kwargs):
        self.date_sunday = self.date + datetime.timedelta(
            days=(6 - self.date.weekday())
        )
        self.week_number = self.date_sunday.isocalendar()[1]
        super().save(*args, **kwargs)


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
        to_field="email",
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
    pray_Dept = models.CharField(max_length=300, null=True, default=None)  # 청소년부를 위한 기도
    pray_group = models.CharField(
        max_length=300, null=True, default=None
    )  # 반 모임을 위한 기도
    pray_user = models.CharField(max_length=300, null=True, default=None)  # 사용자에 대한 기도
    pray_emergency = models.CharField(
        max_length=300, null=True, default=None
    )  # 교사 긴급 기도
    issue = models.CharField(max_length=300, null=True, default=None)  # 문의사항/긴급사항
    date = models.DateTimeField(default=timezone.now)
    date_sunday = models.DateField(null=True, blank=True)
    week_number = models.IntegerField(null=True, blank=True)  # date_sunday 기준 주차별 정보
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default="0")

    def save(self, *args, **kwargs):
        self.date_sunday = self.date + datetime.timedelta(
            days=(6 - self.date.weekday())
        )
        self.week_number = self.date_sunday.isocalendar()[1]
        super().save(*args, **kwargs)


class Comment(models.Model):
    teacher = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name="comment",
    )
    member_check = models.ForeignKey(
        MemberCheck, on_delete=models.CASCADE, related_name="comment"
    )
    feedback = models.CharField(max_length=500)
    date = models.DateTimeField(default=timezone.now)
