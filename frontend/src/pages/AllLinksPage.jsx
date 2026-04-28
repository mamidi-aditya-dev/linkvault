import { useState, useMemo } from 'react';
import { KNOWN_SOURCES, getSource, hexToRgba } from '../constants';
import LinksGrid from '../components/LinksGrid';

export default function AllLinksPage({ links, playlists, stats, onAddLink, onEdit, onDelete }) {
  const [sourceFilter, setSourceFilter] = useState(null);
  const [typeFilter, setTypeFilter] = useState(null);
  const [search, setSearch] = useState('');

  const sources = useMemo(() => {
    const used = [...new Set(links.map(l => l.source).filter(Boolean))];
    return used.map(id => ({ ...getSource(id), count: links.filter(l => l.source === id).length }));
  }, [links]);

  const types = useMemo(() => [...new Set(links.map(l => l.type).filter(Boolean))], [links]);

  const filtered = useMemo(() => {
    let list = links;
    if (sourceFilter) list = list.filter(l => l.source === sourceFilter);
    if (typeFilter) list = list.filter(l => l.type === typeFilter);
    if (search) list = list.filter(l => l.title?.toLowerCase().includes(search.toLowerCase()) || l.url?.toLowerCase().includes(search.toLowerCase()) || l.type?.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [links, sourceFilter, typeFilter, search]);

  return (
    <div style={styles.page}>
      <div style={styles.head}>
        <div>
          <h1 style={styles.h1}>All Links</h1>
          <p style={styles.sub}>Your complete link collection</p>
        </div>
        <div style={styles.headRight}>
          <input style={styles.search} placeholder="⌕ Search links..." value={search} onChange={e => setSearch(e.target.value)} />
          <button className="btn-primary" onClick={onAddLink}>+ Add Link</button>
        </div>
      </div>

      {/* Stats */}
      <div style={styles.statsRow}>
        {[
          { n: links.length, l: 'Total Links' },
          { n: playlists.length, l: 'Playlists' },
          { n: sources.length, l: 'Sources' },
          { n: types.length, l: 'Categories' },
        ].map(s => (
          <div key={s.l} style={styles.statPill}>
            <span style={styles.statN}>{s.n}</span>
            <span style={styles.statL}>{s.l}</span>
          </div>
        ))}
      </div>

      {/* Source cards */}
      {sources.length > 0 && (
        <div style={styles.srcGrid}>
          {sources.map(s => (
            <div key={s.id} onClick={() => setSourceFilter(sourceFilter === s.id ? null : s.id)}
              style={{ ...styles.srcCard, '--c': s.color, borderColor: sourceFilter === s.id ? s.color : 'var(--border)', background: sourceFilter === s.id ? 'var(--surface2)' : 'var(--surface)' }}>
              <div style={{ fontSize: '1.6rem', marginBottom: 8 }}>{s.emoji}</div>
              <div style={styles.srcName}>{s.name}</div>
              <div style={styles.srcCount}>{s.count} link{s.count !== 1 ? 's' : ''}</div>
            </div>
          ))}
        </div>
      )}

      {/* Type filters */}
      {types.length > 0 && (
        <div style={styles.fbar}>
          <span style={styles.fl}>Filter:</span>
          <button style={{ ...styles.chip, ...(typeFilter === null ? styles.chipActive : {}) }} onClick={() => setTypeFilter(null)}>All</button>
          {types.map(t => (
            <button key={t} style={{ ...styles.chip, ...(typeFilter === t ? styles.chipActive : {}) }} onClick={() => setTypeFilter(typeFilter === t ? null : t)}>{t}</button>
          ))}
        </div>
      )}

      <LinksGrid links={filtered} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
}

const styles = {
  page: { padding: 28, animation: 'fadeIn 0.25s ease', position: 'relative', zIndex: 1 },
  head: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 22, gap: 16, flexWrap: 'wrap' },
  h1: { fontSize: '1.7rem', fontWeight: 800, letterSpacing: -0.5 },
  sub: { color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: 3, fontFamily: 'var(--font-mono)' },
  headRight: { display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' },
  search: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', padding: '8px 14px', outline: 'none', width: 200 },
  statsRow: { display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 22 },
  statPill: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10 },
  statN: { fontSize: '1.2rem', fontWeight: 800 },
  statL: { fontSize: '0.73rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' },
  srcGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 20 },
  srcCard: { borderRadius: 12, padding: '14px 16px', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid', position: 'relative', overflow: 'hidden' },
  srcName: { fontSize: '0.88rem', fontWeight: 700, marginBottom: 2 },
  srcCount: { fontSize: '0.73rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' },
  fbar: { display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 18, alignItems: 'center' },
  fl: { fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' },
  chip: { padding: '5px 13px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'var(--font-head)' },
  chipActive: { background: 'var(--accent)', borderColor: 'var(--accent)', color: '#fff' },
};
