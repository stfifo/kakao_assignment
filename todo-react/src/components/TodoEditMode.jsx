import { useState } from 'react'

export default function TodoEditMode({ initialText, onSave, onCancel }) {
  const [editText, setEditText] = useState(initialText)

  function handleSave() {
    if (!editText.trim()) return
    onSave(editText.trim())
  }

  return (
    <>
      <input
        type="text"
        className="edit-input"
        value={editText}
        autoFocus
        onChange={e => setEditText(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter')  handleSave()
          if (e.key === 'Escape') onCancel()
        }}
      />
      <div className="todo-actions">
        <button className="btn btn-save"   onClick={handleSave}>저장</button>
        <button className="btn btn-cancel" onClick={onCancel}>취소</button>
      </div>
    </>
  )
}
