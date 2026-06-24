'use client'

import { useRouter, usePathname } from 'next/navigation'
import { toDateKey, formatDateLabel } from '@/app/lib/dateUtils'

type Props = {
  currentDate: string
  currentFilter: string
  currentSearch?: string
}

const navBtn: React.CSSProperties = {
  width: 32,
  height: 32,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid #e0e0e0',
  borderRadius: 8,
  background: '#fff',
  cursor: 'pointer',
  fontSize: '1.1rem',
  color: '#555',
  fontFamily: 'inherit',
  flexShrink: 0,
}

export default function DateNav({ currentDate, currentFilter, currentSearch }: Props) {
  const router = useRouter()
  const pathname = usePathname()

  const navigate = (newDate: string) => {
    const params = new URLSearchParams()
    params.set('date', newDate)
    if (currentFilter !== 'all') params.set('filter', currentFilter)
    if (currentSearch) params.set('search', currentSearch)
    router.push(`${pathname}?${params.toString()}`)
  }

  const prevDay = () => {
    const d = new Date(currentDate + 'T00:00:00')
    d.setDate(d.getDate() - 1)
    navigate(toDateKey(d))
  }

  const nextDay = () => {
    const d = new Date(currentDate + 'T00:00:00')
    d.setDate(d.getDate() + 1)
    navigate(toDateKey(d))
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, marginTop: 4, flexShrink: 0 }}>
      <button onClick={prevDay} style={navBtn}>‹</button>
      <span style={{ flex: 1, textAlign: 'center', fontSize: '1rem', fontWeight: 700, color: '#1a1a1a' }}>
        {formatDateLabel(currentDate)}
      </span>
      <button onClick={nextDay} style={navBtn}>›</button>
    </div>
  )
}
