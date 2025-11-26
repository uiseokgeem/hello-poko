from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient, APITestCase

from accounts.models import CustomUser
from attendance.models import Member
from report.models import UserCheck, Pray, MemberCheck


class ReportSummaryKeywordFilterTests(TestCase):
    def setUp(self):
        # 1) 교사 유저 생성
        self.teacher = CustomUser.objects.create_user(
            email="teacher@example.com",
            password="password123",
            full_name="김의석",
        )

        # 2) 학생 생성
        self.member1 = Member.objects.create(
            teacher=self.teacher,
            name="학생A",
            grade="1",
            gender="남",
        )

        self.member2 = Member.objects.create(
            teacher=self.teacher,
            name="학생B",
            grade="2",
            gender="여",
        )

        # 3) APIClient 사용 + 강제 인증
        self.client = APIClient()
        self.client.force_authenticate(user=self.teacher)

        # 4) summary URL
        self.url = "/api/admin-management/report/summary/"

    def test_keyword_matches_issue(self):
        uc1 = UserCheck.objects.create(
            teacher=self.teacher,
            title="2025년 05월 18일 목양일지",
            issue="예배 집중이 잘 안되는 학생 있음",
            date=timezone.now(),
        )
        uc2 = UserCheck.objects.create(
            teacher=self.teacher,
            title="2025년 05월 25일 목양일지",
            issue="그룹 나눔은 평안하게 진행됨",
            date=timezone.now(),
        )

        response = self.client.get(self.url, {"keyword": "집중"})
        self.assertEqual(response.status_code, 200)

        returned_ids = {item["id"] for item in response.json()}
        self.assertIn(uc1.id, returned_ids)
        self.assertNotIn(uc2.id, returned_ids)

    def test_keyword_matches_pray_fields(self):
        uc1 = UserCheck.objects.create(
            teacher=self.teacher,
            title="2025년 05월 18일 목양일지",
            issue=None,
            date=timezone.now(),
        )
        Pray.objects.create(
            user_check=uc1,
            pray_dept="청소년부 예배 부흥",
            pray_group="소그룹이 살아나도록",
            pray_teacher="교사의 영적 회복",
        )

        uc2 = UserCheck.objects.create(
            teacher=self.teacher,
            title="2025년 05월 25일 목양일지",
            issue=None,
            date=timezone.now(),
        )
        Pray.objects.create(
            user_check=uc2,
            pray_dept="진로 고민을 위해",
            pray_group="시험 기간 지혜",
            pray_teacher="건강을 위해",
        )

        response = self.client.get(self.url, {"keyword": "부흥"})
        self.assertEqual(response.status_code, 200)

        returned_ids = {item["id"] for item in response.json()}
        self.assertIn(uc1.id, returned_ids)
        self.assertNotIn(uc2.id, returned_ids)

    def test_keyword_matches_care_note_and_uses_distinct(self):
        uc = UserCheck.objects.create(
            teacher=self.teacher,
            title="주간 목양일지",
            issue=None,
            date=timezone.now(),
        )

        MemberCheck.objects.create(
            user_check=uc,
            member=self.member1,
            care_note="예배 집중이 좋아짐",
        )
        MemberCheck.objects.create(
            user_check=uc,
            member=self.member2,
            care_note="예배 참석이 꾸준함",
        )

        response = self.client.get(self.url, {"keyword": "예배"})
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]["id"], uc.id)

    def test_keyword_does_not_match_title_only(self):
        uc = UserCheck.objects.create(
            teacher=self.teacher,
            title="2025년 11월 23일 목양일지",  # title에만 존재
            issue=None,
            date=timezone.now(),
        )

        response = self.client.get(self.url, {"keyword": "목양일지"})
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertEqual(len(data), 0)
