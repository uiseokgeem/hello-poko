# admin_management/management/commands/portfolio_data.py

import random
import string
from datetime import date

from django.core.management.base import BaseCommand
from django.db import transaction

from accounts.models import CustomUser
from attendance.models import Member, Attendance  # ✅ Attendance 추가


ADMIN_EMAIL = "tset_admin@test.com"
ADMIN_PWD = "admin1234!!"

USER_EMAIL = "tset_user@test.com"
USER_PWD = "user1234!!"

PORTFOLIO_CLASS_NAME = "포트폴"

# ✅ 2026년 1월 일요일 3회
PORTFOLIO_DATES = [
    date(2026, 1, 4),
    date(2026, 1, 11),
    date(2026, 1, 18),
]


def random_korean_name(max_len=4):
    last_names = list("김이박최정강조윤장임한오서신권황안송류전홍고문양손배백허유남심노하곽성차주우구민")
    first_1 = list("민서지우서준하윤도윤시우예준수아지민지현서연서영현우준우")
    first_2 = list("준우서윤서진민준예린유진하은지안도현은우지훈시윤")
    ln = random.choice(last_names)
    fn = random.choice(first_1)[:1] + random.choice(first_2)[:1]
    return (ln + fn)[:max_len]


def random_birth_date(start_year=2007, end_year=2012):
    y = random.randint(start_year, end_year)
    m = random.randint(1, 12)
    max_day = 28 if m == 2 else 30 if m in (4, 6, 9, 11) else 31
    d = random.randint(1, max_day)
    return date(y, m, d)


def short_unique_member_name(prefix="P"):
    letters = string.ascii_uppercase + string.digits
    return (prefix + "".join(random.choice(letters) for _ in range(4)))[:5]


