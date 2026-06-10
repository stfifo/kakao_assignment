const MESSAGES = {
  all:       '이 날의 할 일을 추가해 보세요!',
  active:    '진행 중인 할 일이 없어요.',
  completed: '완료된 할 일이 없어요.',
}

export default function TodoEmptyState({ filter }) {
  return <p className="empty-message">{MESSAGES[filter]}</p>
}
