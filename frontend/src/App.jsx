import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useToast } from './context/ToastContext';
import api from './api';
import Sidebar from './components/Sidebar';
import LinkModal from './components/LinkModal';
import PlaylistModal from './components/PlaylistModal';
import AllLinksPage from './pages/AllLinksPage';
import PlaylistsPage from './pages/PlaylistsPage';
import { PlaylistDetailPage, SourceDetailPage, RecentPage } from './pages/OtherPages';

function ProtectedLayout() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [links, setLinks] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  // Modal state
  const [linkModal, setLinkModal] = useState({ open: false, link: null, defaultPlaylist: null, defaultSource: null });
  const [playlistModal, setPlaylistModal] = useState({ open: false, playlist: null });

  const fetchAll = useCallback(async () => {
    try {
      const [linksRes, playlistsRes, statsRes] = await Promise.all([
        api.get('/links'),
        api.get('/playlists'),
        api.get('/links/stats'),
      ]);
      setLinks(linksRes.data.links);
      setPlaylists(playlistsRes.data.playlists);
      setStats(statsRes.data);
    } catch (e) {
      toast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  if (!user) return <Navigate to="/login" replace />;
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
      Loading your vault...
    </div>
  );

  // Link handlers
  const openAddLink = (playlistId = null, sourceId = null) => setLinkModal({ open: true, link: null, defaultPlaylist: playlistId, defaultSource: sourceId });
  const openEditLink = (link) => setLinkModal({ open: true, link, defaultPlaylist: null, defaultSource: null });

  const handleSaveLink = async (data) => {
    if (linkModal.link?.id) {
      const res = await api.put(`/links/${linkModal.link.id}`, data);
      setLinks(prev => prev.map(l => l.id === linkModal.link.id ? res.data.link : l));
      toast('Link updated ✓');
    } else {
      const payload = { ...data };
      if (linkModal.defaultPlaylist) payload.playlist_id = linkModal.defaultPlaylist;
      if (linkModal.defaultSource && !payload.source) payload.source = linkModal.defaultSource;
      const res = await api.post('/links', payload);
      setLinks(prev => [res.data.link, ...prev]);
      toast('Link saved ✓');
    }
    setLinkModal({ open: false, link: null });
    // Refresh playlists to update counts
    const plRes = await api.get('/playlists');
    setPlaylists(plRes.data.playlists);
  };

  const handleDeleteLink = async (id) => {
    await api.delete(`/links/${id}`);
    setLinks(prev => prev.filter(l => l.id !== id));
    const plRes = await api.get('/playlists');
    setPlaylists(plRes.data.playlists);
    toast('Link deleted');
  };

  // Playlist handlers
  const openAddPlaylist = () => setPlaylistModal({ open: true, playlist: null });
  const openEditPlaylist = (pl) => setPlaylistModal({ open: true, playlist: pl });

  const handleSavePlaylist = async (data) => {
    if (playlistModal.playlist?.id) {
      const res = await api.put(`/playlists/${playlistModal.playlist.id}`, data);
      setPlaylists(prev => prev.map(p => p.id === playlistModal.playlist.id ? res.data.playlist : p));
      toast('Playlist updated ✓');
    } else {
      const res = await api.post('/playlists', data);
      setPlaylists(prev => [...prev, res.data.playlist]);
      toast('Playlist created ✓');
    }
    setPlaylistModal({ open: false, playlist: null });
  };

  const handleDeletePlaylist = async (id) => {
    await api.delete(`/playlists/${id}`);
    setPlaylists(prev => prev.filter(p => p.id !== id));
    setLinks(prev => prev.map(l => l.playlist_id === id ? { ...l, playlist_id: null, playlist_name: null } : l));
    toast('Playlist deleted');
    navigate('/playlists');
  };

  const sharedProps = { links, onEdit: openEditLink, onDelete: handleDeleteLink };

  return (
    <div style={styles.app}>
      <Sidebar links={links} playlists={playlists} />
      <main style={styles.main}>
        <Routes>
          <Route path="/" element={<AllLinksPage {...sharedProps} playlists={playlists} stats={stats} onAddLink={openAddLink} />} />
          <Route path="/playlists" element={<PlaylistsPage playlists={playlists} onAdd={openAddPlaylist} onEdit={openEditPlaylist} onDelete={handleDeletePlaylist} onOpen={id => navigate(`/playlist/${id}`)} />} />
          <Route path="/playlist/:id" element={<PlaylistDetailWrapper links={links} playlists={playlists} onAddLink={openAddLink} onEdit={openEditLink} onDelete={handleDeleteLink} onEditPlaylist={openEditPlaylist} />} />
          <Route path="/source/:id" element={<SourceDetailWrapper links={links} onAddLink={openAddLink} onEdit={openEditLink} onDelete={handleDeleteLink} />} />
          <Route path="/recent" element={<RecentPage {...sharedProps} />} />
        </Routes>
      </main>

      {linkModal.open && (
        <LinkModal
          link={linkModal.link ? { ...linkModal.link, playlist_id: linkModal.link.playlist_id || linkModal.defaultPlaylist } : null}
          playlists={playlists}
          onSave={handleSaveLink}
          onClose={() => setLinkModal({ open: false, link: null })}
        />
      )}
      {playlistModal.open && (
        <PlaylistModal
          playlist={playlistModal.playlist}
          onSave={handleSavePlaylist}
          onClose={() => setPlaylistModal({ open: false, playlist: null })}
        />
      )}
    </div>
  );
}

function PlaylistDetailWrapper({ links, playlists, onAddLink, onEdit, onDelete, onEditPlaylist }) {
  const { id } = useParams();
  const playlist = playlists.find(p => p.id === parseInt(id));
  return <PlaylistDetailPage playlist={playlist} links={links} onAddLink={onAddLink} onEdit={onEdit} onDelete={onDelete} onEditPlaylist={onEditPlaylist} />;
}

function SourceDetailWrapper({ links, onAddLink, onEdit, onDelete }) {
  const { id } = useParams();
  return <SourceDetailPage sourceId={id} links={links} onAddLink={onAddLink} onEdit={onEdit} onDelete={onDelete} />;
}

const styles = {
  app: { display: 'flex', height: '100vh', overflow: 'hidden', position: 'relative', zIndex: 1 },
  main: { flex: 1, overflowY: 'auto' },
};

export default ProtectedLayout;
