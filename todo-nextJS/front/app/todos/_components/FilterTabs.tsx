'use client'

import { useRouter, usePathname } from 'next/navigation'

const TABS = [
  { value: 'all',       label: '전체' },
  { value: 'active',    label: '진행 중' },
  { value: 'completed', label: '완료' },
]

type Props = {
  currentFilter: string
  currentSearch?: string
  currentDate?: string
}

export default function FilterTabs({ currentFilter, currentSearch, currentDate }: Props) {
  const router = useRouter()
  const pathname = usePathname()

  const handleFilter = (value: string) => {
    const params = new URLSearchParams()
    if (currentDate) params.set('date', currentDate)
    if (value !== 'all') params.set('filter', value)
    if (currentSearch) params.set('search', currentSearch)
    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname)
  }

  return (
    <div style={{ display: 'flex', gap: 8, marginTop: 12, flexShrink: 0 }}>
      {TABS.map(({ value, label }) => {
        const isActive = currentFilter === value
        return (
          <button
            key={value}
            onClick={() => handleFilter(value)}
            style={{
              width: 80,
              padding: '7px 0',
              textAlign: 'center',
              fontSize: '0.88rem',
              fontWeight: 700,
              color: isActive ? '#672be0' : '#999',
              background: isActive ? '#f0ebff' : '#efefef',
              border: isActive ? '1px solid #672be0' : 'none',
              borderRadius: 999,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