class Command(BaseCommand):
    help = "포트폴리오 공개용 최소 더미 데이터 생성(관리자 1 + 유저 1 + 학생 5 + 출석 3주)"

    def add_arguments(self, parser):
        parser.add_argument(
            "--reset", action="store_true", help="이 커맨드로 만든 데이터 삭제 후 재생성"
        )
        parser.add_argument("--seed", type=int, default=42, help="랜덤 시드(재현성)")

    @transaction.atomic
    def handle(self, *args, **options):
        random.seed(options["seed"])
        reset = options["reset"]

        if reset:
            self.stdout.write(self.style.WARNING("Reset 모드: 포트폴리오 데이터 삭제 후 재생성합니다."))

            # ✅ 출석 삭제: USER_EMAIL 소속 학생 + 지정 날짜만 삭제(안전)
            Attendance.objects.filter(
                name__teacher__email=USER_EMAIL,
                date__in=PORTFOLIO_DATES,
            ).delete()

            # 학생 삭제: teacher가 USER_EMAIL인 멤버만 삭제(안전)
            Member.objects.filter(teacher__email=USER_EMAIL).delete()

            # 유저/관리자 삭제
            CustomUser.objects.filter(email__in=[ADMIN_EMAIL, USER_EMAIL]).delete()

        # 1) 관리자 계정
        admin_user, created_admin = CustomUser.objects.get_or_create(
            email=ADMIN_EMAIL,
            defaults={
                "full_name": "관리자",
                "role": "HEAD",
                "class_name": PORTFOLIO_CLASS_NAME,
                "head_teacher": None,
                "is_staff": True,
                "is_superuser": True,
            },
        )
        if created_admin:
            admin_user.set_password(ADMIN_PWD)
            admin_user.save()
        else:
            updated = False
            if not admin_user.is_staff:
                admin_user.is_staff = True
                updated = True
            if not admin_user.is_superuser:
                admin_user.is_superuser = True
                updated = True
            if admin_user.role != "HEAD":
                admin_user.role = "HEAD"
                updated = True
            if admin_user.class_name != PORTFOLIO_CLASS_NAME:
                admin_user.class_name = PORTFOLIO_CLASS_NAME
                updated = True
            if updated:
                admin_user.save()
            if not admin_user.check_password(ADMIN_PWD):
                admin_user.set_password(ADMIN_PWD)
                admin_user.save()

        # 2) 일반 유저(HEAD)
        head_user, created_head = CustomUser.objects.get_or_create(
            email=USER_EMAIL,
            defaults={
                "full_name": random_korean_name(max_len=4),
                "role": "HEAD",
                "class_name": "중1",
                "head_teacher": None,
                "is_staff": False,
                "is_superuser": False,
            },
        )
        if created_head:
            head_user.set_password(USER_PWD)
            head_user.save()
        else:
            fields = []
            if head_user.role != "HEAD":
                head_user.role = "HEAD"
                fields.append("role")
            if not head_user.class_name:
                head_user.class_name = "중1"
                fields.append("class_name")
            if head_user.head_teacher_id is not None:
                head_user.head_teacher = None
                fields.append("head_teacher")
            if not head_user.full_name:
                head_user.full_name = random_korean_name(max_len=4)
                fields.append("full_name")
            if head_user.is_staff:
                head_user.is_staff = False
                fields.append("is_staff")
            if head_user.is_superuser:
                head_user.is_superuser = False
                fields.append("is_superuser")
            if fields:
                head_user.save(update_fields=fields)
            if not head_user.check_password(USER_PWD):
                head_user.set_password(USER_PWD)
                head_user.save()

        # 3) 학생 5명 생성
        grades = ["중1", "중2", "중3", "고1", "고2", "고3"]
        genders = ["남", "여"]

        created_students = 0
        target_count = 5

        existing = Member.objects.filter(teacher=head_user).count()
        need = max(0, target_count - existing)

        for _ in range(need):
            for attempt in range(20):
                name = short_unique_member_name(prefix="P")
                try:
                    m, created = Member.objects.get_or_create(
                        name=name,
                        defaults={
                            "teacher": head_user,
                            "grade": random.choice(grades)[:3],
                            "gender": random.choice(genders)[:3],
                            "birth_date": random_birth_date(),
                            "attendance_count": random.randint(0, 20),
                            "absent_count": random.randint(0, 5),
                        },
                    )
                    if created:
                        created_students += 1
                    break
                except Exception:
                    if attempt == 19:
                        raise

        # ✅ 4) 출석 3주 생성
        students = Member.objects.filter(teacher=head_user).order_by("id")[
            :target_count
        ]

        created_attendance = 0
        updated_attendance = 0

        for s in students:
            for d in PORTFOLIO_DATES:
                # 포트폴리오 화면에서 "전원 출석"이 보기 좋으면 True 고정 추천
                # 조금 현실감 주려면 random로 섞어도 됨.
                # value = True
                value = random.choice([True, True, True, False])  # 출석이 더 많게

                obj, created = Attendance.objects.get_or_create(
                    name=s,
                    date=d,
                    defaults={"attendance": value},
                )
                if created:
                    created_attendance += 1
                else:
                    # 재실행 시 값이 None이면 채워주기
                    if obj.attendance is None:
                        obj.attendance = value
                        obj.save(update_fields=["attendance"])
                        updated_attendance += 1

        self.stdout.write(self.style.SUCCESS("포트폴리오 더미 데이터 생성 완료"))
        self.stdout.write("계정 정보:")
        self.stdout.write(f"- ADMIN: {ADMIN_EMAIL} / {ADMIN_PWD} (staff/superuser)")
        self.stdout.write(f"- USER : {USER_EMAIL} / {USER_PWD} (role=HEAD)")
        self.stdout.write(
            f"학생: USER 소속 총 {Member.objects.filter(teacher=head_user).count()}명 (이번 실행 신규 {created_students}명)"
        )
        self.stdout.write(
            f"출석: 2026-01-04/11/18 총 {len(students) * len(PORTFOLIO_DATES)}건 대상 (신규 {created_attendance}건, 보정 {updated_attendance}건)"
        )
