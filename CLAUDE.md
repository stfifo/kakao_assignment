# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

This is a weekly Kakao assignment repo. Each week's work lives in a branch (`week-0N-choijieun`) and a corresponding subdirectory.

| Week | Directory | Stack |
|------|-----------|-------|
| 02 | *(previous branch)* | Vanilla JS Todo app |
| 03 | `todo-react/` | React 19 + Vite |

## todo-react Commands

All commands run from inside `todo-react/`:

```bash
npm run dev       # Start dev server (HMR)
npm run build     # Production build → dist/
npm run preview   # Preview production build
npm run lint      # ESLint (JS/JSX files)
```

No test runner is configured.

## Architecture

**`todo-react/`** is a Vite 8 + React 19 project (plain JS, no TypeScript).

- Entry: `index.html` → `src/main.jsx` → `src/App.jsx`
- Styling: `src/index.css` (global/reset) and `src/App.css` (component-scoped); uses CSS custom properties for theming
- Public assets served directly: `public/favicon.svg`, `public/icons.svg` (SVG sprite, referenced via `<use href="/icons.svg#...">`)
- Static assets imported into JS: `src/assets/` (hero.png, logos)

ESLint is configured with `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh`; `dist/` is excluded.

---

## week-02-choijieun (Vanilla JS) 구현 내용

### 구현 기능 목록

- Todo 추가 (버튼 클릭 또는 Enter)
- Todo 삭제
- 완료 토글 (완료 ↔ 되돌리기)
- 인라인 수정 (수정 버튼 → input 전환, Enter/Esc 지원)
- 탭 필터: 전체 / 진행 중 / 완료
- 일간 뷰: 날짜별 Todo 목록, 이전/다음 날짜 이동
- 주간 뷰: 월~일 7칸 그리드, 날짜 셀 클릭 시 일간 뷰 전환
- 주간 뷰 배지: 날짜 셀에 해당 날짜 Todo 개수 표시
- 일간↔주간 뷰 양방향 날짜 동기화
- 빈 목록 상태별 안내 문구
- XSS 방어: `escapeHtml()`로 텍스트 이스케이프
- 로컬스토리지 영속성 (새로고침 후 데이터 유지)

### 파일/모듈 구조

```
todo-vanilla/
  index.html   — 마크업 (DOM 구조 정의)
  style.css    — 전체 스타일
  app.js       — 전체 로직 (모듈화 없이 전역 스코프 단일 파일)
```

`app.js` 내부 논리적 섹션 순서:

1. DOM 참조 (`getElementById` / `querySelectorAll`)
2. 로컬스토리지 — `saveTodos()` / `loadTodos()`
3. 전역 상태 변수 선언
4. 날짜 유틸 — `toDateKey()` / `isToday()` / `formatDateLabel()`
5. 주간 유틸 — `getWeekDates()` / `formatWeekLabel()` / `syncWeekOffsetToDate()`
6. 주간 뷰 렌더링 — `renderWeeklyView()`
7. 일간 네비게이션 — `renderDateNav()` / `moveToPrevDate()` / `moveToNextDate()`
8. Todo CRUD — `addTodo()` / `deleteTodo()` / `toggleComplete()` / `enterEditMode()` / `saveEdit()`
9. 필터 & 렌더링 — `getFilteredTodos()` / `switchTab()` / `renderTodos()`
10. 이벤트 리스너 등록
11. 초기화: `loadTodos()` → `renderWeeklyView()` → `renderDateNav()` → `renderTodos()`

### 주요 로직 요약

**전역 상태 변수:**

| 변수 | 타입 | 역할 |
|------|------|------|
| `todos` | `{id, text, completed, date}[]` | 전체 Todo 배열 |
| `nextId` | `number` | 다음 항목에 부여할 ID |
| `currentFilter` | `'all' \| 'active' \| 'completed'` | 현재 탭 |
| `currentDate` | `Date` | 일간 뷰 선택 날짜 |
| `weekOffset` | `number` | 주간 뷰 오프셋 (0 = 이번 주) |

