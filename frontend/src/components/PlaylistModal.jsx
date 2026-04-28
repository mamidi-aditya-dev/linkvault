import { useState, useEffect } from 'react';
import { COLORS } from '../constants';

export default function PlaylistModal({ playlist, onSave, onClose }) {
  const [form, setForm] = useState({ name: '', description: '', emoji: '🎵', color: '#7c6af7' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (playlist) setForm({ name: playlist.name||'', description: playlist.description||'', emoji: playlist.emoji||'🎵', color: playlist.color||'#7c6af7' });
  }, [playlist]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.name.trim()) { setError('Playlist name is required'); return; }
    setError(''); setSaving(true);
    try { await onSave(form); } catch (e) { setError(e.response?.data?.error || 'Failed to save'); setSaving(false); }
  };

  return (
    <div style={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        <h2 style={styles.h2}>{playlist?.id ? 'Edit Playlist' : 'New Playlist'}</h2>
        <p style={styles.sub}>Create a curated collection of links</p>

        <div className="form-group">
          <label className="form-label">Name *</label>
          <input className="form-input" placeholder="My Playlist" value={form.name} onChange={e => set('name', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <input className="form-input" placeholder="What's this playlist for?" value={form.description} onChange={e => set('description', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Emoji</label>
          <input className="form-input" placeholder="🎵" maxLength={2} value={form.emoji} onChange={e => set('emoji', e.target.value)} style={{ width: 80 }} />
        </div>
        <div className="form-group">
          <label className="form-label">Accent Color</label>
          <div style={styles.colorRow}>
            {COLORS.map(c => (
              <div key={c} onClick={() => set('color', c)} style={{ ...styles.swatch, background: c, border: form.color === c ? '2.5px solid #fff' : '2px solid transparent', transform: form.color === c ? 'scale(1.2)' : 'scale(1)' }} />
            ))}
          </div>
        </div>
        {error && <p className="form-error">{error}</p>}
        <div style={styles.actions}>
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Playlist'}</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 200 },
  modal: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 18, padding: 32, width: '100%', maxWidth: 440, animation: 'fadeIn 0.25s ease' },
  h2: { fontSize: '1.2rem', fontWeight: 800, marginBottom: 4 },
  sub: { fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 24 },
  colorRow: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  swatch: { width: 28, height: 28, borderRadius: 6, cursor: 'pointer', transition: 'all 0.15s' },
  actions: { display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 },
};
