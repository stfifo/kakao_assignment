import { useState } from 'react'

export default function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)

  function handleSave() {
    if (!editText.trim()) return
    onEdit(editText.trim())
    setIsEditing(false)
  }

  function handleCancel() {
    setEditText(todo.text)
    setIsEditing(false)
  }

  return (
    <li className={`todo-item${todo.completed ? ' completed' : ''}`}>
      {isEditing ? (
        <input
          type="text"
          className="edit-input"
          value={editText}
          autoFocus
          onChange={e => setEditText(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter')  handleSave()
            if (e.key === 'Escape') handleCancel()
          }}
        />
      ) : (
        <span className="todo-text">{todo.text}</span>
      )}
      <div className="todo-actions">
        {isEditing ? (
          <>
            <button className="btn btn-save"   onClick={handleSave}>저장</button>
            <button className="btn btn-cancel" onClick={handleCancel}>취소</button>
          </>
        ) : (
          <>
            <button
              className={`btn ${todo.completed ? 'btn-back' : 'btn-complete'}`}
              onClick={onToggle}
            >
              {todo.completed ? '되돌리기' : '완료'}
            </button>
            <button className="btn btn-edit"   onClick={() => setIsEditing(true)}>수정</button>
            <button className="btn btn-delete" onClick={onDelete}>삭제</button>
          </>
        )}
      </div>
    </li>
  )
}
