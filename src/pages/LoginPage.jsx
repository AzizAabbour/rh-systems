import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState('aziz.benali@rhtech.io');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Connexion réussie');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-gray-50)',
      padding: 'var(--space-4)',
    }}>
      <div className="card" style={{ width: '100%', maxWidth: 420, boxShadow: 'var(--shadow-xl)' }}>
        <div className="card__body" style={{ padding: 'var(--space-8)' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
            <div className="sidebar__logo" style={{ width: 48, height: 48, fontSize: 'var(--text-2xl)', margin: '0 auto 12px' }}>
              R
            </div>
            <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-gray-900)' }}>
              Connexion — RH System
            </h1>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)', marginTop: 4 }}>
              Accédez à la plateforme RH de votre startup
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 'var(--space-4)' }}>
            <div className="input-group">
              <label className="input-label">Email professionnel</label>
              <div className="search-input">
                <Mail size={16} className="search-input__icon" />
                <input
                  type="email"
                  className="input"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="input-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="input-label">Mot de passe</label>
                <Link to="/forgot-password" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-600)' }}>
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="search-input">
                <Lock size={16} className="search-input__icon" />
                <input
                  type="password"
                  className="input"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn btn--primary" style={{ width: '100%', marginTop: 'var(--space-2)' }} disabled={loading}>
              {loading ? 'Connexion en cours...' : 'Se connecter'} <ArrowRight size={16} />
            </button>
          </form>

          <div style={{ marginTop: 'var(--space-6)', padding: 'var(--space-3)', background: 'var(--color-primary-50)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', color: 'var(--color-primary-800)', textAlign: 'center' }}>
            💡 Demo test : <strong>aziz.benali@rhtech.io</strong> / <strong>password123</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
