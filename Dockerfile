# Node.js 기반 멀티스테이지 빌드
FROM node:20-alpine AS builder

WORKDIR /app

# 전체 구조 복사
COPY . .

# 의존성 설치
RUN npm ci && npm ci -w backend

# 런타임 이미지
FROM node:20-alpine

WORKDIR /app

# 빌더에서 node_modules만 복사 (최소 크기)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/backend/node_modules ./backend/node_modules

# 백엔드 소스만 복사
COPY backend/src ./backend/src
COPY backend/public ./backend/public
COPY backend/package.json ./backend/
COPY db/schema.sql ./db/

EXPOSE 3000

# 헬스체크
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# 백엔드 시작
CMD ["node", "backend/src/server.js"]
