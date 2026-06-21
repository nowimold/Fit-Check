# Fit Check

건강 상태를 분석해주는 앱입니다.

## 문서 가이드

- 제품 비전: `docs/00-product/vision.md`
- 로드맵: `docs/00-product/roadmap.md`
- 기능 요구사항: `docs/01-requirements/functional-requirements.md`
- 아키텍처 개요: `docs/02-architecture/overview.md`
- 로컬 개발 환경: `docs/04-development/local-setup.md`
- 테스트 전략: `docs/04-development/testing-strategy.md`
- Azure 배포: `docs/05-operations/deployment.md`

## 프로젝트 구조

- `frontend/`: 모바일 우선 웹 화면
- `backend/`: Express API
- `db/`: PostgreSQL 스키마와 마이그레이션

## 시작하기

1. `npm install`
2. `npm run dev:backend`
3. 다른 터미널에서 `npm run dev:frontend`

기본 포트는 다음과 같습니다.
- 백엔드: `3000`
- 프론트엔드: `3001`

## 라이선스

추후 결정
