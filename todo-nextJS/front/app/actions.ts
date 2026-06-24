'use server'

export type Todo = {
  id: number
  text: string
  completed: boolean
  date: string | null
}

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:8000'

export async function getTodos(
  filter?: string,
  search?: string,
  date?: string,
): Promise<Todo[]> {
  const params = new URLSearchParams()
  if (filter) params.set('filter', filter)
  if (search) params.set('search', search)
  if (date) params.set('date', date)

  const query = params.toString()
  const url = `${BACKEND_URL}/todos${query ? `?${query}` : ''}`

  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error('할 일 목록을 불러오는 데 실패했습니다')
  return res.json()
}

export async function getTodosForWeek(start: string, end: string): Promise<Todo[]> {
  const params = new URLSearchParams({ start, end })
  const res = await fetch(`${BACKEND_URL}/todos?${params}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('주간 데이터를 불러오는 데 실패했습니다')
  return res.json()
}

export async function getTodoById(id: number): Promise<Todo> {
  const res = await fetch(`${BACKEND_URL}/todos/${id}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('할 일을 불러오는 데 실패했습니다')
  return res.json()
}
