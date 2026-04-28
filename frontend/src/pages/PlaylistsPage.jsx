export default function PlaylistsPage({ playlists, onAdd, onEdit, onDelete, onOpen }) {
  return (
    <div style={styles.page}>
      <div style={styles.head}>
        <div>
          <h1 style={styles.h1}>Playlists</h1>
          <p style={styles.sub}>Curated collections of links</p>
        </div>
        <button className="btn-primary" onClick={onAdd}>+ New Playlist</button>
      </div>

      <div style={styles.grid}>
        {playlists.map(p => (
          <div key={p.id} style={styles.card} onClick={() => onOpen(p.id)}>
            <div style={styles.cardActions} onClick={e => e.stopPropagation()}>
              <button className="icon-btn" title="Edit" onClick={() => onEdit(p)}>✎</button>
              <button className="icon-btn danger" title="Delete" onClick={() => onDelete(p.id)}>✕</button>
            </div>
            <div style={styles.bar({ color: p.color })} />
            <div style={styles.emoji}>{p.emoji}</div>
            <div style={styles.name}>{p.name}</div>
            <div style={styles.desc}>{p.description || 'No description'}</div>
            <div style={styles.count}><strong>{p.link_count}</strong> link{p.link_count !== 1 ? 's' : ''}</div>
          </div>
        ))}
        <div style={styles.addCard} onClick={onAdd}>
          <div style={{ fontSize: '1.8rem' }}>+</div>
          <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>New Playlist</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { padding: 28, animation: 'fadeIn 0.25s ease', position: 'relative', zIndex: 1 },
  head: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 },
  h1: { fontSize: '1.7rem', fontWeight: 800, letterSpacing: -0.5 },
  sub: { color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: 3, fontFamily: 'var(--font-mono)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 },
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 20, cursor: 'pointer', transition: 'all 0.2s', position: 'relative', overflow: 'hidden' },
  cardActions: { position: 'absolute', top: 12, right: 12, display: 'flex', gap: 6, opacity: 0, transition: 'opacity 0.15s' },
  bar: ({ color }) => ({ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: color }),
  emoji: { fontSize: '2rem', marginBottom: 10, marginTop: 6 },
  name: { fontSize: '1rem', fontWeight: 800, marginBottom: 6 },
  desc: { fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 14, lineHeight: 1.5 },
  count: { fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' },
  addCard: { border: '2px dashed var(--border)', borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', minHeight: 160, color: 'var(--text-dim)', transition: 'all 0.2s' },
};
