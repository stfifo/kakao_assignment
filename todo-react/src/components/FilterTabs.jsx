const TABS = [
  { filter: 'all',       label: '전체' },
  { filter: 'active',    label: '진행 중' },
  { filter: 'completed', label: '완료' },
]

export default function FilterTabs({ currentFilter, onSwitch }) {
  return (
    <div className="tab-bar">
      {TABS.map(({ filter, label }) => (
        <button
          key={filter}
          className={`tab-item${currentFilter === filter ? ' active' : ''}`}
          onClick={() => onSwitch(filter)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
