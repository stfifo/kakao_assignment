import { formatDateLabel, isToday } from '../utils/dateUtils'

export default function DateNav({ currentDate, onPrev, onNext }) {
  return (
    <div className="date-nav">
      <button className="date-nav-btn" onClick={onPrev}>&#8249;</button>
      <span className={`date-nav-label${isToday(currentDate) ? ' is-today' : ''}`}>
        {formatDateLabel(currentDate)}
      </span>
      <button className="date-nav-btn" onClick={onNext}>&#8250;</button>
    </div>
  )
}
