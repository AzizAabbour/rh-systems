import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import authService from '../services/authService';

export default function ForgotPasswordPage() {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.forgotPassword(email);
      setSubmitted(true);
      toast.success('Email de réinitialisation envoyé');
    } catch (err) {
      toast.error('Erreur lors de l\'envoi');
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
            <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-gray-900)' }}>
              Mot de passe oublié
            </h1>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)', marginTop: 4 }}>
              Saisissez votre email professionnel pour recevoir le lien de réinitialisation
            </p>
          </div>

          {submitted ? (
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-success-700)', marginBottom: 'var(--space-6)' }}>
                Si cette adresse existe, un lien vous a été envoyé.
              </p>
              <Link to="/login" className="btn btn--secondary" style={{ width: '100%' }}>
                Retour à la connexion
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 'var(--space-4)' }}>
              <div className="input-group">
                <label className="input-label">Email professionnel</label>
                <div className="search-input">
                  <Mail size={16} className="search-input__icon" />
                  <input
                    type="email"
                    className="input"
                    required
                    placeholder="votre.nom@rhtech.io"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn--primary" style={{ width: '100%' }}>
                Envoyer le lien
              </button>

              <div style={{ textAlign: 'center', marginTop: 'var(--space-2)' }}>
                <Link to="/login" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <ArrowLeft size={16} /> Retour à la connexion
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
