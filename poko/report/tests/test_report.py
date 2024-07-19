# tests.py
import pytest
from django.utils import timezone
from accounts.models import CustomUser
from checking.models import Member
from report.models import MemberCheck, UserCheck, Comment


@pytest.mark.django_db
def test_member_check_creation():
    member = Member.objects.create(name="John Doe")
    member_check = MemberCheck.objects.create(
        name=member,
        gqs=True,
        pray_member="Pray for John",
        date=timezone.now(),
        status="0",
    )

    assert member_check.date_sunday is not None
    assert member_check.week_number is not None
    assert member_check.status == "0"
    assert member_check.pray_member == "Pray for John"


@pytest.mark.django_db
def test_user_check_creation():
    teacher = CustomUser.objects.create_user(
        email="teacher@example.com", password="testpass123"
    )
    user_check = UserCheck.objects.create(
        teacher=teacher,
        title="Weekly Check",
        worship=1,
        qt=3,
        pray=4,
        meeting=True,
        pray_Dept="Pray for Youth Department",
        pray_group="Pray for Group Meeting",
        pray_user="Pray for User",
        pray_emergency="Emergency Prayer",
        issue="No issues",
        date=timezone.now(),
        status="0",
    )

    assert user_check.date_sunday is not None
    assert user_check.week_number is not None
    assert user_check.status == "0"
    assert user_check.pray_Dept == "Pray for Youth Department"
    assert user_check.issue == "No issues"


@pytest.mark.django_db
def test_comment_creation():
    teacher = CustomUser.objects.create_user(
        email="teacher@example.com", password="testpass123"
    )
    member = Member.objects.create(name="John Doe")
    member_check = MemberCheck.objects.create(
        name=member,
        gqs=True,
        pray_member="Pray for John",
        date=timezone.now(),
        status="0",
    )

    comment = Comment.objects.create(
        teacher=teacher,
        member_check=member_check,
        feedback="Great job!",
        date=timezone.now(),
    )

    assert comment.feedback == "Great job!"
    assert comment.teacher.email == "teacher@example.com"
    assert comment.member_check == member_check
