import { NextRequest } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:8000'

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.toString()
  const url = `${BACKEND_URL}/todos${query ? `?${query}` : ''}`

  const res = await fetch(url)
  const data = await res.json()
  return Response.json(data, { status: res.status })
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  const res = await fetch(`${BACKEND_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return Response.json(data, { status: res.status })
}