**데이터 흐름:** 상태 변경 → `saveTodos()` → 렌더링 함수 직접 호출 (단방향 수동 업데이트).  
날짜 이동 시 `syncWeekOffsetToDate()`로 일간↔주간이 상호 동기화됨.  
`enterEditMode()` / `saveEdit()`은 인라인 `onclick` 속성으로 전역 함수 직접 호출.

---

## week-03-choijieun (React) 전환 목표

### Vanilla → React 컴포넌트 대응

| Vanilla 단위 | React 컴포넌트 |
|---|---|
| 주간 뷰 섹션 전체 | `<WeeklyView>` → `<WeekNav>` + `<WeekDayCell>` |
| 주간 네비게이션 바 | `<WeekNav dates onPrevWeek onNextWeek>` |
| 주간 날짜 셀 1개 | `<WeekDayCell date count isToday isSelected onClick>` |
| 일간 날짜 네비게이션 | `<DateNav currentDate onPrev onNext>` |
| 입력창 + 추가 버튼 | `<TodoInput onAdd>` |
| 탭 필터 바 | `<FilterTabs currentFilter onSwitch>` |
| Todo 목록 `<ul>` | `<TodoList>` → `<TodoItem>` 또는 `<TodoEmptyState>` |
| 빈 목록 안내 문구 | `<TodoEmptyState filter>` |
| Todo 항목 컨테이너 | `<TodoItem todo onToggle onDelete onEdit>` |
| Todo 뷰 모드 | `<TodoViewMode todo onToggle onDelete onStartEdit>` |
| Todo 수정 모드 | `<TodoEditMode initialText onSave onCancel>` |

`App.jsx`가 전역 상태를 소유하고 props/콜백으로 자식에게 전달하는 단방향 구조.

### 컴포넌트 트리

```
App
├── WeeklyView
│   ├── WeekNav                  — 주간 이전/다음 + 레이블
│   └── WeekDayCell × 7         — 날짜 셀 1개
├── DateNav                      — 일간 이전/다음 + 레이블
├── TodoInput                    — 입력창 + 추가 버튼 + 에러 메시지
├── FilterTabs                   — 전체/진행 중/완료 탭
└── TodoList
    ├── TodoEmptyState           — 빈 목록 안내 문구
    └── TodoItem × N
        ├── TodoViewMode         — 뷰 모드: 텍스트 + 완료/수정/삭제
        └── TodoEditMode         — 수정 모드: input + 저장/취소
```

### 상태 관리 방식

```jsx
// App.jsx (루트 상태)
const [todos, setTodos]               = useState(() => loadFromStorage())
const [currentDate, setCurrentDate]   = useState(new Date())
const [weekOffset, setWeekOffset]     = useState(0)
const [currentFilter, setCurrentFilter] = useState('all')

// 로컬스토리지 동기화
useEffect(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}, [todos])

// TodoItem — 모드 전환 로컬 상태
const [isEditing, setIsEditing] = useState(false)

// TodoEditMode — 수정 텍스트 로컬 상태
const [editText, setEditText] = useState(initialText)
```

- `todos` 변경은 항상 `setTodos(prev => ...)` 불변 업데이트로 처리
- `localStorage` 읽기는 `useState` 초기화 함수(`() => loadFromStorage()`)에서 1회만 실행
- `isEditing`은 `TodoItem`에, `editText`는 `TodoEditMode`에 격리하여 수정 모드 상태를 분리

### week-02와 달라지는 구조

| 항목 | week-02 (Vanilla) | week-03 (React) |
|------|-------------------|-----------------|
| 렌더링 | `innerHTML` 직접 교체 + 수동 함수 호출 | 상태 변경 시 자동 리렌더링 |
| 수정 모드 | DOM을 직접 `input`으로 교체 | `TodoEditMode` 컴포넌트로 조건부 렌더 |
| 이벤트 | `onclick="..."` 인라인 전역 함수 | props 콜백 (`onToggle`, `onDelete` 등) |
| XSS 방어 | 수동 `escapeHtml()` | JSX가 기본으로 이스케이프 처리 |
| 스타일 | 전역 단일 CSS | `App.css` 단일 파일, 컴포넌트 클래스명으로 구분 |
| 로컬스토리지 | CRUD마다 `saveTodos()` 직접 호출 | `useEffect`로 `todos` 변경 시 자동 동기화 |