import { useState } from 'react'

export default function TodoInput({ onAdd }) {
  const [text, setText] = useState('')
  const [error, setError] = useState(false)

  function handleAdd() {
    if (!text.trim()) {
      setError(true)
      return
    }
    setError(false)
    onAdd(text.trim())
    setText('')
  }

  return (
    <>
      <div className="input-section">
        <input
          type="text"
          className="todo-input"
          placeholder="할 일을 입력하세요"
          value={text}
          onChange={e => { setText(e.target.value); setError(false) }}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
        />
        <button className="btn btn-primary" onClick={handleAdd}>추가</button>
      </div>
      {error && <p className="error-message">할 일을 입력해 주세요.</p>}
    </>
  )
}
