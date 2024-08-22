# frontend/Dockerfile

# 빌드 스테이지
FROM node:14 AS build

WORKDIR /usr/src/app

# package.json과 package-lock.json 파일을 복사
COPY package.json /usr/src/app/package.json
COPY package-lock.json /usr/src/app/package-lock.json

RUN npm install

# 나머지 소스 파일들을 복사
COPY . .

RUN npm run build

# 프로덕션 스테이지
# 경량 Node.js 이미지를 사용하여 프로덕션 환경 구성
FROM node:14-alpine 

WORKDIR /usr/src/app

# 빌드된 파일들을 복사
COPY --from=build /usr/src/app/build /usr/src/app/build

# 필요한 경우 추가적인 패키지 설치 (serve와 같은 정적 파일 서빙용 패키지)
RUN npm install -g serve

EXPOSE 3000

# 빌드된 파일을 서빙
CMD ["serve", "-s", "build", "-l", "3000"]