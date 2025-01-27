from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny, IsAuthenticated

import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from accounts.models import CustomUser  # 사용자 모델

from django.conf import settings


@method_decorator(csrf_exempt, name="dispatch")
class KakaoLoginAPIView(APIView):
    permission_classes = [AllowAny]  # 인증 불필요
    authentication_classes = []  # JWT 인증을 명시적으로 제외

    def post(self, request):
        kakao_code = request.data.get("code")
        kakao_token_url = "https://kauth.kakao.com/oauth/token"
        kakao_user_url = "https://kapi.kakao.com/v2/user/me"

        # 1. Kakao 인증 서버에 액세스 토큰 요청
        token_data = {
            "grant_type": "authorization_code",
            "client_id": settings.KAKAO_CLIENT_ID,
            "redirect_uri": settings.REDIRECT_URI,
            "code": kakao_code,
        }
        token_response = requests.post(kakao_token_url, data=token_data)
        if token_response.status_code != 200:
            print("Kakao token response error:", token_response.json())
            return Response(
                {"error": "Failed to fetch access token"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        access_token = token_response.json().get("access_token")
        # print("로그 확인", access_token)

        # 2. Kakao API에서 사용자 정보 요청
        headers = {"Authorization": f"Bearer {access_token}"}
        user_response = requests.get(kakao_user_url, headers=headers)
        if user_response.status_code != 200:
            return Response(
                {"error": "Failed to fetch user info"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user_data = user_response.json()
        kakao_id = user_data.get("id")
        email = user_data.get("kakao_account", {}).get("email")

        # 3. 사용자 데이터 확인 및 생성
        user, created = CustomUser.objects.get_or_create(
            email=email,
            defaults={
                "kakao_id": kakao_id,
                "full_name": user_data.get("properties", {}).get(
                    "nickname", "Kakao User"
                ),
            },
        )

        # 4. JWT 토큰 발급
        refresh = RefreshToken.for_user(user)
        response = Response({"message": "카카오 로그인 성공"}, status=status.HTTP_200_OK)

        # print("Access Token:", str(refresh.access_token))  # Access Token 로그 확인
        # print("Refresh Token:", str(refresh))  # Refresh Token 로그 확인

        # Access Token 쿠키 설정
        response.set_cookie(
            key="poko-auth",
            value=str(refresh.access_token),
        )

        # Refresh Token 쿠키 설정
        response.set_cookie(
            key="refresh_token",
            value=str(refresh),
        )

        # 6. 추가 정보 확인 (브라우저에 쿠키 전달 후 추가 작업 지시)
        if not user.full_name or not user.birth_date:
            response.data = {
                "message": "추가 정보 입력이 필요합니다.",
                "additional_info_required": True,
            }
            return response

        # 기본 응답: 추가 정보 필요 없음
        response.data = {
            "message": "카카오 로그인 성공",
            "additional_info_required": False,
        }
        return response


class KakaoRegisterAPIView(APIView):
    permission_classes = [IsAuthenticated]

    @method_decorator(csrf_exempt)
    def patch(self, request):
        user = request.user  # 현재 인증된 사용자 객체
        full_name = request.data.get("full_name")
        birth_date = request.data.get("birth_date")

        if not full_name or not birth_date:
            return Response(
                {"error": "이름과 생년월일을 모두 입력해야 합니다."},
                status=status.HTTP_400_BAD_REQUEST,
            )
            # 사용자 정보 업데이트
        user.full_name = full_name
        user.birth_date = birth_date
        user.save()

        return Response(
            {"message": "사용자 정보가 성공적으로 업데이트되었습니다."},
            status=status.HTTP_200_OK,
        )


# def process_kakao_user(user_data, kakao_id):
#     """
#     Kakao 사용자 데이터를 처리하여 사용자 생성 또는 업데이트.
#     """
#     email = user_data.get("kakao_account", {}).get("email")
#     nickname = user_data.get("properties", {}).get("nickname", "Kakao User")
#     birth_date = user_data.get("kakao_account", {}).get(
#         "birthday", None
#     )  # 생일이 있는 경우 처리
#
#     try:
#         # 이메일이 있는 기존 사용자 확인
#         user = CustomUser.objects.filter(email=email).first()
#
#         if user:
#             # 기존 사용자가 있지만 Kakao ID가 없으면 업데이트
#             if not user.kakao_id:
#                 user.kakao_id = kakao_id
#                 user.full_name = nickname[:4]  # full_name은 최대 4글자
#                 user.save()
#             return user, False  # 기존 사용자 반환
#
#         # 새로운 사용자 생성
#         user = CustomUser.objects.create(
#             email=email,
#             full_name=nickname[:4],  # full_name 필드 처리
#             birth_date=birth_date,  # 생일 정보 추가
#             kakao_id=kakao_id,
#         )
#         return user, True  # 새 사용자 반환
#
#     except Exception as e:
#         print(f"Error processing user: {e}")
#         return None, False
#
#
# class KakaoLoginAPIView(APIView):
#     permission_classes = [AllowAny]  # 누구나 접근 가능
#
#     def post(self, request):
#         kakao_code = request.data.get("code")
#         kakao_token_url = "https://kauth.kakao.com/oauth/token"
#         kakao_user_url = "https://kapi.kakao.com/v2/user/me"
#
#         # 1. Kakao 인증 서버에 액세스 토큰 요청
#         # 사용자 정보를 받아 오기 위한 토큰 요청
#         token_data = {
#             "grant_type": "authorization_code",
#             "client_id": "127a871daccd3ecc8bb3d849b21394b2",
#             "redirect_uri": "http://localhost:3000/auth/kakao",
#             "code": kakao_code,
#         }
#         token_response = requests.post(kakao_token_url, data=token_data)
#         if token_response.status_code != 200:
#             # 상태 코드가 200이 아닐 경우 오류 처리
#             print("Kakao token response error:", token_response.json())
#             return Response(
#                 {"error": "Failed to fetch access token"},
#                 status=status.HTTP_400_BAD_REQUEST,
#             )
#
#         # 상태 코드가 200인 경우만 진행
#         access_token = token_response.json().get("access_token")
#         if not access_token:
#             print("Access token not found in response.")
#             return Response(
#                 {"error": "Access token missing from response"},
#                 status=status.HTTP_400_BAD_REQUEST,
#             )
#
#         access_token = token_response.json().get("access_token")
#
#         # 2. Kakao API에서 사용자 정보 요청
#         headers = {"Authorization": f"Bearer {access_token}"}
#         # 응답받은 사용자 데이터를 저장
#         user_response = requests.get(kakao_user_url, headers=headers)
#         if user_response.status_code != 200:
#             return Response(
#                 {"error": "Failed to fetch user info"},
#                 status=status.HTTP_400_BAD_REQUEST,
#             )
#
#         user_data = user_response.json()
#         kakao_id = user_data.get("id")
#
#         # 사용자 데이터 처리 및 생성/업데이트
#         user, created = process_kakao_user(user_data, kakao_id)
#
#         if user is None:
#             return Response(
#                 {"error": "Failed to process user"}, status=status.HTTP_400_BAD_REQUEST
#             )
#
#             # 4. JWT 토큰을 쿠키에 저장
#         refresh = RefreshToken.for_user(user)
#
#         response = Response({"message": "카카오 로그인 성공"}, status=status.HTTP_200_OK)
#         # Access Token 로그 출력
#         print("Access Token:", str(refresh.access_token))  # Access Token 로그 확인
#
#         # Refresh Token 로그 출력
#         print("Refresh Token:", str(refresh))  # Refresh Token 로그 확인
#
#         # Access Token 쿠키 설정
#         response.set_cookie(
#             key="poko-auth",
#             value=str(refresh.access_token),
#             httponly=True,
#             secure=False,
#             samesite="None",
#         )
#
#         # Refresh Token 쿠키 설정
#         response.set_cookie(
#             key="refresh_token",
#             value=str(refresh),
#             httponly=True,
#             secure=False,
#             samesite="None",
#         )
#
#         # 5. 추가 정보 확인
#         if not user.full_name or not user.birth_date:
#             return Response(
#                 {
#                     "message": "추가 정보 입력이 필요합니다.",
#                     "additional_info_required": True,
#                 },
#                 status=status.HTTP_200_OK,
#             )
#
#         return response
#
#
# # 가입을 Patch
# class KakaoRegisterAPIView(APIView):
#     permission_classes = [IsAuthenticated]
#
#     @method_decorator(csrf_exempt)
#     def patch(self, request):
#         user = request.user  # 현재 인증된 사용자 객체
#         full_name = request.data.get("full_name")
#         birth_date = request.data.get("birth_date")
#
#         if not full_name or not birth_date:
#             return Response(
#                 {"error": "이름과 생년월일을 모두 입력해야 합니다."},
#                 status=status.HTTP_400_BAD_REQUEST,
#             )
#             # 사용자 정보 업데이트
#         user.full_name = full_name
#         user.birth_date = birth_date
#         user.save()
#
#         return Response(
#             {"message": "사용자 정보가 성공적으로 업데이트되었습니다."},
#             status=status.HTTP_200_OK,
#         )
