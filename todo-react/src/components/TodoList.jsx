import TodoItem from './TodoItem'
import TodoEmptyState from './TodoEmptyState'

export default function TodoList({ todos, filter, onToggle, onDelete, onEdit }) {
  if (todos.length === 0) {
    return <TodoEmptyState filter={filter} />
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
