# week-04: Next.js + FastAPI Todo 앱

## 브랜치 목표

React(Vite) 기반 Todo 앱을 **Next.js App Router + FastAPI** 풀스택 구조로 다시 만든다.

- 파일 기반 라우팅(`page.tsx`, `layout.tsx`)의 동작 방식 이해
- Server Component / Client Component 역할 구분
- FastAPI로 CRUD API 구현 후 Next.js와 연동
- 로컬스토리지 → 서버 API 기반 데이터 흐름으로 전환
- 환경변수로 API 엔드포인트 분리 관리
- URL 파라미터 기반 필터링 & 검색 구현

---

## 디렉토리 구조

```
todo-nextJS/
├── front/                         # Next.js 프로젝트
│   ├── app/
│   │   ├── layout.tsx             # 루트 레이아웃
│   │   ├── page.tsx               # 루트 페이지 (/ → /todos 리다이렉트)
│   │   ├── globals.css            # 전역 스타일 (Tailwind)
│   │   ├── todos/
│   │   │   ├── page.tsx           # Todo 목록 (Server Component)
│   │   │   ├── loading.tsx        # 로딩 화면
│   │   │   ├── error.tsx          # 에러 화면 (Client Component)
│   │   │   ├── new/
│   │   │   │   └── page.tsx       # Todo 생성 페이지
│   │   │   ├── [todoId]/
│   │   │   │   └── page.tsx       # Todo 수정 페이지
│   │   │   └── _components/       # 이 라우트 전용 클라이언트 컴포넌트
│   │   ├── api/
│   │   │   └── todos/
│   │   │       ├── route.ts       # GET /api/todos, POST /api/todos
│   │   │       └── [id]/
│   │   │           └── route.ts   # PUT /api/todos/[id], DELETE /api/todos/[id]
│   │   └── actions.ts             # Server Actions (FastAPI 직접 호출)
│   ├── .env.local                 # BACKEND_URL, NEXT_PUBLIC_API_URL
│   ├── next.config.ts
│   ├── tsconfig.json
│   └── package.json
└── back/                          # FastAPI 프로젝트
    ├── main.py                    # CRUD 엔드포인트 + CORS 설정
    ├── todos.db                   # SQLite DB (자동 생성, gitignore)
    ├── .env.local                 # DATABASE_URL
    └── requirements.txt
```

---

## 스택

| Frontend | Backend |
|----------|---------|
| Next.js 16 (App Router) | FastAPI 0.111+ |
| React 19 | Uvicorn |
| TypeScript 5 | SQLAlchemy 2 + SQLite |
| Tailwind CSS 4 | Pydantic 2 |

---

## Next.js Commands

모든 명령어는 `todo-nextJS/front/` 안에서 실행.

```bash
npm run dev          # 개발 서버 시작 (HMR, localhost:3000)
npm run build        # 프로덕션 빌드 → .next/
npm run start        # 프로덕션 서버 실행 (build 후 사용)
npm run lint         # ESLint 검사
npx tsc --noEmit     # TypeScript 타입 검사만 (빌드 없이)
```

FastAPI 백엔드는 `todo-nextJS/back/` 에서 실행.

```bash
pip install -r requirements.txt
uvicorn main:app --reload   # localhost:8000 (자동 재시작)
# Swagger UI → localhost:8000/docs
```

---

## Architecture

```
Browser
  │
  ├── /todos (GET)
  │     └── Next.js Server Component
  │           └── actions.ts ──────────────→ FastAPI GET /todos
  │                                                  └── SQLite
  │
  ├── /todos/new (POST form submit)
  │     └── Client Component
  │           └── fetch('/api/todos') ──→ route.ts ──→ FastAPI POST /todos
  │
  ├── /todos/[todoId] (PUT form submit)
  │     └── Client Component
  │           └── fetch('/api/todos/[id]') → route.ts ──→ FastAPI PUT /todos/{id}
  │
  └── TodoItem (toggle / delete)
        └── Client Component
              └── fetch('/api/todos/[id]') → route.ts ──→ FastAPI PUT/DELETE /todos/{id}
```

**App Router 핵심 파일 역할:**

| 파일 | 역할 |
|------|------|
| `layout.tsx` | 모든 페이지를 감싸는 공통 레이아웃 |
| `page.tsx` | URL에 대응하는 UI. 파일 위치 = URL 경로 |
| `loading.tsx` | `page.tsx`가 렌더링되기 전 자동으로 보여주는 Suspense UI |
| `error.tsx` | 렌더링 중 에러 발생 시 자동으로 보여주는 Error Boundary |
| `route.ts` | HTTP 요청을 받는 API 엔드포인트 (GET/POST/PUT/DELETE 핸들러) |
| `actions.ts` | 서버에서만 실행되는 함수. Server/Client Component 모두에서 호출 가능 |

