import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LinksGrid from '../components/LinksGrid';
import { getSource } from '../constants';

export function PlaylistDetailPage({ playlist, links, onAddLink, onEdit, onDelete, onEditPlaylist }) {
  const navigate = useNavigate();
  const [typeFilter, setTypeFilter] = useState(null);
  const plLinks = links.filter(l => l.playlist_id === playlist?.id);
  const types = [...new Set(plLinks.map(l => l.type).filter(Boolean))];
  const filtered = typeFilter ? plLinks.filter(l => l.type === typeFilter) : plLinks;

  if (!playlist) return <div style={{ padding: 28 }}><p>Playlist not found.</p></div>;

  return (
    <div style={styles.page}>
      <button style={styles.back} onClick={() => navigate('/playlists')}>← Back to Playlists</button>
      <div style={styles.head}>
        <div style={styles.headLeft}>
          <span style={{ fontSize: '2.8rem' }}>{playlist.emoji}</span>
          <div>
            <h1 style={styles.h1}>{playlist.name}</h1>
            <p style={styles.sub}>{playlist.description || ''} · {plLinks.length} link{plLinks.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-ghost" onClick={() => onEditPlaylist(playlist)}>✎ Edit</button>
          <button className="btn-primary" onClick={() => onAddLink(playlist.id)}>+ Add Link</button>
        </div>
      </div>
      {types.length > 0 && (
        <div style={styles.fbar}>
          <span style={styles.fl}>Filter:</span>
          <button style={{ ...styles.chip, ...(typeFilter === null ? styles.chipActive : {}) }} onClick={() => setTypeFilter(null)}>All</button>
          {types.map(t => <button key={t} style={{ ...styles.chip, ...(typeFilter === t ? styles.chipActive : {}) }} onClick={() => setTypeFilter(typeFilter === t ? null : t)}>{t}</button>)}
        </div>
      )}
      <LinksGrid links={filtered} onEdit={onEdit} onDelete={onDelete} emptyMessage="No links in this playlist yet" />
    </div>
  );
}

export function SourceDetailPage({ sourceId, links, onAddLink, onEdit, onDelete }) {
  const navigate = useNavigate();
  const [typeFilter, setTypeFilter] = useState(null);
  const src = getSource(sourceId);
  const srcLinks = links.filter(l => l.source === sourceId);
  const types = [...new Set(srcLinks.map(l => l.type).filter(Boolean))];
  const filtered = typeFilter ? srcLinks.filter(l => l.type === typeFilter) : srcLinks;

  return (
    <div style={styles.page}>
      <button style={styles.back} onClick={() => navigate('/')}>← All Links</button>
      <div style={styles.head}>
        <div style={styles.headLeft}>
          <span style={{ fontSize: '2.8rem' }}>{src.emoji}</span>
          <div>
            <h1 style={styles.h1}>{src.name}</h1>
            <p style={styles.sub}>{srcLinks.length} link{srcLinks.length !== 1 ? 's' : ''} from {src.name}</p>
          </div>
        </div>
        <button className="btn-primary" onClick={() => onAddLink(null, sourceId)}>+ Add Link</button>
      </div>
      {types.length > 0 && (
        <div style={styles.fbar}>
          <span style={styles.fl}>Filter:</span>
          <button style={{ ...styles.chip, ...(typeFilter === null ? styles.chipActive : {}) }} onClick={() => setTypeFilter(null)}>All</button>
          {types.map(t => <button key={t} style={{ ...styles.chip, ...(typeFilter === t ? styles.chipActive : {}) }} onClick={() => setTypeFilter(typeFilter === t ? null : t)}>{t}</button>)}
        </div>
      )}
      <LinksGrid links={filtered} onEdit={onEdit} onDelete={onDelete} emptyMessage={`No ${src.name} links saved yet`} />
    </div>
  );
}

export function RecentPage({ links, onEdit, onDelete }) {
  const recent = useMemo(() => [...links].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 20), [links]);
  return (
    <div style={styles.page}>
      <div style={styles.head}>
        <div><h1 style={styles.h1}>Recently Added</h1><p style={styles.sub}>Your latest saved links</p></div>
      </div>
      <LinksGrid links={recent} onEdit={onEdit} onDelete={onDelete} emptyMessage="No links saved yet" />
    </div>
  );
}

const styles = {
  page: { padding: 28, animation: 'fadeIn 0.25s ease', position: 'relative', zIndex: 1 },
  back: { background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'var(--font-mono)', marginBottom: 20, padding: 0 },
  head: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 14 },
  headLeft: { display: 'flex', alignItems: 'center', gap: 16 },
  h1: { fontSize: '1.7rem', fontWeight: 800, letterSpacing: -0.5 },
  sub: { color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: 4, fontFamily: 'var(--font-mono)' },
  fbar: { display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 18, alignItems: 'center' },
  fl: { fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' },
  chip: { padding: '5px 13px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'var(--font-head)' },
  chipActive: { background: 'var(--accent)', borderColor: 'var(--accent)', color: '#fff' },
};
