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
        (2, "답변완료"),
    ]

    worship_choice = [
        (0, "불참"),
        (1, "1부 예배"),
        (2, "2부 예배"),
        (3, "3부 예배"),
    ]
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

    title = models.CharField(
        max_length=30,
        null=True,
        default=None,
    )
    worship_attendance = models.IntegerField(
        null=True,
        default=None,
        choices=worship_choice,
    )
    # 교사모임 참석 여부
    meeting_attendance = models.BooleanField(
        null=True,
        default=True,
        choices=meeting_choice,
    )
    qt_count = models.IntegerField(
        null=True,
        default=None,
        choices=qt_choice,
    )
    pray_count = models.IntegerField(
        null=True,
        default=None,
        choices=pray_choice,
    )
    # 문의사항/긴급사항
    issue = models.TextField(null=True, default=None)
    # 작성시점 날짜
    date = models.DateTimeField(default=timezone.now)
    # 작성시점 가까운 일요일
    date_sunday = models.DateField(null=True, blank=True)
    # date_sunday 기준 주차별 정보
    week_number = models.IntegerField(null=True, blank=True)
    status = models.IntegerField(choices=STATUS_CHOICES, default=0)

    def save(self, *args, **kwargs):
        # 가장 가까운 과거 일요일을 date_sunday에 저장
        if self.date.weekday() == 6:
            self.date_sunday = self.date
        else:
            self.date_sunday = self.date - datetime.timedelta(
                days=self.date.weekday() + 1
            )

        # 일요일 기준 주차 계산
        self.week_number = self.date_sunday.isocalendar()[1]
        super().save(*args, **kwargs)


class Pray(models.Model):
    user_check = models.OneToOneField(
        UserCheck,
        null=True,
        blank=True,
        on_delete=models.CASCADE,
    )
    # 청소년부를 위한 기도
    pray_dept = models.CharField(max_length=300, null=True, default=None)
    # 반 모임을 위한 기도
    pray_group = models.CharField(max_length=300, null=True, default=None)
    # 사용자에 대한 기도
    pray_teacher = models.CharField(max_length=300, null=True, default=None)


class MemberCheck(models.Model):
    STATUS_CHOICES = [
        (0, "작성중"),
        (1, "작성완료"),
        (2, "답변완료"),
    ]

    gqs_choice = [
        (False, "불참"),
        (True, "참석"),
    ]

    # 학생
    member = models.ForeignKey(
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
    # 작성 시점 날짜
    date = models.DateTimeField(default=timezone.now)
    # 작성 시점 가까운 일요일
    date_sunday = models.DateField(null=True, blank=True)
    # date_sunday 기준 주차별 정보
    week_number = models.IntegerField(null=True, blank=True)
    status = models.IntegerField(choices=STATUS_CHOICES, default=0)

    def save(self, *args, **kwargs):
        # 가장 가까운 과거 일요일을 date_sunday에 저장
        if self.date.weekday() == 6:
            self.date_sunday = self.date
        else:
            self.date_sunday = self.date - datetime.timedelta(
                days=self.date.weekday() + 1
            )

        # 일요일 기준 주차 계산
        self.week_number = self.date_sunday.isocalendar()[1]
        super().save(*args, **kwargs)


class Feedback(models.Model):
    teacher = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name="comments",
    )
    user_check = models.OneToOneField(
        UserCheck,
        on_delete=models.CASCADE,
        null=True,
        related_name="feedback",
    )
    feedback = models.TextField()
    date = models.DateTimeField(default=timezone.now)
