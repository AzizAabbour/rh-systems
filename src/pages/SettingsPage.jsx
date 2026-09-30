import { useState } from 'react';
import { User, Bell, Shield, Key, Globe, Moon, Check } from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export default function SettingsPage() {
  const { user } = useAuth();
  const toast = useToast();

  const [profile, setProfile] = useState({
    firstName: user?.firstName || 'Aziz',
    lastName: user?.lastName || 'Benali',
    email: user?.email || 'aziz.benali@rhtech.io',
    phone: '+212 6 12 34 56 78',
    language: 'Français',
    timezone: 'Casablanca (GMT+1)',
  });

  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirm: '',
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    toast.success('Modifications du profil enregistrées');
  };

  const handleSaveSecurity = (e) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    toast.success('Mot de passe mis à jour avec succès');
    setPasswords({ current: '', newPass: '', confirm: '' });
  };

  return (
    <div className="page-enter">
      <div className="page-header">
        <div className="page-header__left">
          <h1 className="page-title">Paramètres de l'Application</h1>
          <p className="page-subtitle">Gérez votre compte, vos préférences et vos options de sécurité</p>
        </div>
      </div>

      <Tabs.Root defaultValue="account">
        <Tabs.List className="tabs-list" style={{ padding: 0, marginBottom: 'var(--space-6)' }}>
          <Tabs.Trigger value="account" className="tab-trigger">Compte & Profil</Tabs.Trigger>
          <Tabs.Trigger value="preferences" className="tab-trigger">Préférences</Tabs.Trigger>
          <Tabs.Trigger value="security" className="tab-trigger">Sécurité & Connexion</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="account">
          <div className="card">
            <div className="card__header">
              <div className="card__title">Informations de compte</div>
            </div>
            <form onSubmit={handleSaveProfile}>
              <div className="card__body">
                <div className="form-grid form-grid--2" style={{ marginBottom: 'var(--space-4)' }}>
                  <div className="input-group">
                    <label className="input-label">Prénom</label>
                    <input
                      className="input"
                      value={profile.firstName}
                      onChange={e => setProfile({ ...profile, firstName: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Nom</label>
                    <input
                      className="input"
                      value={profile.lastName}
                      onChange={e => setProfile({ ...profile, lastName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-grid form-grid--2" style={{ marginBottom: 'var(--space-4)' }}>
                  <div className="input-group">
                    <label className="input-label">Email professionnel</label>
                    <input
                      type="email"
                      className="input"
                      value={profile.email}
                      onChange={e => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Téléphone</label>
                    <input
                      className="input"
                      value={profile.phone}
                      onChange={e => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="card__footer" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn--primary">
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>
        </Tabs.Content>

        <Tabs.Content value="preferences">
          <div className="card">
            <div className="card__header">
              <div className="card__title">Préférences d'affichage et langue</div>
            </div>
            <div className="card__body">
              <div className="form-grid form-grid--2">
                <div className="input-group">
                  <label className="input-label">Langue de l'interface</label>
                  <select
                    className="filter-select"
                    style={{ width: '100%' }}
                    value={profile.language}
                    onChange={e => setProfile({ ...profile, language: e.target.value })}
                  >
                    <option value="Français">Français (par défaut)</option>
                    <option value="English">English</option>
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Fuseau horaire</label>
                  <select
                    className="filter-select"
                    style={{ width: '100%' }}
                    value={profile.timezone}
                    onChange={e => setProfile({ ...profile, timezone: e.target.value })}
                  >
                    <option value="Casablanca (GMT+1)">Casablanca (GMT+1)</option>
                    <option value="Paris (GMT+2)">Paris (GMT+2)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </Tabs.Content>

        <Tabs.Content value="security">
          <div className="card">
            <div className="card__header">
              <div className="card__title">Sécurité & Mot de passe</div>
            </div>
            <form onSubmit={handleSaveSecurity}>
              <div className="card__body">
                <div className="input-group" style={{ marginBottom: 'var(--space-4)', maxWidth: 400 }}>
                  <label className="input-label">Mot de passe actuel</label>
                  <input
                    type="password"
                    className="input"
                    required
                    value={passwords.current}
                    onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                  />
                </div>

                <div className="form-grid form-grid--2" style={{ maxWidth: 600 }}>
                  <div className="input-group">
                    <label className="input-label">Nouveau mot de passe</label>
                    <input
                      type="password"
                      className="input"
                      required
                      value={passwords.newPass}
                      onChange={e => setPasswords({ ...passwords, newPass: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Confirmer le mot de passe</label>
                    <input
                      type="password"
                      className="input"
                      required
                      value={passwords.confirm}
                      onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="card__footer" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn--primary">
                  Changer le mot de passe
                </button>
              </div>
            </form>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
