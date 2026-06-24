'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Todo } from '@/app/actions'

const btnBase: React.CSSProperties = {
  padding: '10px 20px',
  fontSize: '0.85rem',
  fontWeight: 600,
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  fontFamily: 'inherit',
}

type Props = {
  todo?: Todo
  defaultDate?: string
}

export default function TodoForm({ todo, defaultDate }: Props) {
  const router = useRouter()
  const [text, setText] = useState(todo?.text ?? '')
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState('')
  const isEditing = !!todo

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) { setError('할 일을 입력해 주세요.'); return }

    setIsPending(true)
    setError('')
    try {
      const url = isEditing ? `/api/todos/${todo.id}` : '/api/todos'
      const body = isEditing
        ? { text }
        : { text, date: defaultDate }
      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('요청에 실패했습니다')
      const dest = defaultDate ? `/todos?date=${defaultDate}` : '/todos'
      router.push(dest)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다')
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
        <input
          type="text"
          value={text}
          onChange={(e) => { setText(e.target.value); setError('') }}
          onKeyDown={(e) => e.key === 'Escape' && router.back()}
          placeholder="할 일을 입력하세요"
          disabled={isPending}
          autoFocus
          style={{
            flex: 1,
            padding: '10px 14px',
            fontSize: '0.95rem',
            border: '2px solid #e0e0e0',
            borderRadius: 10,
            outline: 'none',
            background: '#fff',
            fontFamily: 'inherit',
          }}
        />
        <button
          type="submit"
          disabled={isPending}
          style={{ ...btnBase, background: '#672be0', color: '#fff', opacity: isPending ? 0.6 : 1 }}
        >
          {isPending ? '처리 중...' : isEditing ? '저장' : '추가'}
        </button>
      </div>

      {error && (
        <p style={{ fontSize: '0.82rem', color: '#d32f2f', marginBottom: 8, paddingLeft: 4 }}>
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={() => router.back()}
        disabled={isPending}
        style={{ ...btnBase, background: '#f0f0f0', color: '#444' }}
      >
        취소
      </button>
    </form>
  )
}
