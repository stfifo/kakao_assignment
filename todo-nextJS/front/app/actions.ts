'use server'

export type Todo = {
  id: number
  text: string
  completed: boolean
}

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:8000'

export async function getTodos(filter?: string, search?: string): Promise<Todo[]> {
  const params = new URLSearchParams()
  if (filter) params.set('filter', filter)
  if (search) params.set('search', search)

  const query = params.toString()
  const url = `${BACKEND_URL}/todos${query ? `?${query}` : ''}`

  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error('할 일 목록을 불러오는 데 실패했습니다')
  return res.json()
}

export async function getTodoById(id: number): Promise<Todo> {
  const res = await fetch(`${BACKEND_URL}/todos/${id}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('할 일을 불러오는 데 실패했습니다')
  return res.json()
}
