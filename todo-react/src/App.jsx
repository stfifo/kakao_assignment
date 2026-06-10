import { useState, useEffect } from 'react'
import WeeklyView  from './components/WeeklyView'
import DateNav     from './components/DateNav'
import TodoInput   from './components/TodoInput'
import FilterTabs  from './components/FilterTabs'
import TodoList    from './components/TodoList'
import { toDateKey, syncWeekOffsetToDate } from './utils/dateUtils'
import './App.css'

const STORAGE_KEY = 'todo-app-data'

function loadFromStorage() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try { return JSON.parse(raw) } catch { return [] }
}

function nextIdFrom(todos) {
  return todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1
}

export default function App() {
  const [todos,         setTodos]         = useState(() => loadFromStorage())
  const [currentDate,   setCurrentDate]   = useState(new Date())
  const [weekOffset,    setWeekOffset]    = useState(0)
  const [currentFilter, setCurrentFilter] = useState('all')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  function addTodo(text) {
    setTodos(prev => [
      ...prev,
      { id: nextIdFrom(prev), text, completed: false, date: toDateKey(currentDate) },
    ])
  }

  function deleteTodo(id) {
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  function toggleTodo(id) {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  function editTodo(id, text) {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, text } : t))
  }

  function handleSelectDate(date) {
    const d = new Date(date)
    setCurrentDate(d)
    setWeekOffset(syncWeekOffsetToDate(d))
  }

  function handlePrevDate() {
    const d = new Date(currentDate)
    d.setDate(d.getDate() - 1)
    setCurrentDate(d)
    setWeekOffset(syncWeekOffsetToDate(d))
  }

  function handleNextDate() {
    const d = new Date(currentDate)
    d.setDate(d.getDate() + 1)
    setCurrentDate(d)
    setWeekOffset(syncWeekOffsetToDate(d))
  }

  const dateKey = toDateKey(currentDate)
  const filteredTodos = todos
    .filter(t => t.date === dateKey)
    .filter(t => {
      if (currentFilter === 'active')    return !t.completed
      if (currentFilter === 'completed') return  t.completed
      return true
    })

  return (
    <div className="container">
      <h1 className="app-title">Todo</h1>

      <WeeklyView
        weekOffset={weekOffset}
        currentDate={currentDate}
        todos={todos}
        onSelectDate={handleSelectDate}
        onPrevWeek={() => setWeekOffset(w => w - 1)}
        onNextWeek={() => setWeekOffset(w => w + 1)}
      />

      <div className="section-divider" />

      <section className="daily-section">
        <DateNav
          currentDate={currentDate}
          onPrev={handlePrevDate}
          onNext={handleNextDate}
        />
        <TodoInput onAdd={addTodo} />
        <FilterTabs currentFilter={currentFilter} onSwitch={setCurrentFilter} />
        <TodoList
          todos={filteredTodos}
          filter={currentFilter}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onEdit={editTodo}
        />
      </section>
    </div>
  )
}
