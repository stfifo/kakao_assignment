import TodoItem from './TodoItem'

const EMPTY_MESSAGES = {
  all:       '이 날의 할 일을 추가해 보세요!',
  active:    '진행 중인 할 일이 없어요.',
  completed: '완료된 할 일이 없어요.',
}

export default function TodoList({ todos, filter, onToggle, onDelete, onEdit }) {
  if (todos.length === 0) {
    return <p className="empty-message">{EMPTY_MESSAGES[filter]}</p>
  }
  return (
    <ul className="todo-list">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={() => onToggle(todo.id)}
          onDelete={() => onDelete(todo.id)}
          onEdit={text => onEdit(todo.id, text)}
        />
      ))}
    </ul>
  )
}
