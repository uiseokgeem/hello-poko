# admin_management/management/commands/seed_class_test_data.py

import random
import string
from django.core.management.base import BaseCommand
from django.db import transaction

from accounts.models import CustomUser
from attendance.models import Member


def random_korean_name(max_len=4):
    # 실명처럼 보이되 '실제 인물'과 무관한 랜덤 한글 이름 생성
    # 성 1글자 + 이름 2글자(총 3글자) 기본
    last_names = list("김이박최정강조윤장임한오서신권황안송류전홍고문양손배백허유남심노하곽성차주우구민")
    first_1 = list("민서지우서준하윤도윤시우예준수아지민지현서연서영현우준우")
    first_2 = list("준우서윤서진민준예린유진하은지안도현은우지훈시윤")

    ln = random.choice(last_names)
    fn = random.choice(first_1)[:1] + random.choice(first_2)[:1]  # 2글자 느낌
    name = (ln + fn)[:max_len]
    return name


def short_unique_student_code(prefix, idx):
    # Member.name 유니크/길이 제한 대응(최대 5자 가정)
    # 예: T1A2B 같은 형태(5자)
    letters = string.ascii_uppercase + string.digits
    rnd = "".join(random.choice(letters) for _ in range(3))  # 3자
    base = f"{prefix}{idx}"  # 예: T1
    code = (base + rnd)[:5]
    return code


class Command(BaseCommand):
    help = "반편성/학년/배치 기능 테스트용 더미 데이터 생성(교사+학생)"

    def add_arguments(self, parser):
        parser.add_argument(
            "--reset", action="store_true", help="이 스크립트로 만든 데이터 삭제 후 재생성"
        )
        parser.add_argument("--seed", type=int, default=42, help="랜덤 시드(재현성)")
        parser.add_argument(
            "--prefix", type=str, default="class-test", help="테스트 교사 이메일 prefix"
        )
        parser.add_argument(
            "--students-per-class", type=int, default=50, help="반(HEAD)당 학생 수"
        )
        parser.add_argument("--extra-heads", type=int, default=10, help="미배정 HEAD 후보 수")
        parser.add_argument(
            "--extra-assts", type=int, default=10, help="미배정 ASSISTANT 후보 수"
        )

        # 실제 운영에서 class_name이 고정되지 않으므로 예시를 넓게
        parser.add_argument(
            "--classes",
            nargs="*",
            default=["중1", "중2", "중3", "고1", "고2고3남", "고2고3여"],
            help="생성할 반(class_name) 목록",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        random.seed(options["seed"])

        reset = options["reset"]
        prefix = options["prefix"]
        class_names = options["classes"]
        students_per_class = options["students_per_class"]
        extra_heads = options["extra_heads"]
        extra_assts = options["extra_assts"]

        if reset:
            self.stdout.write(self.style.WARNING("Reset 모드: 테스트 데이터 삭제 후 재생성합니다."))

            # 학생: name 규칙(prefix='T')로 만든 것만 삭제
            Member.objects.filter(name__startswith="T").delete()

            # 교사: 이메일 prefix 기준으로 삭제
            CustomUser.objects.filter(email__startswith=prefix).delete()

        # 1) 각 반마다 HEAD 1명 생성
        heads = {}
        for cn in class_names:
            email = f"{prefix}-head-{cn}@example.com"
            user, created = CustomUser.objects.get_or_create(
                email=email,
                defaults={
                    "full_name": random_korean_name(max_len=4),
                    "role": "HEAD",
                    "class_name": cn,
                    "head_teacher": None,
                },
            )
            if not created:
                user.role = "HEAD"
                user.class_name = cn
                user.head_teacher = None
                if not user.full_name:
                    user.full_name = random_korean_name(max_len=4)
                user.save(
                    update_fields=["role", "class_name", "head_teacher", "full_name"]
                )
            heads[cn] = user

        # 2) 각 반마다 ASSISTANT 1명 생성 (head_teacher 연결)
        assistants = {}
        for cn in class_names:
            email = f"{prefix}-asst-{cn}@example.com"
            user, created = CustomUser.objects.get_or_create(
                email=email,
                defaults={
                    "full_name": random_korean_name(max_len=4),
                    "role": "ASSISTANT",
                    "class_name": cn,
                    "head_teacher": heads[cn],
                },
            )
            if not created:
                user.role = "ASSISTANT"
                user.class_name = cn
                user.head_teacher = heads[cn]
                if not user.full_name:
                    user.full_name = random_korean_name(max_len=4)
                user.save(
                    update_fields=["role", "class_name", "head_teacher", "full_name"]
                )
            assistants[cn] = user

        # 3) 미배정 후보 생성 (class_name=None)
        def create_free_teacher(role, i):
            email = f"{prefix}-{role.lower()}-free-{i}@example.com"
            user, created = CustomUser.objects.get_or_create(
                email=email,
                defaults={
                    "full_name": random_korean_name(max_len=4),
                    "role": role,
                    "class_name": None,
                    "head_teacher": None,
                },
            )
            if not created:
                user.role = role
                user.class_name = None
                user.head_teacher = None
                if not user.full_name:
                    user.full_name = random_korean_name(max_len=4)
                user.save(
                    update_fields=["role", "class_name", "head_teacher", "full_name"]
                )
            return user

        for i in range(1, extra_heads + 1):
            create_free_teacher("HEAD", i)

        for i in range(1, extra_assts + 1):
            create_free_teacher("ASSISTANT", i)

        # 4) 학생 생성 (각 반의 HEAD에 students_per_class명)
        # Member.name 제약 대응: 5자 이내 유니크 코드로 생성
        # grade는 임시로 class_name을 넣되, 실제 운영에서는 grade=중/고 등으로 따로 관리 가능
        created_count = 0

        for cn in class_names:
            head = heads[cn]
            for idx in range(1, students_per_class + 1):
                # 충돌 방지를 위해 get_or_create 실패 시 재시도
                for attempt in range(10):
                    student_name = short_unique_student_code("T", idx)
                    try:
                        m, created = Member.objects.get_or_create(
                            name=student_name,
                            defaults={
                                "teacher": head,
                                "grade": "미정",  # 학년 Step2에서 올릴 예정이면 '미정' 추천
                                "gender": "남" if idx % 2 == 0 else "여",
                                "attendance_count": 0,
                                "absent_count": 0,
                            },
                        )
                        if not created:
                            # 재실행 시 teacher/grade 보정
                            m.teacher = head
                            if not m.grade:
                                m.grade = "미정"
                            m.save(update_fields=["teacher", "grade"])
                        else:
                            created_count += 1
                        break
                    except Exception:
                        if attempt == 9:
                            raise

        self.stdout.write(self.style.SUCCESS("테스트 교사/학생 생성 완료"))
        self.stdout.write(f"- 반 수: {len(class_names)}")
        self.stdout.write(
            f"- 반당 학생 수: {students_per_class} (이번 실행에서 신규 생성 {created_count}명)"
        )
        self.stdout.write("생성된 반( class_name ) 목록:")
        for cn in class_names:
            self.stdout.write(
                f"- {cn}: HEAD={heads[cn].id}/{heads[cn].full_name}, "
                f"ASSISTANT={assistants[cn].id}/{assistants[cn].full_name}"
            )
        self.stdout.write(
            f"미배정 후보: HEAD {extra_heads}명, ASSISTANT {extra_assts}명 (class_name=None)"
        )
