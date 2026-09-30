import { useState } from 'react';
import { Megaphone, Plus, Calendar, User, Tag, AlertCircle } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { announcements as initialAnnouncements } from '../data/mockData';
import { useToast } from '../contexts/ToastContext';
import { formatDate } from '../utils/helpers';

export default function AnnouncementsPage() {
  const toast = useToast();
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Politique interne',
    priority: 'medium',
    audience: 'Tous',
  });

  const handleCreate = (e) => {
    e.preventDefault();
    const newAnn = {
      id: Date.now(),
      ...formData,
      author: 'Aziz Benali',
      date: new Date().toISOString().split('T')[0],
    };
    setAnnouncements([newAnn, ...announcements]);
    toast.success('Annonce publiée avec succès');
    setIsModalOpen(false);
    setFormData({ title: '', content: '', category: 'Politique interne', priority: 'medium', audience: 'Tous' });
  };

  return (
    <div className="page-enter">
      <div className="page-header">
        <div className="page-header__left">
          <h1 className="page-title">Annonces & Communication Internes</h1>
          <p className="page-subtitle">Informations officielles, événements d'équipe et actualités de la startup</p>
        </div>
        <button className="btn btn--primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Publier une annonce
        </button>
      </div>

      <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
        {announcements.map(item => (
          <div key={item.id} className="card">
            <div className="card__header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 'var(--radius-lg)',
                  background: item.priority === 'high' ? 'var(--color-error-50)' : 'var(--color-primary-50)',
                  color: item.priority === 'high' ? 'var(--color-error-600)' : 'var(--color-primary-600)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Megaphone size={20} />
                </div>
                <div>
                  <div className="card__title">{item.title}</div>
                  <div className="card__subtitle">Par {item.author} • {formatDate(item.date)}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 6 }}>
                <span className="tag">{item.category}</span>
                <span className={`badge badge--${item.priority === 'high' ? 'error' : item.priority === 'medium' ? 'warning' : 'gray'}`}>
                  {item.priority === 'high' ? 'Priorité haute' : item.priority === 'medium' ? 'Moyenne' : 'Basse'}
                </span>
              </div>
            </div>

            <div className="card__body">
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-700)', lineHeight: 1.6 }}>
                {item.content}
              </p>
            </div>
            <div className="card__footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>
              <span>Audience: <strong>{item.audience}</strong></span>
              <button className="btn btn--ghost btn--sm" onClick={() => toast.info('Commentaires bientôt disponibles')}>
                Répondre / Commenter
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Radix Dialog: Create Announcement */}
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="dialog-content">
            <div className="dialog-header">
              <Dialog.Title className="dialog-title">Publier une annonce interne</Dialog.Title>
            </div>
            <form onSubmit={handleCreate}>
              <div className="dialog-body">
                <div className="input-group" style={{ marginBottom: 'var(--space-4)' }}>
                  <label className="input-label">Titre de l'annonce *</label>
                  <input
                    className="input"
                    required
                    placeholder="ex: Nouvelle politique de télétravail"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="form-grid form-grid--2" style={{ marginBottom: 'var(--space-4)' }}>
                  <div className="input-group">
                    <label className="input-label">Catégorie</label>
                    <select
                      className="filter-select"
                      style={{ width: '100%' }}
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Politique interne">Politique interne</option>
                      <option value="Réunion">Réunion d'équipe</option>
                      <option value="Projet">Projet</option>
                      <option value="Événement">Événement</option>
                      <option value="Développement">Développement</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Priorité</label>
                    <select
                      className="filter-select"
                      style={{ width: '100%' }}
                      value={formData.priority}
                      onChange={e => setFormData({ ...formData, priority: e.target.value })}
                    >
                      <option value="low">Basse</option>
                      <option value="medium">Moyenne</option>
                      <option value="high">Haute</option>
                    </select>
                  </div>
                </div>

                <div className="input-group" style={{ marginBottom: 'var(--space-4)' }}>
                  <label className="input-label">Contenu du message *</label>
                  <textarea
                    className="input textarea"
                    required
                    style={{ minHeight: 120 }}
                    placeholder="Rédigez votre annonce..."
                    value={formData.content}
                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                  />
                </div>
              </div>

              <div className="dialog-footer">
                <button type="button" className="btn btn--secondary" onClick={() => setIsModalOpen(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn btn--primary">
                  Publier l'annonce
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
