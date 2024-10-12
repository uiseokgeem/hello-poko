from accounts.models import CustomUser
from attendance.models import Member, Attendance
from datetime import datetime
import random

# 선생님 생성
teacher = CustomUser.objects.create_user(
    email="teacher1@example.com",
    password="password",
    full_name="선생님1",
)

# 9월의 일요일 날짜 리스트 (2024년 기준)
september_sundays = [
    "2024-09-01",
    "2024-09-08",
    "2024-09-15",
    "2024-09-22",
    "2024-09-29",
]

# 학생 이름 리스트
student_names = ["학생1", "학생2", "학생3", "학생4", "학생5", "학생6", "학생7", "학생8", "학생9", "학생10"]


# 랜덤 학년 생성 함수
def random_grade():
    return random.choice(["1", "2", "3"])


# 랜덤 출석 여부 생성 함수 (True: 출석, False: 결석)
def random_attendance():
    return random.choice([True, False])


# 학생과 출석 데이터 생성
for name in student_names:
    # 학생 생성 (학년과 성별은 랜덤)
    student = Member.objects.create(
        teacher=teacher,
        name=name,
        grade=random_grade(),
        gender=random.choice(["남", "여"]),
    )

    # 출석 데이터 생성 (9월의 일요일 날짜에 랜덤 출석/결석 기록)
    for date_str in september_sundays:
        Attendance.objects.create(
            name=student,
            attendance=random_attendance(),  # Boolean 값으로 변경
            date=date_str,  # DateTime에서 Date로 수정
        )

print("데이터 생성 완료!")


# membercheck 테스트 데이터
from attendance.models import Member  # 이미 생성된 학생 데이터가 있어야 합니다.
from report.models import MemberCheck
from django.utils import timezone

# 특정 학생 가져오기
student = Member.objects.first()  # 첫 번째 학생을 가져옴

# MemberCheck 데이터 생성
member_check = MemberCheck.objects.create(
    name=student,  # Member 모델의 인스턴스
    gqs=True,  # 참석 여부
    pray_member="기도 멤버",  # 임의의 값
    date=timezone.now(),  # 현재 날짜 및 시간
    status="작성완료",  # 상태
)

# 쿼리 확인
# MemberCheck.objects.all()

# 특정 선생님 기준 더미 데이터 생성 코드
from accounts.models import CustomUser
from attendance.models import Member, Attendance
from datetime import datetime
import random

# 9월의 일요일 날짜 리스트 (2024년 기준)
september_sundays = [
    "2024-09-01",
    "2024-09-08",
    "2024-09-15",
    "2024-09-22",
    "2024-09-29",
]


# 랜덤 학생 이름 리스트 생성 함수
def generate_student_names():
    first_names = ["김", "이", "박", "최", "정", "강", "조", "윤", "장", "임"]  # 성
    last_names = ["민수", "지수", "현우", "영희", "철수", "승현", "유리", "동현", "주영", "하준"]  # 이름
    return [
        f"{random.choice(first_names)}{random.choice(last_names)}" for _ in range(10)
    ]


# 랜덤 학년 생성 함수
def random_grade():
    return random.choice(["1", "2", "3"])


# 랜덤 출석 여부 생성 함수 (True: 출석, False: 결석)
def random_attendance():
    return random.choice([True, False])


# poko@poko.com 사용자 가져오기
teacher = CustomUser.objects.get(email="token@toen.com")

# 학생 이름 리스트 랜덤 생성
student_names = generate_student_names()

# 학생과 출석 데이터 생성
for name in student_names:
    # 학생 생성 (학년과 성별은 랜덤)
    student = Member.objects.create(
        teacher=teacher,
        name=name,
        grade=random_grade(),
        gender=random.choice(["남", "여"]),
    )

    # 출석 데이터 생성 (9월의 일요일 날짜에 랜덤 출석/결석 기록)
    for date_str in september_sundays:
        Attendance.objects.create(
            name=student,
            attendance=random_attendance(),  # Boolean 값으로 출석 상태 기록
            date=date_str,  # 날짜만 저장
        )

print("데이터 생성 완료!")
