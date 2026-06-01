// ── DOM 요소 참조 ──
const todoInput    = document.getElementById('todoInput');
const addButton    = document.getElementById('addButton');
const todoList     = document.getElementById('todoList');
const errorMessage = document.getElementById('errorMessage');
const tabItems     = document.querySelectorAll('.tab-item');

// 전체 Todo 데이터를 담는 배열 (id, text, completed 필드)
let todos = [];

// 각 Todo에 고유 id를 부여하기 위한 카운터
let nextId = 1;

// 현재 선택된 필터 상태 ('all' | 'active' | 'completed')
let currentFilter = 'all';

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

  const newTodo = { id: nextId++, text, completed: false };
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

// ── 현재 필터에 맞는 Todo 목록만 반환 ──
function getFilteredTodos() {
  if (currentFilter === 'active')    return todos.filter(t => !t.completed);
  if (currentFilter === 'completed') return todos.filter(t =>  t.completed);
  return todos; // 'all'
}

// ── 필터 탭 전환 ──
function switchTab(filter) {
  currentFilter = filter;

  // 모든 탭에서 active 클래스를 제거하고 선택된 탭에만 부여
  tabItems.forEach(tab => {
    tab.classList.toggle('active', tab.dataset.filter === filter);
  });

  renderTodos();
}

// ── 전체 목록 렌더링 ──
function renderTodos() {
  todoList.innerHTML = '';

  const filteredTodos = getFilteredTodos();

  // 필터 결과가 없을 때 안내 문구 표시
  if (filteredTodos.length === 0) {
    const emptyMsg = {
      all:       '할 일을 추가해 보세요!',
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

// 탭 클릭 시 해당 필터로 전환
tabItems.forEach(tab => {
  tab.addEventListener('click', () => switchTab(tab.dataset.filter));
});

// 초기 렌더링
renderTodos();
