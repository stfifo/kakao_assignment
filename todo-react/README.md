# Todo App: React 19 + Vite

`Week-02-vanillaJS` 브랜치의 Todo 앱을 React 19로 구현

## 실행 방법

```bash
npm install
npm run dev      # 개발 서버 (http://localhost:5173)
npm run build    # 프로덕션 빌드 → dist/
npm run lint     # ESLint 검사
```

---

## 파일 구조

```
todo-react/
├── public/
│   ├── favicon.svg
│   └── icons.svg              # SVG 스프라이트 (아이콘 모음)
├── src/
│   ├── utils/
│   │   └── dateUtils.js       # 날짜 관련 순수 함수 모음
│   ├── components/
│   │   ├── WeeklyView.jsx     # 주간 뷰 섹션 (레이아웃)
│   │   ├── WeekNav.jsx        # 주간 이전/다음 네비게이션 바
│   │   ├── WeekDayCell.jsx    # 주간 그리드 날짜 셀 1개
│   │   ├── DateNav.jsx        # 일간 이전/다음 네비게이션 바
│   │   ├── TodoInput.jsx      # 할 일 입력창 + 추가 버튼
│   │   ├── FilterTabs.jsx     # 전체/진행 중/완료 필터 탭
│   │   ├── TodoList.jsx       # 할 일 목록 컨테이너
│   │   ├── TodoEmptyState.jsx # 빈 목록 안내 메시지
│   │   ├── TodoItem.jsx       # 할 일 항목 컨테이너 (모드 전환)
│   │   ├── TodoViewMode.jsx   # 항목 뷰 모드 (텍스트 + 버튼)
│   │   └── TodoEditMode.jsx   # 항목 수정 모드 (input + 저장/취소)
│   ├── App.jsx                # 루트 컴포넌트, 전역 state 소유
│   ├── App.css                # 전체 스타일
│   ├── index.css              # 리셋 + body 레이아웃
│   └── main.jsx               # React 앱 진입점
└── index.html
```

---

## 파일별 기능 설명

#### `src/utils/dateUtils.js`

날짜 관련 순수 함수만 모아둔 유틸 모듈. 컴포넌트에 의존성이 없어 독립적으로 테스트하거나 재사용할 수 있다.

| 함수 | 설명 |
|------|------|
| `toDateKey(date)` | `Date` 객체를 `"YYYY-MM-DD"` 문자열로 변환. Todo의 `date` 필드와 비교할 때 사용 |
| `isToday(date)` | 주어진 날짜가 오늘인지 여부 반환 |
| `formatDateLabel(date)` | 일간 네비게이션에 표시할 레이블 생성. 오늘이면 `"오늘 · M월 D일 (요일)"` 형식 |
| `getWeekDates(offset)` | `offset` 기준 주의 월~일 `Date` 배열 7개 반환. `0`이면 이번 주 |
| `formatWeekLabel(dates)` | 주간 네비게이션 레이블 생성. 같은 달이면 `"M월 D일 ~ D일"`, 월 경계면 `"M월 D일 ~ M월 D일"` |
| `syncWeekOffsetToDate(date)` | 날짜를 받아 해당 날짜가 속한 주의 `weekOffset` 값을 계산. 일간↔주간 뷰 동기화에 사용 |

---

#### `src/App.jsx`

앱 전체의 전역 state를 소유하는 루트 컴포넌트. 모든 데이터 변경 함수가 여기에 정의되어 있고, 자식 컴포넌트에 props/콜백으로 전달된다.

**보유 state**

| state | 타입 | 초기값 | 역할 |
|-------|------|--------|------|
| `todos` | `{id, text, completed, date}[]` | localStorage 복원값 | 전체 Todo 배열 |
| `currentDate` | `Date` | 오늘 | 일간 뷰에서 보고 있는 날짜 |
| `weekOffset` | `number` | `0` | 주간 뷰 오프셋 (0 = 이번 주) |
| `currentFilter` | `string` | `'all'` | 현재 탭 필터 |

**정의된 함수**

| 함수 | 동작 |
|------|------|
| `addTodo(text)` | `currentDate`로 새 항목 추가 |
| `deleteTodo(id)` | id로 항목 삭제 |
| `toggleTodo(id)` | 완료 상태 반전 |
| `editTodo(id, text)` | 텍스트 수정 |
| `handleSelectDate(date)` | 주간 셀 클릭 시 일간 날짜와 주간 offset 동시 변경 |
| `handlePrevDate / handleNextDate` | 일간 이전/다음 이동, 주간 offset도 자동 동기화 |

---

#### 기타

- `src/components/WeeklyView.jsx`
  주간 섹션의 **레이아웃 컴포넌트**. `getWeekDates(weekOffset)`으로 7개 날짜를 계산하고, `WeekNav`와 `WeekDayCell × 7`을 조합해 렌더링한다. 각 셀의 Todo 개수는 `todos` 배열을 날짜 키로 필터링해 계산한다.

- `src/components/WeekNav.jsx`
  주간 뷰의 **이전/다음 주 네비게이션 바**. 이전(`‹`) · 다음(`›`) 버튼과 주간 레이블을 렌더링한다.

