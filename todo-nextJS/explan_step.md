# explan

# Next.js로 Todo 앱 만들기

### 활용 스택

| Frontend | Backend |
| --- | --- |
| Next.js (v15+) | FastAPI (v0.111+) |
| React (v18+) | Uvicorn |
| TypeScript (v5) | SQLAlchemy |
| Tailwind CSS (v4) | SQLite |
| Axios  | Pydantic (v2) |

### 과제 진행 순서

바로 정리해드릴게요.

---

# Next.js Todo 앱 구현 진행사항

## Step 1. 초기 세팅

- 2차 과제 코드 기반으로 프론트/백엔드 기능 분리 정리함
- 로컬스토리지 기반 상태 관리 → FastAPI 서버 기반으로 전환 계획 수립함
- `front/`, `back/` 디렉토리 분리하여 프로젝트 구조 세팅함
- Next.js App Router 기반 (`app/` 디렉토리) 프로젝트 초기화함
- FastAPI 프로젝트 초기화 및 의존성 설치함

## Step 2. FastAPI Todo CRUD API 구현

- `main.py`에 SQLAlchemy DB 모델 (`Todo`) 정의함
- Pydantic 스키마 (`TodoCreate` 등) 정의함
- CORS 미들웨어 설정함
- DB 세션 의존성 (`get_db`) 구현함
- 아래 엔드포인트 구현함
  - `GET /todos` — 전체 목록 조회
  - `POST /todos` — 새 Todo 생성
  - `PUT /todos/{id}` — Todo 수정
  - `DELETE /todos/{id}` — Todo 삭제
- `localhost:8000/docs`에서 각 엔드포인트 동작 확인함

## Step 3. Next.js Todo 페이지 구현

- `app/todos/page.tsx` — 목록 페이지 구현함
- `app/todos/new/page.tsx` — 생성 페이지 구현함
- `app/todos/[todoId]/page.tsx` — 수정 페이지 구현함
- `app/todos/error.tsx` — 에러 화면 구현함
- `app/todos/loading.tsx` — 로딩 화면 구현함
- Server Component / Client Component 역할에 맞게 구분함
  - 인터랙션 필요한 컴포넌트에만 `"use client"` 선언함

## Step 4. API Route 작성 및 프론트-백엔드 연동

- `app/api/todos/route.ts` 작성함 — 클라이언트 요청을 FastAPI로 전달하는 프록시 역할
- `app/actions.ts` 작성함 — Server Component에서 직접 호출하는 서버 함수 정의
- 목록 조회, 생성, 수정, 삭제 전체 흐름 연동 완료함
- 브라우저 네트워크 탭에서 요청 흐름 확인함

## Step 5. 환경변수 설정

- `front/.env.local`에 API URL 환경변수 분리함
  - `NEXT_PUBLIC_API_URL`, `BACKEND_URL` 설정
- `back/.env.local`에 DB 설정 분리함
  - `DATABASE_URL` 설정
- `.env.local` `.gitignore`에 추가함
- 코드 내 하드코딩된 URL 제거 및 환경변수로 교체함

## Step 6. 서버 기반 상태별 필터링 구현

- 전체 / 진행 중 / 완료 필터 탭 구현함
- 필터 상태를 URL 파라미터 (`?filter=active`, `?filter=completed`)로 관리함
- FastAPI에 쿼리 파라미터 기반 필터링 로직 추가함
  - `GET /todos?filter=active`
  - `GET /todos?filter=completed`
- 새로고침 및 URL 직접 입력 시에도 필터 상태 유지됨을 확인함

## Step 7. 서버 기반 검색 기능 구현

- 키워드 검색창 구현함
- 검색어를 URL 파라미터 (`?search=키워드`)로 관리함
- 필터 + 검색 동시 적용 가능하도록 구현함 (`?filter=active&search=키워드`)
- FastAPI에 검색 엔드포인트 추가함
  - `GET /todos?search=키워드`
  - `GET /todos?filter=active&search=키워드`
- 검색 결과가 서버에서 처리되어 반환됨을 네트워크 탭에서 확인함