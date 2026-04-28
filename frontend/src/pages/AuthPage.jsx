import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
        toast('Welcome back!');
      } else {
        await register(form.username, form.email, form.password);
        toast('Account created! Welcome to LinkVault 🎉');
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>Link<em>Vault</em></div>
        <p style={styles.sub}>{mode === 'login' ? 'Sign in to your vault' : 'Create your vault'}</p>

        <div style={styles.tabs}>
          {['login','register'].map(m => (
            <button key={m} onClick={() => { setMode(m); setError(''); }}
              style={{ ...styles.tab, ...(mode === m ? styles.tabActive : {}) }}>
              {m === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label">Username</label>
              <input className="form-input" placeholder="your_name" value={form.username}
                onChange={e => set('username', e.target.value)} required />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="you@example.com" value={form.email}
              onChange={e => set('email', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="••••••••" value={form.password}
              onChange={e => set('password', e.target.value)} required minLength={6} />
          </div>
          {error && <p className="form-error" style={{ marginBottom: 14 }}>⚠ {error}</p>}
          <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', padding: '11px' }}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p style={styles.switchText}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
            style={styles.switchBtn}>
            {mode === 'login' ? 'Register' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, position: 'relative', zIndex: 1 },
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '40px 36px', width: '100%', maxWidth: 420 },
  logo: { fontSize: '1.8rem', fontWeight: 800, background: 'linear-gradient(90deg, var(--accent), var(--accent2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: 6, letterSpacing: -1 },
  sub: { fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 28 },
  tabs: { display: 'flex', background: 'var(--surface2)', borderRadius: 10, padding: 4, marginBottom: 28, gap: 4 },
  tab: { flex: 1, padding: '8px', borderRadius: 7, border: 'none', background: 'transparent', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' },
  tabActive: { background: 'var(--accent)', color: '#fff' },
  switchText: { textAlign: 'center', marginTop: 20, fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' },
  switchBtn: { background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 600 },
};
