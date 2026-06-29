import { useState } from 'react'
import TodoViewMode from './TodoViewMode'
import TodoEditMode from './TodoEditMode'

export default function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <li className={`todo-item${todo.completed ? ' completed' : ''}`}>
      {isEditing ? (
        <TodoEditMode
          initialText={todo.text}
          onSave={text => { onEdit(text); setIsEditing(false) }}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <TodoViewMode
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onStartEdit={() => setIsEditing(true)}
        />
      )}
    </li>
  )
}
