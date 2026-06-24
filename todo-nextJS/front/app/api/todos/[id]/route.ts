import { NextRequest } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:8000'

type Context = { params: Promise<{ id: string }> }

export async function PUT(request: NextRequest, ctx: Context) {
  const { id } = await ctx.params
  const body = await request.json()

  const res = await fetch(`${BACKEND_URL}/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return Response.json(data, { status: res.status })
}

export async function DELETE(_request: NextRequest, ctx: Context) {
  const { id } = await ctx.params

  const res = await fetch(`${BACKEND_URL}/todos/${id}`, { method: 'DELETE' })
  const data = await res.json()
  return Response.json(data, { status: res.status })
}
