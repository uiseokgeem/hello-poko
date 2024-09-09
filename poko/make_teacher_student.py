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


# 랜덤 출석 여부 생성 함수
def random_attendance():
    return random.choice(["출석", "결석"])


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
            attendance=random_attendance(),
            date=datetime.strptime(date_str, "%Y-%m-%d"),
        )

print("데이터 생성 완료!")
