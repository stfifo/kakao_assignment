import { getWeekDates, toDateKey } from '../utils/dateUtils'
import WeekNav from './WeekNav'
import WeekDayCell from './WeekDayCell'

export default function WeeklyView({ weekOffset, currentDate, todos, onSelectDate, onPrevWeek, onNextWeek }) {
  const dates = getWeekDates(weekOffset)

  return (
    <section className="weekly-section">
      <WeekNav dates={dates} onPrevWeek={onPrevWeek} onNextWeek={onNextWeek} />
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
