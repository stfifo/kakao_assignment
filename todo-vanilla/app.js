// ── DOM 요소 참조 ──
const todoInput        = document.getElementById('todoInput');
const addButton        = document.getElementById('addButton');
const todoList         = document.getElementById('todoList');
const errorMessage     = document.getElementById('errorMessage');
const tabItems         = document.querySelectorAll('.tab-item');
const prevDateButton   = document.getElementById('prevDateButton');
const nextDateButton   = document.getElementById('nextDateButton');
const currentDateLabel = document.getElementById('currentDateLabel');
const prevWeekButton   = document.getElementById('prevWeekButton');
const nextWeekButton   = document.getElementById('nextWeekButton');
const weekLabel        = document.getElementById('weekLabel');
const weekGrid         = document.getElementById('weekGrid');
const dailyView        = document.getElementById('dailyView');
const weeklyView       = document.getElementById('weeklyView');
const viewButtons      = document.querySelectorAll('.view-btn');

// 전체 Todo 데이터 배열 (id, text, completed, date 필드)
let todos = [];

// 고유 id 카운터
let nextId = 1;

// 현재 상태 필터 ('all' | 'active' | 'completed')
let currentFilter = 'daily';

// 현재 선택된 날짜 (일간 뷰)
let currentDate = new Date();

// 현재 뷰 ('daily' | 'weekly')
let currentView = 'daily';

// 주간 뷰 오프셋 (0 = 이번 주, -1 = 지난 주, 1 = 다음 주)
let weekOffset = 0;

// ── 날짜 유틸 ──

// Date 객체를 'YYYY-MM-DD' 문자열로 변환
function toDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// 오늘 날짜인지 확인
function isToday(date) {
  return toDateKey(date) === toDateKey(new Date());
}

// 일간 뷰 날짜 표시 문자열
function formatDateLabel(date) {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const m    = date.getMonth() + 1;
  const d    = date.getDate();
  const day  = days[date.getDay()];
  const base = `${m}월 ${d}일 (${day})`;
  return isToday(date) ? `오늘 · ${base}` : base;
}

// ── 주간 유틸 ──

// offset 기준 주의 월요일 Date 반환
function getWeekMonday(offset) {
  const today      = new Date();
  today.setHours(0, 0, 0, 0);
  const dayOfWeek  = today.getDay(); // 0=일, 1=월 ... 6=토
  // 월요일까지의 차이 (일요일은 -6)
  const daysToMon  = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday     = new Date(today);
  monday.setDate(today.getDate() + daysToMon + offset * 7);
  return monday;
}

// 해당 주의 월~일 7개 Date 배열 반환
function getWeekDates(offset) {
  const monday = getWeekMonday(offset);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

// 주간 네비게이션 레이블 (같은 달: 'M월 D일 ~ D일', 월 경계: 'M월 D일 ~ M월 D일')
function formatWeekLabel(dates) {
  const start = dates[0];
  const end   = dates[6];
  const year  = start.getFullYear();
  if (start.getMonth() === end.getMonth()) {
    return `${year}년 ${start.getMonth() + 1}월 ${start.getDate()}일 ~ ${end.getDate()}일`;
  }
  return `${year}년 ${start.getMonth() + 1}월 ${start.getDate()}일 ~ ${end.getMonth() + 1}월 ${end.getDate()}일`;
}

// ── 뷰 전환 ──
function switchView(view) {
  currentView = view;

  // 토글 버튼 active 클래스 갱신
  viewButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === view);
  });

  if (view === 'daily') {
    dailyView.classList.remove('hidden');
    weeklyView.classList.add('hidden');
    renderDateNav();
    renderTodos();
  } else {
    dailyView.classList.add('hidden');
    weeklyView.classList.remove('hidden');
    renderWeeklyView();
  }
}

// ── 일간 뷰: 날짜 네비게이션 렌더링 ──
function renderDateNav() {
  currentDateLabel.textContent = formatDateLabel(currentDate);
  currentDateLabel.classList.toggle('is-today', isToday(currentDate));
}

function moveToPrevDate() {
  currentDate.setDate(currentDate.getDate() - 1);
  renderDateNav();
  renderTodos();
}

function moveToNextDate() {
  currentDate.setDate(currentDate.getDate() + 1);
  renderDateNav();
  renderTodos();
}

// ── 주간 뷰: 렌더링 ──
function renderWeeklyView() {
  const dates    = getWeekDates(weekOffset);
  const DAY_NAMES = ['월', '화', '수', '목', '금', '토', '일'];

  weekLabel.textContent = formatWeekLabel(dates);
  weekGrid.innerHTML    = '';

  dates.forEach((date, index) => {
    const dateKey  = toDateKey(date);
    const dayTodos = todos.filter(t => t.date === dateKey);

    // 오늘 / 주말 여부에 따라 클래스 결정
    const colClasses = ['week-day-col'];
    if (isToday(date))  colClasses.push('is-today');
    if (index === 5)    colClasses.push('is-saturday');
    if (index === 6)    colClasses.push('is-sunday');

    const col = document.createElement('div');
    col.className = colClasses.join(' ');

    // 날짜 헤더
    col.innerHTML = `
      <div class="week-day-header">
        <span class="week-day-name">${DAY_NAMES[index]}</span>
        <span class="week-day-date">${date.getDate()}</span>
      </div>
      <div class="week-todo-count${dayTodos.length === 0 ? ' is-empty' : ''}">
        ${dayTodos.length}개
      </div>
    `;

    // 마크다운 체크박스 형식 Todo 목록
    const ul = document.createElement('ul');
    ul.className = 'week-todo-list';

    dayTodos.forEach(todo => {
      const li = document.createElement('li');
      li.className = `week-todo-item${todo.completed ? ' completed' : ''}`;
      // 완료: ☑ (체크된 박스), 미완료: ☐ (빈 박스)
      li.innerHTML = `
        <span class="week-checkbox">${todo.completed ? '☑' : '☐'}</span>
        <span class="week-todo-text">${escapeHtml(todo.text)}</span>
      `;
      ul.appendChild(li);
    });

    col.appendChild(ul);
    weekGrid.appendChild(col);
  });
}

