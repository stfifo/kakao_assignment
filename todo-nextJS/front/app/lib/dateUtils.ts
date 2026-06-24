export function toDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function getWeekDates(dateStr: string): string[] {
  const date = new Date(dateStr + 'T00:00:00')
  const day = date.getDay() // 0=Sun
  const monday = new Date(date)
  monday.setDate(date.getDate() - ((day + 6) % 7))
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return toDateKey(d)
  })
}

export function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  const m = date.getMonth() + 1
  const d = date.getDate()
  const weekDays = ['일', '월', '화', '수', '목', '금', '토']
  return `${m}월 ${d}일 (${weekDays[date.getDay()]})`
}

export function formatWeekLabel(dates: string[]): string {
  const first = new Date(dates[0] + 'T00:00:00')
  const last = new Date(dates[6] + 'T00:00:00')
  const y = first.getFullYear()
  const m1 = first.getMonth() + 1, d1 = first.getDate()
  const m2 = last.getMonth() + 1, d2 = last.getDate()
  if (m1 === m2) return `${y}년 ${m1}월 ${d1}일 ~ ${d2}일`
  return `${y}년 ${m1}월 ${d1}일 ~ ${m2}월 ${d2}일`
}

export const SHORT_DAYS = ['월', '화', '수', '목', '금', '토', '일']
