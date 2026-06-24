'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

type Props = {
  currentFilter: string
  defaultValue?: string
  currentDate?: string
}

export default function SearchInput({ currentFilter, defaultValue = '', currentDate }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [value, setValue] = useState(defaultValue)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value
    setValue(next)

    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      const params = new URLSearchParams()
      if (currentDate) params.set('date', currentDate)
      if (currentFilter !== 'all') params.set('filter', currentFilter)
      if (next.trim()) params.set('search', next.trim())
      const query = params.toString()
      router.push(query ? `${pathname}?${query}` : pathname)
    }, 300)
  }

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      placeholder="검색..."
      style={{
        width: '100%',
        padding: '8px 14px',
        fontSize: '0.9rem',
        border: '1.5px solid #e0e0e0',
        borderRadius: 8,
        background: '#fff',
        color: '#1a1a1a',
        marginTop: 8,
        boxSizing: 'border-box',
        outline: 'none',
        fontFamily: 'inherit',
        flexShrink: 0,
      }}
    />
  )
}
