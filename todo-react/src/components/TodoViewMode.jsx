export default function TodoViewMode({ todo, onToggle, onDelete, onStartEdit }) {
  return (
    <>
      <span className="todo-text">{todo.text}</span>
      <div className="todo-actions">
        <button
          className={`btn ${todo.completed ? 'btn-back' : 'btn-complete'}`}
          onClick={onToggle}
        >
          {todo.completed ? '되돌리기' : '완료'}
        </button>
        <button className="btn btn-edit"   onClick={onStartEdit}>수정</button>
        <button className="btn btn-delete" onClick={onDelete}>삭제</button>
      </div>
    </>
  )
}
