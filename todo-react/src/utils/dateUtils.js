export function toDateKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function isToday(date) {
  return toDateKey(date) === toDateKey(new Date())
}

export function formatDateLabel(date) {
  const days = ['일', '월', '화', '수', '목', '금', '토']
  const m = date.getMonth() + 1
  const d = date.getDate()
  const day = days[date.getDay()]
  const base = `${m}월 ${d}일 (${day})`
  return isToday(date) ? `오늘 · ${base}` : base
}

export function getWeekDates(offset) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dow = today.getDay()
  const daysToMon = dow === 0 ? -6 : 1 - dow
  const monday = new Date(today)
  monday.setDate(today.getDate() + daysToMon + offset * 7)

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

export function formatWeekLabel(dates) {
  const start = dates[0]
  const end = dates[6]
  const year = start.getFullYear()
  if (start.getMonth() === end.getMonth()) {
    return `${year}년 ${start.getMonth() + 1}월 ${start.getDate()}일 ~ ${end.getDate()}일`
  }
  return `${year}년 ${start.getMonth() + 1}월 ${start.getDate()}일 ~ ${end.getMonth() + 1}월 ${end.getDate()}일`
}

// 주어진 날짜가 속한 주의 offset(0=이번 주)을 반환
export function syncWeekOffsetToDate(date) {
  const base = new Date()
  base.setHours(0, 0, 0, 0)
  const baseDow = base.getDay()
  const baseMonday = new Date(base)
  baseMonday.setDate(base.getDate() + (baseDow === 0 ? -6 : 1 - baseDow))

  const target = new Date(date)
  target.setHours(0, 0, 0, 0)
  const targetDow = target.getDay()
  const targetMonday = new Date(target)
  targetMonday.setDate(target.getDate() + (targetDow === 0 ? -6 : 1 - targetDow))

  return Math.round((targetMonday - baseMonday) / (7 * 24 * 60 * 60 * 1000))
}
