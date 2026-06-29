'use client'

import { useRouter, usePathname } from 'next/navigation'
import { toDateKey, formatWeekLabel, SHORT_DAYS } from '@/app/lib/dateUtils'
import { buildTodosUrl } from '@/app/lib/navUtils'

type Props = {
  today: string
  currentDate: string
  weekDates: string[]
  countsByDate: Record<string, number>
  currentFilter: string
  currentSearch?: string
}

const navBtn: React.CSSProperties = {
  width: 28,
  height: 28,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid #e0e0e0',
  borderRadius: 6,
  background: '#fff',
  cursor: 'pointer',
  fontSize: '0.95rem',
  color: '#555',
  fontFamily: 'inherit',
  flexShrink: 0,
}

export default function WeeklyView({
  today,
  currentDate,
  weekDates,
  countsByDate,
  currentFilter,
  currentSearch,
}: Props) {
  const router = useRouter()
  const pathname = usePathname()

  const navigate = (date: string) =>
    router.push(buildTodosUrl(pathname, { date, filter: currentFilter, search: currentSearch }))

  const prevWeek = () => {
    const d = new Date(weekDates[0] + 'T00:00:00')
    d.setDate(d.getDate() - 7)
    navigate(toDateKey(d))
  }

  const nextWeek = () => {
    const d = new Date(weekDates[0] + 'T00:00:00')
    d.setDate(d.getDate() + 7)
    navigate(toDateKey(d))
  }

  return (
    <div style={{ marginBottom: 8, flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <button onClick={prevWeek} style={navBtn}>‹</button>
        <span style={{ flex: 1, textAlign: 'center', fontSize: '0.82rem', fontWeight: 600, color: '#555' }}>
          {formatWeekLabel(weekDates)}
        </span>
        <button onClick={nextWeek} style={navBtn}>›</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {weekDates.map((date, i) => {
          const isSelected = date === currentDate
          const isToday = date === today
          const count = countsByDate[date] ?? 0
          const dayNum = new Date(date + 'T00:00:00').getDate()

          return (
            <button
              key={date}
              onClick={() => navigate(date)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '6px 2px',
                borderRadius: 10,
                border: isSelected ? '2px solid #672be0' : '1px solid #e8e8e8',
                background: isSelected ? '#f0ebff' : '#fff',
                cursor: 'pointer',
                fontFamily: 'inherit',
                minWidth: 0,
              }}
            >
              <span style={{ fontSize: '0.7rem', color: '#aaa', marginBottom: 3 }}>
                {SHORT_DAYS[i]}
              </span>
              <span style={{
                fontSize: '0.88rem',
                fontWeight: isToday ? 700 : 400,
                color: isSelected ? '#672be0' : isToday ? '#672be0' : '#1a1a1a',
                width: 24, height: 24,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '50%',
                background: isToday && !isSelected ? '#ede8fb' : 'transparent',
              }}>
                {dayNum}
              </span>
              <span style={{ height: 16, display: 'flex', alignItems: 'center', marginTop: 2 }}>
                {count > 0 && (
                  <span style={{
                    fontSize: '0.65rem',
                    background: '#672be0',
                    color: '#fff',
                    borderRadius: 999,
                    padding: '1px 5px',
                    lineHeight: 1.4,
                  }}>
                    {count}
                  </span>
                )}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
