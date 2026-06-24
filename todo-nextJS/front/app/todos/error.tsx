'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div style={{ width: '100%', maxWidth: 560, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#672be0', marginBottom: 16 }}>Todo</h1>
      <div style={{ textAlign: 'center', padding: '60px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#d32f2f' }}>오류가 발생했습니다</h2>
        <p style={{ fontSize: '0.9rem', color: '#888' }}>{error.message}</p>
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <button
            onClick={reset}
            style={{ padding: '10px 20px', fontSize: '0.85rem', fontWeight: 600, background: '#672be0', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            다시 시도
          </button>
          <a
            href="/todos"
            style={{ padding: '10px 20px', fontSize: '0.85rem', fontWeight: 600, background: '#f0f0f0', color: '#444', borderRadius: 8, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
          >
            목록으로
          </a>
        </div>
      </div>
    </div>
  )
}
