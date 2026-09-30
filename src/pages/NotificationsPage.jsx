import { useState, useEffect } from 'react';
import { Bell, CheckCircle2, CalendarDays, FileText, ListTodo, Megaphone, Star, Check } from 'lucide-react';
import notificationService from '../services/notificationService';
import { useToast } from '../contexts/ToastContext';
import { formatRelativeDate } from '../utils/helpers';

const icons = {
  leave: CalendarDays,
  document: FileText,
  task: ListTodo,
  announcement: Megaphone,
  evaluation: Star,
};

export default function NotificationsPage() {
  const toast = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifs = async () => {
    setLoading(true);
    try {
      const res = await notificationService.getAll();
      setNotifications(res.data);
    } catch (err) {
      toast.error('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifs();
  }, []);

  const handleMarkAsRead = async (id) => {
    await notificationService.markAsRead(id);
    loadNotifs();
  };

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead();
    toast.success('Toutes les notifications ont été marquées comme lues');
    loadNotifs();
  };

  return (
    <div className="page-enter">
      <div className="page-header">
        <div className="page-header__left">
          <h1 className="page-title">Centre de Notifications</h1>
          <p className="page-subtitle">Suivi des demandes de congés, tâches assignées et annonces</p>
        </div>
        <button className="btn btn--secondary" onClick={handleMarkAllRead}>
          <Check size={18} /> Tout marquer comme lu
        </button>
      </div>

      <div className="card">
        <div className="card__body" style={{ padding: 0 }}>
          {notifications.length === 0 ? (
            <div className="empty-state">
              <Bell size={32} />
              <div className="empty-state__title">Aucune notification</div>
            </div>
          ) : (
            notifications.map(n => {
              const Icon = icons[n.type] || Bell;
              return (
                <div
                  key={n.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 'var(--space-4)',
                    padding: 'var(--space-4) var(--space-6)',
                    borderBottom: '1px solid var(--color-gray-100)',
                    background: n.read ? 'transparent' : 'var(--color-primary-50)',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease',
                  }}
                  onClick={() => handleMarkAsRead(n.id)}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 'var(--radius-full)',
                    background: 'var(--color-white)', border: '1px solid var(--color-gray-200)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--color-primary-600)', flexShrink: 0, marginTop: 2,
                  }}>
                    <Icon size={18} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                      <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--color-gray-900)' }}>{n.title}</span>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)' }}>{formatRelativeDate(n.date)}</span>
                    </div>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)', margin: 0 }}>{n.message}</p>
                  </div>

                  {!n.read && (
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-primary-600)', flexShrink: 0, marginTop: 8 }} />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
