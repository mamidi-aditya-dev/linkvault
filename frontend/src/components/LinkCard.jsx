import { getSource, hexToRgba } from '../constants';

export default function LinkCard({ link, onEdit, onDelete }) {
  const src = getSource(link.source);
  const badgeBg = hexToRgba(src.color, 0.12);
  const date = new Date(link.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div style={styles.card} className="link-card-hover">
      <div style={styles.top}>
        <div style={styles.favicon}>{src.emoji}</div>
        <div style={styles.info}>
          <div style={styles.title}>{link.title}</div>
          <div style={styles.url}>{link.url}</div>
        </div>
        <div style={styles.actions} className="link-actions">
          <button className="icon-btn success" title="Open link" onClick={() => window.open(link.url, '_blank')}>↗</button>
          <button className="icon-btn" title="Edit" onClick={() => onEdit(link)}>✎</button>
          <button className="icon-btn danger" title="Delete" onClick={() => onDelete(link.id)}>✕</button>
        </div>
      </div>
      <div style={styles.tags}>
        {link.type && <span style={styles.typeTag}>{link.type}</span>}
        {link.playlist_name && <span style={styles.tag}>📋 {link.playlist_name}</span>}
        {link.notes && <span style={styles.tag}>📝 note</span>}
      </div>
      <div style={styles.footer}>
        <span style={{ ...styles.badge, background: badgeBg, color: src.color }}>{src.emoji} {src.name}</span>
        <span style={styles.date}>{date}</span>
      </div>

      <style>{`
        .link-card-hover { transition: all 0.2s; }
        .link-card-hover:hover { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(0,0,0,0.25); border-color: ${src.color}55 !important; }
        .link-actions { opacity: 0; transition: opacity 0.15s; }
        .link-card-hover:hover .link-actions { opacity: 1; }
      `}</style>
    </div>
  );
}

const styles = {
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, animation: 'cardIn 0.3s ease' },
  top: { display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  favicon: { width: 34, height: 34, borderRadius: 8, background: 'var(--surface2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 },
  info: { flex: 1, minWidth: 0 },
  title: { fontSize: '0.88rem', fontWeight: 700, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 2 },
  url: { fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  actions: { display: 'flex', gap: 5 },
  tags: { display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 },
  typeTag: { fontSize: '0.68rem', fontFamily: 'var(--font-mono)', padding: '2px 7px', borderRadius: 4, background: 'rgba(124,106,247,0.1)', border: '1px solid rgba(124,106,247,0.25)', color: 'var(--accent)' },
  tag: { fontSize: '0.68rem', fontFamily: 'var(--font-mono)', padding: '2px 7px', borderRadius: 4, background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text-muted)' },
  footer: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: 10 },
  badge: { fontSize: '0.68rem', fontWeight: 700, fontFamily: 'var(--font-mono)', padding: '2px 8px', borderRadius: 4 },
  date: { fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' },
};
