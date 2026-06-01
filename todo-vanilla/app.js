// ── DOM 요소 참조 ──
const todoInput        = document.getElementById('todoInput');
const addButton        = document.getElementById('addButton');
const todoList         = document.getElementById('todoList');
const errorMessage     = document.getElementById('errorMessage');
const tabItems         = document.querySelectorAll('.tab-item');
const prevDateButton   = document.getElementById('prevDateButton');
const nextDateButton   = document.getElementById('nextDateButton');
const currentDateLabel = document.getElementById('currentDateLabel');

// 전체 Todo 데이터를 담는 배열 (id, text, completed, date 필드)
let todos = [];

// 각 Todo에 고유 id를 부여하기 위한 카운터
let nextId = 1;

// 현재 선택된 필터 상태 ('all' | 'active' | 'completed')
let currentFilter = 'all';

// 현재 선택된 날짜 (Date 객체). 앱 시작 시 오늘로 초기화
let currentDate = new Date();

// ── 날짜 유틸 ──

// Date 객체를 'YYYY-MM-DD' 문자열로 변환 (Todo 저장 / 비교에 사용)
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

// 화면에 표시할 날짜 문자열 반환 ('M월 D일 (요일)', 오늘이면 '오늘' 접두사 추가)
function formatDateLabel(date) {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const m    = date.getMonth() + 1;
  const d    = date.getDate();
  const day  = days[date.getDay()];
  const base = `${m}월 ${d}일 (${day})`;
  return isToday(date) ? `오늘 · ${base}` : base;
}

// ── 날짜 네비게이션 렌더링 ──
function renderDateNav() {
  currentDateLabel.textContent = formatDateLabel(currentDate);
  // 오늘이면 메인 컬러로 강조
  currentDateLabel.classList.toggle('is-today', isToday(currentDate));
}

// 날짜를 하루 앞뒤로 이동
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

// ── Todo 추가 ──
function addTodo() {
  const text = todoInput.value.trim();

  // 빈 입력값이면 안내 메시지를 보여주고 종료
  if (!text) {
    errorMessage.classList.remove('hidden');
    todoInput.focus();
    return;
  }

  errorMessage.classList.add('hidden');

  // 현재 선택된 날짜를 'YYYY-MM-DD' 형태로 함께 저장
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

// ── 수정 모드 진입: 텍스트를 input으로 교체 ──
function enterEditMode(id) {
  const item = document.querySelector(`[data-id="${id}"]`);
  const todo = todos.find(todo => todo.id === id);
  if (!item || !todo) return;

  const textSpan   = item.querySelector('.todo-text');
  const actionsDiv = item.querySelector('.todo-actions');

  const editInput = document.createElement('input');
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
  const item = document.querySelector(`[data-id="${id}"]`);
  const editInput = item && item.querySelector('.edit-input');
  if (!editInput) return;

  const newText = editInput.value.trim();
  if (!newText) {
    editInput.focus();
    return;
  }

  const todo = todos.find(todo => todo.id === id);
  if (todo) todo.text = newText;

  renderTodos();
}

// ── 현재 날짜 + 필터에 맞는 Todo 목록 반환 ──
function getFilteredTodos() {
  // 먼저 선택된 날짜의 Todo만 추림
  const todayTodos = todos.filter(t => t.date === toDateKey(currentDate));

  // 그 중에서 상태 필터 적용
  if (currentFilter === 'active')    return todayTodos.filter(t => !t.completed);
  if (currentFilter === 'completed') return todayTodos.filter(t =>  t.completed);
  return todayTodos; // 'all'
}

// ── 필터 탭 전환 ──
function switchTab(filter) {
  currentFilter = filter;

  tabItems.forEach(tab => {
    tab.classList.toggle('active', tab.dataset.filter === filter);
  });

  renderTodos();
}

// ── 전체 목록 렌더링 ──
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
    li.className = `todo-item${todo.completed ? ' completed' : ''}`;
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

// XSS 방지: 사용자 입력 텍스트의 HTML 특수문자를 이스케이프
function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ── 이벤트 리스너 등록 ──
addButton.addEventListener('click', addTodo);

todoInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') addTodo();
});

tabItems.forEach(tab => {
  tab.addEventListener('click', () => switchTab(tab.dataset.filter));
});

prevDateButton.addEventListener('click', moveToPrevDate);
nextDateButton.addEventListener('click', moveToNextDate);

// ── 초기 렌더링 ──
renderDateNav();
renderTodos();
