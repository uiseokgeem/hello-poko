from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from accounts.models import CustomUser
from attendance.models import Member


class Command(BaseCommand):
    help = "반편성 기능 테스트용 정교사/보조교사(+학생) 더미 데이터 생성"

    def add_arguments(self, parser):
        parser.add_argument(
            "--reset",
            action="store_true",
            help="이 스크립트로 만든 테스트 계정/학생을 삭제 후 재생성합니다.",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        reset = options["reset"]

        # 이 프리픽스를 가진 이메일만 '테스트 데이터'로 간주합니다.
        prefix = "class-test"

        if reset:
            self.stdout.write(self.style.WARNING("Reset 모드: 테스트 데이터 삭제 후 재생성합니다."))

            # 학생 name이 unique라서, 테스트용 name prefix로 만들어둔 것만 삭제
            Member.objects.filter(name__startswith="T").delete()

            # 테스트 교사 삭제 (이메일 prefix 기준)
            CustomUser.objects.filter(email__startswith=prefix).delete()

        # 테스트 반 목록(현재 운영 데이터 기준으로 class_name이 row를 만드니, 여러 반을 만들어둡니다)
        class_names = ["초5", "초6", "중1"]

        # 1) 각 반마다 HEAD 1명 생성
        heads = {}
        for cn in class_names:
            email = f"{prefix}-head-{cn}@example.com"
            user, created = CustomUser.objects.get_or_create(
                email=email,
                defaults={
                    "full_name": f"H{cn}"[:4],
                    "role": "HEAD",
                    "class_name": cn,
                },
            )
            if not created:
                # 재실행 시 상태 보정
                user.role = "HEAD"
                user.class_name = cn
                user.head_teacher = None
                user.save(update_fields=["role", "class_name", "head_teacher"])
            heads[cn] = user

        # 2) 각 반마다 ASSISTANT 1명 생성 (head_teacher 연결까지 걸어둠)
        assistants = {}
        for cn in class_names:
            email = f"{prefix}-asst-{cn}@example.com"
            user, created = CustomUser.objects.get_or_create(
                email=email,
                defaults={
                    "full_name": f"A{cn}"[:4],
                    "role": "ASSISTANT",
                    "class_name": cn,
                    "head_teacher": heads[cn],
                },
            )
            if not created:
                user.role = "ASSISTANT"
                user.class_name = cn
                user.head_teacher = heads[cn]
                user.save(update_fields=["role", "class_name", "head_teacher"])
            assistants[cn] = user

        # 3) 미배정(null) HEAD/ASSISTANT도 몇 명 만들어둠 (후보로 셀렉트에 뜨게)
        extra_users = [
            ("HEAD", None, None, f"{prefix}-head-free1@example.com", "HF1"),
            ("HEAD", None, None, f"{prefix}-head-free2@example.com", "HF2"),
            ("ASSISTANT", None, None, f"{prefix}-asst-free1@example.com", "AF1"),
            ("ASSISTANT", None, None, f"{prefix}-asst-free2@example.com", "AF2"),
        ]

        for role, cn, ht, email, name in extra_users:
            user, created = CustomUser.objects.get_or_create(
                email=email,
                defaults={
                    "full_name": name[:4],
                    "role": role,
                    "class_name": cn,
                    "head_teacher": ht,
                },
            )
            if not created:
                user.role = role
                user.class_name = cn
                user.head_teacher = ht
                user.save(update_fields=["role", "class_name", "head_teacher"])

        # 4) 학생도 조금 만들어둠 (학생 일괄 변경 테스트용)
        # Member.name이 unique(max_length=5)이므로 짧게 생성합니다.
        # "반(class_name) 기준"이 아니라 "teacher FK 기준"으로 학생이 묶이므로,
        # 각 반의 HEAD에게 학생을 붙여둡니다.
        def make_member(teacher, idx):
            student_name = f"T{teacher.class_name}{idx}"  # 예: T초51 (5자 넘어갈 수 있어 짧게 조절)
            student_name = student_name.replace("초", "C").replace("중", "J")
            student_name = student_name[:5]

            m, created = Member.objects.get_or_create(
                name=student_name,
                defaults={
                    "teacher": teacher,
                    "grade": teacher.class_name,
                    "gender": "남" if idx % 2 == 0 else "여",
                    "attendance_count": 0,
                    "absent_count": 0,
                },
            )
            if not created:
                m.teacher = teacher
                m.grade = teacher.class_name
                m.save(update_fields=["teacher", "grade"])
            return m

        for cn in class_names:
            head = heads[cn]
            make_member(head, 1)
            make_member(head, 2)

        # 출력
        self.stdout.write(self.style.SUCCESS("테스트 교사/학생 생성 완료"))
        self.stdout.write("생성된 반( class_name ) 목록:")
        for cn in class_names:
            self.stdout.write(
                f"- {cn}: HEAD={heads[cn].id}/{heads[cn].full_name}, "
                f"ASSISTANT={assistants[cn].id}/{assistants[cn].full_name}"
            )
        self.stdout.write("미배정 후보( class_name=None )도 일부 생성됨")
