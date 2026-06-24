import Link from 'next/link'
import { getTodoById } from '@/app/actions'
import TodoForm from '../_components/TodoForm'

type PageProps = {
  params: Promise<{ todoId: string }>
}

export default async function EditTodoPage({ params }: PageProps) {
  const { todoId } = await params
  const todo = await getTodoById(Number(todoId))

  return (
    <div style={{ width: '100%', maxWidth: 560, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#672be0', marginBottom: 16, letterSpacing: '-0.5px' }}>
        Todo
      </h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <Link
          href="/todos"
          style={{ fontSize: '1.4rem', color: '#888', textDecoration: 'none', lineHeight: 1 }}
        >
          ←
        </Link>
        <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a1a1a' }}>할 일 수정</span>
      </div>
      <TodoForm todo={todo} />
    </div>
  )
}
