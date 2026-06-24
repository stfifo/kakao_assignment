import Link from 'next/link'
import { getTodos, getTodosForWeek } from '@/app/actions'
import { toDateKey, getWeekDates } from '@/app/lib/dateUtils'
import FilterTabs from './_components/FilterTabs'
import SearchInput from './_components/SearchInput'
import TodoItem from './_components/TodoItem'
import DateNav from './_components/DateNav'
import WeeklyView from './_components/WeeklyView'

type PageProps = {
  searchParams: Promise<{ filter?: string; search?: string; date?: string }>
}

const EMPTY_MESSAGES: Record<string, string> = {
  all:       '할 일을 추가해 보세요!',
  active:    '진행 중인 할 일이 없어요.',
  completed: '완료된 할 일이 없어요.',
}

export default async function TodosPage({ searchParams }: PageProps) {
  const { filter, search, date } = await searchParams
  const today = toDateKey(new Date())
  const currentDate = date ?? today
  const weekDates = getWeekDates(currentDate)
  const activeFilter = filter ?? 'all'

  const [todos, weekTodos] = await Promise.all([
    getTodos(filter, search, currentDate),
    getTodosForWeek(weekDates[0], weekDates[6]),
  ])

  const countsByDate: Record<string, number> = Object.fromEntries(weekDates.map(d => [d, 0]))
  for (const todo of weekTodos) {
    if (todo.date && countsByDate[todo.date] !== undefined) {
      countsByDate[todo.date]++
    }
  }

  return (
    <div style={{ width: '100%', maxWidth: 560, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#672be0', marginBottom: 12, letterSpacing: '-0.5px', flexShrink: 0 }}>
        Todo
      </h1>

      <WeeklyView
        today={today}
        currentDate={currentDate}
        weekDates={weekDates}
        countsByDate={countsByDate}
        currentFilter={activeFilter}
        currentSearch={search}
      />

      <DateNav
        currentDate={currentDate}
        currentFilter={activeFilter}
        currentSearch={search}
      />

      {/* 입력 영역 — 클릭 시 /todos/new 이동 (date 파라미터 포함) */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 6, flexShrink: 0 }}>
        <Link
          href={`/todos/new?date=${currentDate}`}
          style={{
            flex: 1, padding: '10px 14px', fontSize: '0.95rem',
            border: '2px solid #e0e0e0', borderRadius: 10, background: '#fff',
            color: '#bbb', textDecoration: 'none', display: 'flex', alignItems: 'center',
          }}
        >
          할 일을 입력하세요
        </Link>
        <Link
          href={`/todos/new?date=${currentDate}`}
          style={{
            padding: '10px 20px', fontSize: '0.85rem', fontWeight: 600,
            background: '#672be0', color: '#fff', borderRadius: 8,
            textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
            whiteSpace: 'nowrap',
          }}
        >
          추가
        </Link>
      </div>

      <FilterTabs currentFilter={activeFilter} currentSearch={search} currentDate={currentDate} />
      <SearchInput currentFilter={activeFilter} defaultValue={search} currentDate={currentDate} />

      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12, flex: 1, overflowY: 'auto', minHeight: 0, paddingLeft: 0 }}>
        {todos.length === 0 ? (
          <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#bbb', padding: '30px 0' }}>
            {EMPTY_MESSAGES[activeFilter] ?? EMPTY_MESSAGES.all}
          </p>
        ) : (
          todos.map((todo) => <TodoItem key={todo.id} todo={todo} />)
        )}
      </ul>
    </div>
  )
}
