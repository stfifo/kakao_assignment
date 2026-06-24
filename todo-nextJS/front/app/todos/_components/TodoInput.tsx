'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  currentDate: string
}

export default function TodoInput({ currentDate }: Props) {
  const router = useRouter()
  const [text, setText] = useState('')
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) { setError('할 일을 입력해 주세요.'); return }

    setIsPending(true)
    setError('')
    try {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim(), date: currentDate }),
      })
      if (!res.ok) throw new Error('추가에 실패했습니다')
      setText('')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ flexShrink: 0 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
        <input
          type="text"
          value={text}
          onChange={(e) => { setText(e.target.value); setError('') }}
          placeholder="할 일을 입력하세요"
          disabled={isPending}
          style={{
            flex: 1,
            padding: '10px 14px',
            fontSize: '0.95rem',
            border: '2px solid #e0e0e0',
            borderRadius: 10,
            outline: 'none',
            background: '#fff',
            fontFamily: 'inherit',
            color: '#1a1a1a',
          }}
        />
        <button
          type="submit"
          disabled={isPending}
          style={{
            padding: '10px 20px',
            fontSize: '0.85rem',
            fontWeight: 600,
            background: '#672be0',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            fontFamily: 'inherit',
            opacity: isPending ? 0.6 : 1,
          }}
        >
          {isPending ? '처리 중...' : '추가'}
        </button>
      </div>
      {error && (
        <p style={{ fontSize: '0.82rem', color: '#d32f2f', marginBottom: 4, paddingLeft: 4 }}>
          {error}
        </p>
      )}
    </form>
  )
}