- `src/components/WeekDayCell.jsx`
  주간 그리드의 **날짜 셀 1개**. 요일 이름, 날짜 숫자, Todo 개수 배지를 표시한다. `is-today`, `is-selected`, `is-saturday`, `is-sunday` 클래스를 조건에 따라 부여한다.

- `src/components/DateNav.jsx`
  일간 뷰의 **이전/다음 날짜 네비게이션 바**. 오늘 날짜일 때 레이블에 `is-today` 클래스를 추가해 보라색으로 강조한다.

- `src/components/TodoInput.jsx`
  **입력창 + 추가 버튼** 컴포넌트. `text`와 `error` state를 내부에서 관리한다. 입력값이 빈 문자열이면 에러 메시지를 표시하고 `onAdd`를 호출하지 않는다. Enter 키로도 추가할 수 있다.

- `src/components/FilterTabs.jsx`
  **전체 / 진행 중 / 완료** 탭 바. 현재 선택된 탭에 `active` 클래스를 부여하고, 클릭 시 `onSwitch(filter)`를 호출한다.

- `src/components/TodoList.jsx`
  **할 일 목록 컨테이너**. `todos`가 비어 있으면 `TodoEmptyState`를, 항목이 있으면 `TodoItem` 목록을 렌더링한다. `onToggle`, `onDelete`, `onEdit`에 각 항목의 `id`를 바인딩해 자식에 전달한다.

- `src/components/TodoEmptyState.jsx`
  **빈 목록 안내 메시지** 컴포넌트. `filter` prop에 따라 다른 문구를 표시한다.

  | filter | 메시지 |
  |--------|--------|
  | `all` | 이 날의 할 일을 추가해 보세요! |
  | `active` | 진행 중인 할 일이 없어요. |
  | `completed` | 완료된 할 일이 없어요. |

- `src/components/TodoItem.jsx`

  **할 일 항목 컨테이너**. `isEditing` state를 갖고, 값에 따라 `TodoViewMode`와 `TodoEditMode` 중 하나를 렌더링한다. 수정 모드 전환의 진입점 역할만 담당한다.

- `src/components/TodoViewMode.jsx`
  **뷰 모드 렌더링**. 할 일 텍스트와 완료/수정/삭제 버튼을 표시한다. 완료 상태에 따라 버튼 텍스트와 스타일이 바뀐다 (`완료` ↔ `되돌리기`).

- `src/components/TodoEditMode.jsx`

  **수정 모드 렌더링**. `editText` state를 내부에서 관리한다. 저장 시 `onSave(text)`를 호출하고, 취소 시 `onCancel()`을 호출해 `TodoItem`이 뷰 모드로 전환하게 한다. Enter로 저장, Esc로 취소할 수 있다.

---

## 데이터 흐름

#### 전체 구조

```
localStorage
    ↕ (useEffect 자동 동기화)
App (todos, currentDate, weekOffset, currentFilter)
    ↓ props / 콜백
  각 컴포넌트
```

모든 state는 `App`이 소유한다. 자식 컴포넌트는 props로 데이터를 받고, 콜백으로 변경을 요청한다.

---

#### Todo CRUD 흐름

```
사용자 입력 (TodoInput)
  → onAdd(text) 콜백 호출
  → App.addTodo(text)
  → setTodos(prev => [...prev, 새항목])
  → useEffect 실행 → localStorage 저장
  → 리렌더링 → TodoList에 반영
```

삭제 / 완료 토글 / 수정도 동일한 패턴  
`콜백 호출 → App의 setter → useEffect → 리렌더링`

---

#### 날짜 이동 흐름

```
이전/다음 버튼 클릭 (DateNav)
  → onPrev / onNext 콜백 호출
  → App: 새 날짜 계산
  → setCurrentDate(새 날짜)
  → setWeekOffset(syncWeekOffsetToDate(새 날짜))  ← 주간 뷰 자동 동기화
  → 리렌더링 → DateNav 레이블 + WeeklyView 선택 셀 갱신
```

주간 셀 클릭도 역방향으로 동일하게 동작한다:  
`WeekDayCell 클릭 → onSelectDate → setCurrentDate + setWeekOffset → 리렌더링`

---

#### 수정 모드 전환 흐름

```
수정 버튼 클릭 (TodoViewMode)
  → onStartEdit() 콜백 호출
  → TodoItem: setIsEditing(true)
  → TodoEditMode 렌더링 (editText 초기화)

저장 버튼 클릭 또는 Enter (TodoEditMode)
  → onSave(text) 콜백 호출
  → TodoItem: onEdit(text) 전달 → App.editTodo(id, text)
  → TodoItem: setIsEditing(false)
  → TodoViewMode 복귀

취소 버튼 클릭 또는 Esc (TodoEditMode)
  → onCancel() 콜백 호출
  → TodoItem: setIsEditing(false)
  → TodoViewMode 복귀 (변경 없음)
```

---

#### 로컬스토리지 동기화

```jsx
useEffect(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}, [todos])
```

`todos` state가 변경될 때마다 자동으로 실행된다. 초기 로드는 `useState`의 initializer 함수에서 1회만 수행한다.

```jsx
const [todos, setTodos] = useState(() => {
  const raw = localStorage.getItem(STORAGE_KEY)
  try { return raw ? JSON.parse(raw) : [] } catch { return [] }
})
```
