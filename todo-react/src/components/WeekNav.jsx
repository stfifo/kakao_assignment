import { formatWeekLabel } from '../utils/dateUtils'

export default function WeekNav({ dates, onPrevWeek, onNextWeek }) {
  return (
    <div className="week-nav">
      <button className="date-nav-btn" onClick={onPrevWeek}>&#8249;</button>
      <span className="date-nav-label">{formatWeekLabel(dates)}</span>
      <button className="date-nav-btn" onClick={onNextWeek}>&#8250;</button>
    </div>
  )
}
