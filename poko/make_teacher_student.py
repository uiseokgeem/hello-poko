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


# 랜덤 학생 이름 리스트 생성 함수 (중복 방지)
def generate_student_names():
    first_names = ["김", "이", "박", "최", "정", "강", "조", "윤", "장", "임", "독고", "제갈"]
    last_names = [
        "민수",
        "지수",
        "현우",
        "영희",
        "철수",
        "승현",
        "유리",
        "동현",
        "주영",
        "하준",
        "의석",
        "현진",
    ]
    full_names = set()
    while len(full_names) < 10:
        full_names.add(f"{random.choice(first_names)}{random.choice(last_names)}")
    return list(full_names)


# 랜덤 학년 생성 함수
def random_grade():
    return random.choice(["1", "2", "3"])


# 랜덤 출석 여부 생성 함수 (True: 출석, False: 결석)
def random_attendance():
    return random.choice([True, False])


# poko@poko.com 사용자 가져오기
teacher = CustomUser.objects.filter(email="dlguswls487@gmail.com").first()

if not teacher:
    print("해당 이메일을 가진 사용자가 없습니다.")
else:
    # 학생 이름 리스트 랜덤 생성
    student_names = generate_student_names()

    # 학생과 출석 데이터 생성
    for name in student_names:
        # 중복된 학생 생성 방지
        if not Member.objects.filter(teacher=teacher, name=name).exists():
            student = Member.objects.create(
                teacher=teacher,
                name=name,
                grade=random_grade(),
                gender=random.choice(["남", "여"]),
            )

            # 출석 데이터 생성 (9월의 일요일 날짜에 랜덤 출석/결석 기록)
            for date_str in september_sundays:
                date_obj = datetime.strptime(date_str, "%Y-%m-%d").date()  # date 객체로 변환
                Attendance.objects.create(
                    name=student,
                    attendance=random_attendance(),  # Boolean 값으로 출석 상태 기록
                    date=date_obj,  # datetime 객체로 변환된 날짜 저장
                )

    print("데이터 생성 완료!")
