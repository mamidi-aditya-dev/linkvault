import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { KNOWN_SOURCES } from '../constants';

export default function Sidebar({ links, playlists }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const usedSources = [...new Set(links.map(l => l.source).filter(Boolean))];
  const sources = usedSources.map(id => KNOWN_SOURCES.find(s => s.id === id) || { id, name: id, emoji: '🌐', color: '#7c6af7' });

  const handleLogout = () => { logout(); navigate('/login'); };

  const linkStyle = ({ isActive }) => ({
    ...styles.item,
    ...(isActive ? styles.itemActive : {}),
  });

  return (
    <nav style={styles.sidebar}>
      <div style={styles.top}>
        <div style={styles.logo}>Link<em>Vault</em></div>
        <p style={styles.username}>@{user?.username}</p>
      </div>

      <div style={styles.section}>
        <div style={styles.label}>Library</div>
        <NavLink to="/" end style={linkStyle}>
          <span>🗂</span><span>All Links</span>
          <span style={styles.count}>{links.length}</span>
        </NavLink>
        <NavLink to="/playlists" style={linkStyle}>
          <span>🎵</span><span>Playlists</span>
          <span style={styles.count}>{playlists.length}</span>
        </NavLink>
        <NavLink to="/recent" style={linkStyle}>
          <span>🕓</span><span>Recent</span>
        </NavLink>
      </div>

      <div style={styles.divider} />

      {sources.length > 0 && (
        <div style={styles.section}>
          <div style={styles.label}>Sources</div>
          {sources.map(s => (
            <NavLink key={s.id} to={`/source/${s.id}`} style={linkStyle}>
              <span>{s.emoji}</span><span>{s.name}</span>
              <span style={styles.count}>{links.filter(l => l.source === s.id).length}</span>
            </NavLink>
          ))}
        </div>
      )}

      {playlists.length > 0 && (
        <>
          <div style={styles.divider} />
          <div style={styles.section}>
            <div style={styles.label}>Playlists</div>
            {playlists.map(p => (
              <NavLink key={p.id} to={`/playlist/${p.id}`} style={linkStyle}>
                <span>{p.emoji}</span><span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
                <span style={styles.count}>{p.link_count}</span>
              </NavLink>
            ))}
          </div>
        </>
      )}

      <div style={styles.bottom}>
        <button onClick={handleLogout} style={styles.logoutBtn}>⎋ Sign Out</button>
      </div>
    </nav>
  );
}

const styles = {
  sidebar: { width: 240, minWidth: 240, background: 'var(--surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' },
  top: { padding: '20px 18px 14px', borderBottom: '1px solid var(--border)' },
  logo: { fontSize: '1.1rem', fontWeight: 800, background: 'linear-gradient(90deg,var(--accent),var(--accent2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', letterSpacing: -0.5 },
  username: { fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginTop: 4 },
  section: { padding: '10px 0' },
  label: { fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-dim)', textTransform: 'uppercase', padding: '4px 18px 6px' },
  item: { display: 'flex', alignItems: 'center', gap: 9, padding: '8px 18px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', position: 'relative', transition: 'all 0.15s', textDecoration: 'none' },
  itemActive: { color: 'var(--accent)', background: 'rgba(124,106,247,0.08)', borderLeft: '3px solid var(--accent)' },
  count: { marginLeft: 'auto', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', background: 'var(--surface2)', borderRadius: 4, padding: '1px 6px', color: 'var(--text-muted)' },
  divider: { height: 1, background: 'var(--border)', margin: '4px 18px' },
  bottom: { marginTop: 'auto', padding: '14px 18px', borderTop: '1px solid var(--border)' },
  logoutBtn: { background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'var(--font-mono)', padding: 0 },
};