function moveToPrevWeek() {
  weekOffset--;
  renderWeeklyView();
}

function moveToNextWeek() {
  weekOffset++;
  renderWeeklyView();
}

// ── Todo 추가 ──
function addTodo() {
  const text = todoInput.value.trim();

  if (!text) {
    errorMessage.classList.remove('hidden');
    todoInput.focus();
    return;
  }

  errorMessage.classList.add('hidden');

  // 현재 선택된 날짜를 함께 저장
  const newTodo = { id: nextId++, text, completed: false, date: toDateKey(currentDate) };
  todos.push(newTodo);

  todoInput.value = '';
  todoInput.focus();

  renderTodos();
}

// ── Todo 삭제 ──
function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  renderTodos();
}

// ── Todo 완료 토글 ──
function toggleComplete(id) {
  const todo = todos.find(todo => todo.id === id);
  if (todo) todo.completed = !todo.completed;
  renderTodos();
}

// ── 수정 모드 진입 ──
function enterEditMode(id) {
  const item = document.querySelector(`[data-id="${id}"]`);
  const todo = todos.find(todo => todo.id === id);
  if (!item || !todo) return;

  const textSpan   = item.querySelector('.todo-text');
  const actionsDiv = item.querySelector('.todo-actions');

  const editInput     = document.createElement('input');
  editInput.type      = 'text';
  editInput.className = 'edit-input';
  editInput.value     = todo.text;

  actionsDiv.innerHTML = `
    <button class="btn btn-save"   onclick="saveEdit(${id})">저장</button>
    <button class="btn btn-cancel" onclick="renderTodos()">취소</button>
  `;

  editInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') saveEdit(id);
    if (e.key === 'Escape') renderTodos();
  });

  textSpan.replaceWith(editInput);
  editInput.focus();
}

// ── 수정 내용 저장 ──
function saveEdit(id) {
  const item      = document.querySelector(`[data-id="${id}"]`);
  const editInput = item && item.querySelector('.edit-input');
  if (!editInput) return;

  const newText = editInput.value.trim();
  if (!newText) { editInput.focus(); return; }

  const todo = todos.find(todo => todo.id === id);
  if (todo) todo.text = newText;

  renderTodos();
}

// ── 현재 날짜 + 필터에 맞는 Todo 반환 ──
function getFilteredTodos() {
  const dateTodos = todos.filter(t => t.date === toDateKey(currentDate));
  if (currentFilter === 'active')    return dateTodos.filter(t => !t.completed);
  if (currentFilter === 'completed') return dateTodos.filter(t =>  t.completed);
  return dateTodos;
}

// ── 상태 필터 탭 전환 ──
function switchTab(filter) {
  currentFilter = filter;
  tabItems.forEach(tab => {
    tab.classList.toggle('active', tab.dataset.filter === filter);
  });
  renderTodos();
}

// ── 일간 뷰 Todo 목록 렌더링 ──
function renderTodos() {
  todoList.innerHTML = '';

  const filteredTodos = getFilteredTodos();

  if (filteredTodos.length === 0) {
    const emptyMsg = {
      all:       '이 날의 할 일을 추가해 보세요!',
      active:    '진행 중인 할 일이 없어요.',
      completed: '완료된 할 일이 없어요.',
    };
    todoList.innerHTML = `<p class="empty-message">${emptyMsg[currentFilter]}</p>`;
    return;
  }

  filteredTodos.forEach(todo => {
    const li = document.createElement('li');
    li.className  = `todo-item${todo.completed ? ' completed' : ''}`;
    li.dataset.id = todo.id;

    li.innerHTML = `
      <span class="todo-text">${escapeHtml(todo.text)}</span>
      <div class="todo-actions">
        <button class="btn ${todo.completed ? 'btn-back' : 'btn-complete'}" onclick="toggleComplete(${todo.id})">
          ${todo.completed ? '되돌리기' : '완료'}
        </button>
        <button class="btn btn-edit"   onclick="enterEditMode(${todo.id})">수정</button>
        <button class="btn btn-delete" onclick="deleteTodo(${todo.id})">삭제</button>
      </div>
    `;

    todoList.appendChild(li);
  });
}

// XSS 방지: HTML 특수문자 이스케이프
function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ── 이벤트 리스너 ──
addButton.addEventListener('click', addTodo);

todoInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') addTodo();
});

tabItems.forEach(tab => {
  tab.addEventListener('click', () => switchTab(tab.dataset.filter));
});

prevDateButton.addEventListener('click', moveToPrevDate);
nextDateButton.addEventListener('click', moveToNextDate);
prevWeekButton.addEventListener('click', moveToPrevWeek);
nextWeekButton.addEventListener('click', moveToNextWeek);

viewButtons.forEach(btn => {
  btn.addEventListener('click', () => switchView(btn.dataset.view));
});

// ── 초기 렌더링 ──
currentFilter = 'all';  // 필터 초기값 보정
renderDateNav();
renderTodos();
