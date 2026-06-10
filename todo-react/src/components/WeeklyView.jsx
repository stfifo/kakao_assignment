import { getWeekDates, formatWeekLabel, toDateKey } from '../utils/dateUtils'
import WeekDayCell from './WeekDayCell'

export default function WeeklyView({ weekOffset, currentDate, todos, onSelectDate, onPrevWeek, onNextWeek }) {
  const dates = getWeekDates(weekOffset)

  return (
    <section className="weekly-section">
      <div className="week-nav">
        <button className="date-nav-btn" onClick={onPrevWeek}>&#8249;</button>
        <span className="date-nav-label">{formatWeekLabel(dates)}</span>
        <button className="date-nav-btn" onClick={onNextWeek}>&#8250;</button>
      </div>
      <div className="week-grid">
        {dates.map((date, index) => {
          const count = todos.filter(t => t.date === toDateKey(date)).length
          return (
            <WeekDayCell
              key={toDateKey(date)}
              date={date}
              index={index}
              count={count}
              isSelected={toDateKey(date) === toDateKey(currentDate)}
              onClick={() => onSelectDate(date)}
            />
          )
        })}
      </div>
    </section>
  )
}
