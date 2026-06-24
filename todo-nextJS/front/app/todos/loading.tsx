export default function Loading() {
  return (
    <div style={{ width: '100%', maxWidth: 560, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 36, width: 80, background: '#e8e8e8', borderRadius: 8, marginBottom: 12 }} />

      {/* WeeklyView skeleton */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{ width: 28, height: 28, background: '#e8e8e8', borderRadius: 6 }} />
          <div style={{ flex: 1, height: 18, background: '#e8e8e8', borderRadius: 6 }} />
          <div style={{ width: 28, height: 28, background: '#e8e8e8', borderRadius: 6 }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} style={{ height: 64, background: '#e8e8e8', borderRadius: 10 }} />
          ))}
        </div>
      </div>

      {/* DateNav skeleton */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 10, marginTop: 4 }}>
        <div style={{ width: 32, height: 32, background: '#e8e8e8', borderRadius: 8 }} />
        <div style={{ flex: 1, height: 32, background: '#e8e8e8', borderRadius: 8 }} />
        <div style={{ width: 32, height: 32, background: '#e8e8e8', borderRadius: 8 }} />
      </div>

      {/* Input skeleton */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
        <div style={{ flex: 1, height: 44, background: '#e8e8e8', borderRadius: 10 }} />
        <div style={{ width: 60, height: 44, background: '#e8e8e8', borderRadius: 8 }} />
      </div>

      {/* Filter tabs skeleton */}
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        {[80, 80, 80].map((w, i) => (
          <div key={i} style={{ width: w, height: 32, background: '#e8e8e8', borderRadius: 999 }} />
        ))}
      </div>

      {/* Search skeleton */}
      <div style={{ height: 36, background: '#e8e8e8', borderRadius: 8, marginTop: 8 }} />

      {/* Todo list skeleton */}
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12, paddingLeft: 0 }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fff', border: '1px solid #ebebeb', borderRadius: 12, padding: '12px 14px' }}>
            <div style={{ flex: 1, height: 18, background: '#e8e8e8', borderRadius: 6 }} />
            <div style={{ display: 'flex', gap: 6 }}>
              {[60, 44, 44].map((w, j) => (
                <div key={j} style={{ width: w, height: 34, background: '#e8e8e8', borderRadius: 8 }} />
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
