import { useState, useEffect } from 'react';
import { KNOWN_SOURCES } from '../constants';

const TYPES = ['Jobs', 'Recipe', 'Music', 'Workout', 'News', 'Celebrity', 'Profile', 'Tutorial', 'Research', 'Shopping', 'Entertainment', 'Travel'];

export default function LinkModal({ link, playlists, onSave, onClose }) {
  const [form, setForm] = useState({ title: '', url: '', source: '', type: '', notes: '', playlist_id: '' });
  const [customSource, setCustomSource] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (link) setForm({ title: link.title||'', url: link.url||'', source: link.source||'', type: link.type||'', notes: link.notes||'', playlist_id: link.playlist_id||'' });
  }, [link]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const autoTitle = (url) => {
    set('url', url);
    if (!form.title && url) {
      try { set('title', new URL(url).hostname.replace('www.','')); } catch {}
    }
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.url.trim()) { setError('Title and URL are required'); return; }
    setError(''); setSaving(true);
    const data = { ...form };
    if (data.source === '__custom__') data.source = customSource.trim().toLowerCase().replace(/\s+/g,'-') || 'other';
    if (!data.playlist_id) data.playlist_id = null;
    try { await onSave(data); } catch (e) { setError(e.response?.data?.error || 'Failed to save'); setSaving(false); }
  };

  return (
    <div style={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        <h2 style={styles.h2}>{link?.id ? 'Edit Link' : 'Add New Link'}</h2>
        <p style={styles.sub}>{link?.id ? 'Update link details' : 'Save a link to your vault'}</p>

        <div className="form-group">
          <label className="form-label">URL *</label>
          <input className="form-input" placeholder="https://..." value={form.url} onChange={e => autoTitle(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Title *</label>
          <input className="form-input" placeholder="Name for this link" value={form.title} onChange={e => set('title', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Source</label>
          <select className="form-select" value={form.source} onChange={e => set('source', e.target.value)}>
            <option value="">— Select source —</option>
            {KNOWN_SOURCES.map(s => <option key={s.id} value={s.id}>{s.emoji} {s.name}</option>)}
            <option value="__custom__">+ Custom source...</option>
          </select>
          {form.source === '__custom__' && (
            <input className="form-input" style={{ marginTop: 8 }} placeholder="Custom source name"
              value={customSource} onChange={e => setCustomSource(e.target.value)} />
          )}
        </div>
        <div className="form-group">
          <label className="form-label">Type / Category</label>
          <input className="form-input" list="type-list" placeholder="e.g. jobs, music, recipe..." value={form.type} onChange={e => set('type', e.target.value)} />
          <datalist id="type-list">{TYPES.map(t => <option key={t} value={t} />)}</datalist>
        </div>
        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea className="form-textarea" placeholder="Optional notes..." value={form.notes} onChange={e => set('notes', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Add to Playlist</label>
          <select className="form-select" value={form.playlist_id} onChange={e => set('playlist_id', e.target.value)}>
            <option value="">— None —</option>
            {playlists.map(p => <option key={p.id} value={p.id}>{p.emoji} {p.name}</option>)}
          </select>
        </div>
        {error && <p className="form-error">{error}</p>}
        <div style={styles.actions}>
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Link'}</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 200 },
  modal: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 18, padding: 32, width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto', animation: 'fadeIn 0.25s ease' },
  h2: { fontSize: '1.2rem', fontWeight: 800, marginBottom: 4 },
  sub: { fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 24 },
  actions: { display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 },
};
