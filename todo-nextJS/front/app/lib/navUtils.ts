export function buildTodosUrl(
  pathname: string,
  opts: { date?: string; filter?: string; search?: string },
): string {
  const params = new URLSearchParams()
  if (opts.date) params.set('date', opts.date)
  if (opts.filter && opts.filter !== 'all') params.set('filter', opts.filter)
  if (opts.search) params.set('search', opts.search)
  const query = params.toString()
  return query ? `${pathname}?${query}` : pathname
}
