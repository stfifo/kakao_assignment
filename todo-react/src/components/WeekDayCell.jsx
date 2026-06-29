import { isToday } from '../utils/dateUtils'

const DAY_NAMES = ['월', '화', '수', '목', '금', '토', '일']

export default function WeekDayCell({ date, index, count, isSelected, onClick }) {
  const classes = ['week-day-col']
  if (isToday(date))  classes.push('is-today')
  if (isSelected)     classes.push('is-selected')
  if (index === 5)    classes.push('is-saturday')
  if (index === 6)    classes.push('is-sunday')

  return (
    <div className={classes.join(' ')} onClick={onClick}>
      <span className="week-day-name">{DAY_NAMES[index]}</span>
      <span className="week-day-date">{date.getDate()}</span>
      {count > 0 && <div className="week-todo-count">{count}</div>}
    </div>
  )
}
