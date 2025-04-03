# 1. Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# 의존성 설치
COPY package.json package-lock.json ./
RUN npm install

# 소스 복사 및 빌드
COPY . .
RUN npm run build

# 2. Production stage
FROM node:18-alpine

WORKDIR /app

# 의존성 재설치 (필요 최소만)
COPY package.json package-lock.json ./
RUN npm install --omit=dev

# 빌드된 결과 복사
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