---

## 구현 기능 목록

- Todo 추가 (생성 페이지 `/todos/new`)
- Todo 삭제
- 완료 토글 (진행 중 ↔ 완료)
- Todo 수정 (수정 페이지 `/todos/[todoId]`)
- 탭 필터: 전체 / 진행 중 / 완료 (URL 파라미터 `?filter=`)
- 키워드 검색 (URL 파라미터 `?search=`)
- 필터 + 검색 동시 적용 (`?filter=active&search=키워드`)
- 로딩 화면 (`loading.tsx`) — 데이터 fetch 중 자동 표시
- 에러 화면 (`error.tsx`) — API 장애 시 자동 표시
- 서버 기반 데이터 영속성 (SQLite, 새로고침 후 유지)
- 환경변수로 API URL 분리 (`.env.local`)

---

## 파일/모듈 구조

**`front/app/` 내부 논리적 흐름:**

```
layout.tsx
└── todos/page.tsx          ← searchParams(filter, search) 읽어 actions.ts 호출
    ├── _components/FilterTabs.tsx   ← URL 파라미터 변경 (useRouter)
    ├── _components/SearchInput.tsx  ← URL 파라미터 변경 (useRouter, debounce)
    └── _components/TodoItem.tsx     ← 완료 토글 / 삭제 (fetch → route.ts)

todos/new/page.tsx
└── _components/TodoForm.tsx         ← 입력 폼 (fetch POST → route.ts)

todos/[todoId]/page.tsx              ← id로 단건 조회 (actions.ts)
└── _components/TodoForm.tsx         ← 수정 폼 (fetch PUT → route.ts)

api/todos/route.ts                   ← GET, POST 핸들러 (→ FastAPI)
api/todos/[id]/route.ts              ← PUT, DELETE 핸들러 (→ FastAPI)

actions.ts                           ← getTodos(filter, search), getTodoById(id)
```

**`back/` 내부 구조:**

```
main.py
├── Todo          — SQLAlchemy 모델 (id, text, completed)
├── TodoCreate    — Pydantic 스키마 (생성 요청)
├── TodoUpdate    — Pydantic 스키마 (수정 요청, 필드 전부 Optional)
├── TodoResponse  — Pydantic 스키마 (응답)
├── get_db()      — DB 세션 의존성 (Depends)
└── 엔드포인트 5개  — GET(목록) / GET(단건) / POST / PUT / DELETE
```

---

## 주요 로직 요약

**필터 & 검색 흐름:**
```
URL ?filter=active&search=키워드
  → todos/page.tsx의 searchParams로 수신
  → actions.ts의 getTodos(filter, search) 호출
  → FastAPI GET /todos?filter=active&search=키워드
  → DB WHERE completed=false AND text LIKE '%키워드%'
  → 결과 반환 → Server Component 렌더링
```

**생성/수정/삭제 흐름:**
```
Client Component에서 fetch('/api/todos', { method: 'POST', body })
  → route.ts가 수신 → BACKEND_URL(FastAPI)로 forward
  → FastAPI가 DB 처리 후 응답
  → 클라이언트에서 router.refresh() → Server Component 재실행 → 목록 갱신
```

**`router.refresh()`의 역할:**
- Next.js에서 상태를 직접 변경하는 대신, 서버 데이터를 다시 fetch하도록 트리거
- week-03의 `setTodos(prev => ...)` 에 해당하는 역할

---

## API 목록

| Method | URL | 설명 |
|--------|-----|------|
| GET | `/todos` | 목록 조회 (`?filter=active\|completed`, `?search=키워드`) |
| GET | `/todos/{id}` | 단건 조회 (수정 페이지용) |
| POST | `/todos` | Todo 생성 |
| PUT | `/todos/{id}` | Todo 수정 (text, completed) |
| DELETE | `/todos/{id}` | Todo 삭제 |

---

## 데이터 흐름

```
# 목록 조회 (서버에서 직접)
Server Component → actions.ts → FastAPI → SQLite

# 생성 / 수정 / 삭제 (클라이언트 요청)
Client Component → fetch('/api/todos') → route.ts → FastAPI → SQLite
```

- **`actions.ts`**: Server Action. Server Component에서 호출. FastAPI를 서버 측에서 직접 fetch.
- **`route.ts`**: Next.js API Route. Client Component의 fetch 요청을 받아 FastAPI로 프록시.
- **필터/검색**: URL 파라미터(`?filter=`, `?search=`)로 관리 → FastAPI 서버에서 DB 필터링.

---

## Server Component vs Client Component 구분

