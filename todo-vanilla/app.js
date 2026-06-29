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

// ── 로컬스토리지 연동 ──
const STORAGE_KEY = 'todo-app-data';

// todos 배열 전체를 JSON으로 직렬화해 저장
function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// 저장된 JSON을 파싱해 todos와 nextId를 복원
function loadTodos() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    todos = JSON.parse(raw);
    // 기존 항목 중 가장 큰 id + 1을 nextId로 설정해 중복 방지
    const maxId = todos.reduce((max, t) => Math.max(max, t.id), 0);
    nextId = maxId + 1;
  } catch {
    todos = []; // 파싱 실패 시 빈 배열로 초기화
  }
}

// 전체 Todo 데이터 배열 (id, text, completed, date 필드)
let todos = [];

let nextId        = 1;
let currentFilter = 'all';
let currentDate   = new Date();   // 일간 뷰에서 선택된 날짜
let weekOffset    = 0;            // 0 = 이번 주, -1 = 지난 주 ...

// ── 날짜 유틸 ──

function toDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function isToday(date) {
  return toDateKey(date) === toDateKey(new Date());
}

function formatDateLabel(date) {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const m    = date.getMonth() + 1;
  const d    = date.getDate();
  const day  = days[date.getDay()];
  const base = `${m}월 ${d}일 (${day})`;
  return isToday(date) ? `오늘 · ${base}` : base;
}

// ── 주간 유틸 ──

// offset 기준 주의 월~일 날짜 7개 반환
function getWeekDates(offset) {
  const today     = new Date();
  today.setHours(0, 0, 0, 0);
  const dow       = today.getDay();
  const daysToMon = dow === 0 ? -6 : 1 - dow;
  const monday    = new Date(today);
  monday.setDate(today.getDate() + daysToMon + offset * 7);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

// 주간 레이블 (같은 달: 'M월 D일 ~ D일', 월 경계: 'M월 D일 ~ M월 D일')
function formatWeekLabel(dates) {
  const start = dates[0];
  const end   = dates[6];
  const year  = start.getFullYear();
  if (start.getMonth() === end.getMonth()) {
    return `${year}년 ${start.getMonth() + 1}월 ${start.getDate()}일 ~ ${end.getDate()}일`;
  }
  return `${year}년 ${start.getMonth() + 1}월 ${start.getDate()}일 ~ ${end.getMonth() + 1}월 ${end.getDate()}일`;
}

// currentDate가 속한 주로 weekOffset을 동기화
function syncWeekOffsetToDate(date) {
  const base      = new Date();
  base.setHours(0, 0, 0, 0);
  const baseDow   = base.getDay();
  const baseMonday = new Date(base);
  baseMonday.setDate(base.getDate() + (baseDow === 0 ? -6 : 1 - baseDow));

  const target    = new Date(date);
  target.setHours(0, 0, 0, 0);
  const targetDow = target.getDay();
  const targetMonday = new Date(target);
  targetMonday.setDate(target.getDate() + (targetDow === 0 ? -6 : 1 - targetDow));

  const diff = Math.round((targetMonday - baseMonday) / (7 * 24 * 60 * 60 * 1000));
  weekOffset = diff;
}

// ── 주간 뷰 렌더링 ──
function renderWeeklyView() {
  const dates    = getWeekDates(weekOffset);
  const DAY_NAMES = ['월', '화', '수', '목', '금', '토', '일'];

  weekLabel.textContent = formatWeekLabel(dates);
  weekGrid.innerHTML    = '';

  dates.forEach((date, index) => {
    const count = todos.filter(t => t.date === toDateKey(date)).length;

    const colClasses = ['week-day-col'];
    if (isToday(date))                          colClasses.push('is-today');
    if (toDateKey(date) === toDateKey(currentDate)) colClasses.push('is-selected');
    if (index === 5)                            colClasses.push('is-saturday');
    if (index === 6)                            colClasses.push('is-sunday');

    const col = document.createElement('div');
    col.className = colClasses.join(' ');

    col.innerHTML = `
      <span class="week-day-name">${DAY_NAMES[index]}</span>
      <span class="week-day-date">${date.getDate()}</span>
      ${count > 0 ? `<div class="week-todo-count">${count}</div>` : ''}
    `;

    // 날짜 셀 클릭 → 해당 날짜의 일간 뷰 표시
    col.addEventListener('click', () => {
      currentDate = new Date(date);
      renderDateNav();
      renderTodos();
      renderWeeklyView(); // 선택 상태 갱신
    });

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

// ── 일간 뷰: 날짜 네비게이션 ──
function renderDateNav() {
  currentDateLabel.textContent = formatDateLabel(currentDate);
  currentDateLabel.classList.toggle('is-today', isToday(currentDate));
}

function moveToPrevDate() {
  currentDate.setDate(currentDate.getDate() - 1);
  // 날짜가 현재 주간 뷰 범위를 벗어나면 주간 뷰도 동기화
  syncWeekOffsetToDate(currentDate);
  renderDateNav();
  renderWeeklyView();
  renderTodos();
}

function moveToNextDate() {
  currentDate.setDate(currentDate.getDate() + 1);
  syncWeekOffsetToDate(currentDate);
  renderDateNav();
  renderWeeklyView();
  renderTodos();
}

// ── Todo CRUD ──
function addTodo() {
  const text = todoInput.value.trim();
  if (!text) {
    errorMessage.classList.remove('hidden');
    todoInput.focus();
    return;
  }
  errorMessage.classList.add('hidden');

  todos.push({ id: nextId++, text, completed: false, date: toDateKey(currentDate) });
  saveTodos();
  todoInput.value = '';
  todoInput.focus();

  renderTodos();
  renderWeeklyView(); // 개수 배지 갱신
}

function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  saveTodos();
  renderTodos();
  renderWeeklyView();
}

function toggleComplete(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) todo.completed = !todo.completed;
  saveTodos();
  renderTodos();
}

function enterEditMode(id) {
  const item = document.querySelector(`[data-id="${id}"]`);
  const todo = todos.find(t => t.id === id);
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
    if (e.key === 'Enter')  saveEdit(id);
    if (e.key === 'Escape') renderTodos();
  });

  textSpan.replaceWith(editInput);
  editInput.focus();
}

