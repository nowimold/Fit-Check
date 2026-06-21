# Fit Check 문서 구조 구축 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 비개발자도 이해하기 쉬운 웹앱 문서 구조를 생성하고, 각 문서는 사용자 질문 기반으로 점진적으로 채운다.

**Architecture:** 루트 README는 전체 진입점으로 유지하고, `docs/` 아래를 제품/요구사항/아키텍처/개발/운영/의사결정으로 분리한다. 각 문서는 "쉽게 설명" 섹션과 "결정사항" 섹션을 고정 템플릿으로 가져가며, 배포는 Azure 기준으로 운영 문서를 구성한다.

**Tech Stack:** Markdown, GitHub repository docs layout, Azure deployment documentation (concept level)

---

### Task 1: 문서 디렉터리와 파일 뼈대 생성

**Files:**
- Create: `docs/00-product/vision.md`
- Create: `docs/00-product/roadmap.md`
- Create: `docs/01-requirements/functional-requirements.md`
- Create: `docs/01-requirements/non-functional-requirements.md`
- Create: `docs/02-architecture/overview.md`
- Create: `docs/02-architecture/frontend.md`
- Create: `docs/02-architecture/backend.md`
- Create: `docs/02-architecture/data-model.md`
- Create: `docs/03-api/api-overview.md`
- Create: `docs/03-api/auth-and-errors.md`
- Create: `docs/04-development/local-setup.md`
- Create: `docs/04-development/coding-conventions.md`
- Create: `docs/04-development/testing-strategy.md`
- Create: `docs/05-operations/deployment.md`
- Create: `docs/05-operations/monitoring.md`
- Create: `docs/06-decisions/adr-template.md`

- [ ] **Step 1: 문서 폴더 구조 생성**

Run:
```bash
mkdir -p docs/00-product docs/01-requirements docs/02-architecture docs/03-api docs/04-development docs/05-operations docs/06-decisions
```
Expected: 각 하위 디렉터리가 생성된다.

- [ ] **Step 2: 파일 템플릿 생성**

각 파일에 아래 공통 템플릿을 사용한다.

```md
# <문서 제목>

## 한 줄 요약
이 문서는 무엇을 결정하는지 아주 쉽게 설명합니다.

## 쉽게 설명하면
- 비개발자 기준 설명

## 현재 결정사항
- 아직 미정

## 다음에 사용자에게 물어볼 질문
- 질문 1개
```

- [ ] **Step 3: 배포 문서는 Azure 기준으로 초기화**

`docs/05-operations/deployment.md`에 아래 초기 문구 포함:

```md
## 배포 대상
- Azure (상용 환경 기준)
```

- [ ] **Step 4: 변경 사항 커밋**

```bash
git add docs
git commit -m "docs: add initial documentation structure for web app"
```

### Task 2: 사용자 질의 기반으로 핵심 6개 문서 내용 채우기

**Files:**
- Modify: `docs/00-product/vision.md`
- Modify: `docs/00-product/roadmap.md`
- Modify: `docs/01-requirements/functional-requirements.md`
- Modify: `docs/02-architecture/overview.md`
- Modify: `docs/04-development/local-setup.md`
- Modify: `docs/04-development/testing-strategy.md`

- [ ] **Step 1: 문서별 질문 1개씩 순차 수집**

질문 순서:
1. vision → 앱이 해결할 문제
2. roadmap → 1차 출시 범위
3. functional requirements → 필수 기능 3개
4. architecture overview → 프론트/백엔드 분리 필요 여부
5. local setup → 로컬 실행 수준(클릭형/명령형)
6. testing strategy → 수동 테스트 우선 여부

- [ ] **Step 2: 답변 반영하여 쉬운 문장으로 문서 갱신**

반영 규칙:
- 전문 용어 최소화
- 1문장 1의미
- 예시 중심 설명

- [ ] **Step 3: Azure 배포 전제 반영**

`deployment.md`에 아래 항목을 구체화:
- Azure에 올릴 앱 구성(웹앱/백엔드/DB)
- 배포 전 체크리스트
- 실패 시 롤백 기본 절차

- [ ] **Step 4: 변경 사항 커밋**

```bash
git add docs
git commit -m "docs: fill core docs with user-guided content"
```

### Task 3: README에 문서 안내 연결

**Files:**
- Modify: `README.md`

- [ ] **Step 1: 문서 인덱스 섹션 추가**

아래 링크 섹션을 추가:

```md
## 문서 가이드
- 제품 비전: `docs/00-product/vision.md`
- 로드맵: `docs/00-product/roadmap.md`
- 기능 요구사항: `docs/01-requirements/functional-requirements.md`
- 아키텍처 개요: `docs/02-architecture/overview.md`
- 로컬 실행: `docs/04-development/local-setup.md`
- 테스트 전략: `docs/04-development/testing-strategy.md`
- Azure 배포: `docs/05-operations/deployment.md`
```

- [ ] **Step 2: 변경 사항 커밋**

```bash
git add README.md
git commit -m "docs: link documentation index from readme"
```