| 파일 | 종류 | 이유 |
|------|------|------|
| `todos/page.tsx` | Server | 초기 데이터 fetch, 인터랙션 없음 |
| `todos/loading.tsx` | Server | 정적 UI |
| `todos/error.tsx` | Client | `useError` 훅 필요 (`"use client"` 필수) |
| `todos/new/page.tsx` | Server (shell) | form 컴포넌트를 Client로 분리 |
| `todos/[todoId]/page.tsx` | Server (shell) | 초기 데이터 fetch 후 Client form으로 전달 |
| `_components/FilterTabs.tsx` | Client | 클릭 → URL 파라미터 변경 |
| `_components/SearchInput.tsx` | Client | 입력 이벤트, debounce |
| `_components/TodoItem.tsx` | Client | 완료 토글, 삭제 버튼 클릭 |
| `_components/TodoForm.tsx` | Client | 폼 입력, submit 이벤트 |

---

## week-03 (React/Vite)과의 차이

| 항목 | week-03 (React/Vite) | week-04 (Next.js) |
|------|----------------------|-------------------|
| 라우팅 | 단일 페이지 SPA | 파일 기반 라우팅 (App Router) |
| 렌더링 | 전부 Client-side | Server/Client Component 혼합 |
| 데이터 저장 | 로컬스토리지 | FastAPI + SQLite |
| 데이터 읽기 | `useEffect` + localStorage | Server Component에서 직접 fetch |
| 데이터 쓰기 | `setTodos(prev => ...)` | API 호출 후 `router.refresh()` |
| 필터 상태 | `useState('all')` — 새로고침 시 초기화 | URL 파라미터 — 새로고침/공유 유지 |
| 검색 기능 | 없음 | URL 파라미터 + 서버 필터링 |
| XSS 방어 | JSX 기본 이스케이프 | JSX 기본 이스케이프 |
| 환경변수 | 불필요 | `.env.local`로 URL 분리 |
| TypeScript | 없음 (plain JS) | 전체 TypeScript |

---

## week-03 컴포넌트 대응

| week-03 (React/Vite) | week-04 (Next.js) | 변경 사항 |
|----------------------|-------------------|-----------|
| `App.jsx` (전역 상태 소유) | `todos/page.tsx` (Server Component) | useState → 없음; 데이터는 서버에서 fetch |
| `FilterTabs` | `_components/FilterTabs.tsx` | `currentFilter` prop → URL 파라미터 읽기/쓰기 |
| `TodoInput` | `todos/new/page.tsx` + `_components/TodoForm.tsx` | 독립 페이지로 분리 |
| `TodoList` | `todos/page.tsx` 내 인라인 렌더 | Server Component에서 직접 map |
| `TodoEmptyState` | `todos/page.tsx` 내 인라인 | 별도 컴포넌트 불필요 |
| `TodoItem` | `_components/TodoItem.tsx` | `onToggle`/`onDelete` prop → 내부에서 fetch 직접 호출 |
| `TodoViewMode` | `_components/TodoItem.tsx` 내 통합 | 분리 불필요 |
| `TodoEditMode` | `todos/[todoId]/page.tsx` + `_components/TodoForm.tsx` | 독립 수정 페이지로 분리 |
| `WeeklyView` / `WeekNav` / `WeekDayCell` | — | week-04 범위 외 (제거) |
| `DateNav` | — | week-04 범위 외 (제거) |
| *(없음)* | `_components/SearchInput.tsx` | 신규: 서버 검색 기능 |
| *(없음)* | `app/api/todos/route.ts` | 신규: Next.js API Route |
| *(없음)* | `actions.ts` | 신규: Server Actions |

---

## 진행 상태

| Step | 내용 | 상태 |
|------|------|------|
| 1 | 초기 세팅 (Next.js + FastAPI 프로젝트) | ✅ 완료 |
| 2 | FastAPI CRUD API 구현 | ✅ 완료 |
| 3 | Next.js Todo 페이지 구현 (Server/Client 컴포넌트 구분) | ✅ 완료 |
| 4 | API Route 작성 + 프론트-백엔드 연동 | ✅ 완료 |
| 5 | 환경변수 설정 | ⬜ 미완료 |
| 6 | 서버 기반 필터링 | ⬜ 미완료 |
| 7 | 서버 기반 검색 | ⬜ 미완료 |

---

## 환경변수

```bash
# front/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3000/api   # 클라이언트에서 route.ts 호출용
BACKEND_URL=http://localhost:8000               # 서버에서 FastAPI 직접 호출용

# back/.env.local (또는 .env)
DATABASE_URL=sqlite:///./todos.db
```

- `NEXT_PUBLIC_` 접두사: 브라우저에 노출됨 (클라이언트 번들에 포함)
- `BACKEND_URL`: 서버(Next.js)에서만 사용, 브라우저에 노출되지 않음
