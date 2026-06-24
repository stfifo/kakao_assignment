'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { Todo } from '@/app/actions'

const btnBase: React.CSSProperties = {
  padding: '8px 14px',
  fontSize: '0.82rem',
  fontWeight: 600,
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  fontFamily: 'inherit',
}

export default function TodoItem({ todo }: { todo: Todo }) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  const handleToggle = async () => {
    setIsPending(true)
    try {
      await fetch(`/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !todo.completed }),
      })
      router.refresh()
    } finally {
      setIsPending(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('정말 삭제할까요?')) return
    setIsPending(true)
    try {
      await fetch(`/api/todos/${todo.id}`, { method: 'DELETE' })
      router.refresh()
    } finally {
      setIsPending(false)
    }
  }

  return (
    <li
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: '#fff',
        border: '1px solid #ebebeb',
        borderRadius: 12,
        padding: '12px 14px',
        flexShrink: 0,
        opacity: isPending ? 0.5 : 1,
        transition: 'opacity 0.15s',
      }}
    >
      <span
        style={{
          flex: 1,
          fontSize: '0.95rem',
          lineHeight: 1.4,
          wordBreak: 'break-word',
          textDecoration: todo.completed ? 'line-through' : 'none',
          color: todo.completed ? '#aaa' : '#1a1a1a',
        }}
      >
        {todo.text}
      </span>

      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        <button
          onClick={handleToggle}
          disabled={isPending}
          style={{
            ...btnBase,
            background: todo.completed ? '#f0f0f0' : '#ede8fb',
            color: todo.completed ? '#444' : '#672be0',
          }}
        >
          {todo.completed ? '되돌리기' : '완료'}
        </button>

        <Link
          href={`/todos/${todo.id}`}
          style={{
            ...btnBase,
            background: '#f0f0f0',
            color: '#444',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          수정
        </Link>

        <button
          onClick={handleDelete}
          disabled={isPending}
          style={{
            ...btnBase,
            background: '#fdecea',
            color: '#d32f2f',
          }}
        >
          삭제
        </button>
      </div>
    </li>
  )
}