function saveEdit(id) {
  const item      = document.querySelector(`[data-id="${id}"]`);
  const editInput = item && item.querySelector('.edit-input');
  if (!editInput) return;

  const newText = editInput.value.trim();
  if (!newText) { editInput.focus(); return; }

  const todo = todos.find(t => t.id === id);
  if (todo) todo.text = newText;
  saveTodos();
  renderTodos();
}

// ── 필터링 & 렌더링 ──
function getFilteredTodos() {
  const base = todos.filter(t => t.date === toDateKey(currentDate));
  if (currentFilter === 'active')    return base.filter(t => !t.completed);
  if (currentFilter === 'completed') return base.filter(t =>  t.completed);
  return base;
}

function switchTab(filter) {
  currentFilter = filter;
  tabItems.forEach(tab => tab.classList.toggle('active', tab.dataset.filter === filter));
  renderTodos();
}

function renderTodos() {
  todoList.innerHTML = '';
  const filtered = getFilteredTodos();

  if (filtered.length === 0) {
    const msg = {
      all:       '이 날의 할 일을 추가해 보세요!',
      active:    '진행 중인 할 일이 없어요.',
      completed: '완료된 할 일이 없어요.',
    };
    todoList.innerHTML = `<p class="empty-message">${msg[currentFilter]}</p>`;
    return;
  }

  filtered.forEach(todo => {
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
todoInput.addEventListener('keydown', e => { if (e.key === 'Enter') addTodo(); });
tabItems.forEach(tab => tab.addEventListener('click', () => switchTab(tab.dataset.filter)));
prevDateButton.addEventListener('click', moveToPrevDate);
nextDateButton.addEventListener('click', moveToNextDate);
prevWeekButton.addEventListener('click', moveToPrevWeek);
nextWeekButton.addEventListener('click', moveToNextWeek);

// ── 초기화: 로컬스토리지 복원 후 렌더링 ──
loadTodos();
renderWeeklyView();
renderDateNav();
renderTodos();
