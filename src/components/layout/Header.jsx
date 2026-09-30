import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { notifications as notifData } from '../../data/mockData';
import { Bell, Search, Menu, LogOut, Settings, User } from 'lucide-react';
import { getInitials, generateAvatarColor, formatRelativeDate } from '../../utils/helpers';
import * as Popover from '@radix-ui/react-popover';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useState } from 'react';

export default function Header({ onMobileToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const unread = notifData.filter(n => !n.read).length;

  return (
    <header className="header">
      <div className="header__left">
        <button className="header__toggle" onClick={onMobileToggle}>
          <Menu size={20} />
        </button>
        <span className="header__greeting">
          Bonjour, <strong>{user?.firstName}</strong> 👋
        </span>
      </div>

      <div className="header__right">
        <div className="header__search search-input">
          <Search size={16} className="search-input__icon" />
          <input className="input" placeholder="Rechercher…" />
        </div>

        <Popover.Root>
          <Popover.Trigger asChild>
            <button className="header__notification-btn" aria-label="Notifications">
              <Bell size={20} />
              {unread > 0 && <span className="header__notification-badge" />}
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content className="dropdown-content" style={{ width: 360, padding: 0 }} sideOffset={8} align="end">
              <div style={{ padding: '16px', borderBottom: '1px solid var(--color-gray-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: 'var(--text-md)', color: 'var(--color-gray-900)' }}>Notifications</span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-600)', cursor: 'pointer' }}>Tout marquer comme lu</span>
              </div>
              <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                {notifData.slice(0, 5).map(n => (
                  <div
                    key={n.id}
                    className="dropdown-item"
                    style={{
                      padding: '12px 16px',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: 4,
                      borderRadius: 0,
                      background: n.read ? 'transparent' : 'var(--color-primary-50)',
                    }}
                    onClick={() => navigate(n.link)}
                  >
                    <span style={{ fontWeight: 500, fontSize: 'var(--text-sm)', color: 'var(--color-gray-900)' }}>{n.title}</span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>{n.message}</span>
                    <span style={{ fontSize: '11px', color: 'var(--color-gray-400)', marginTop: 2 }}>{formatRelativeDate(n.date)}</span>
                  </div>
                ))}
              </div>
              <div
                style={{ padding: '12px', borderTop: '1px solid var(--color-gray-100)', textAlign: 'center', cursor: 'pointer', fontSize: 'var(--text-sm)', color: 'var(--color-primary-600)', fontWeight: 500 }}
                onClick={() => navigate('/notifications')}
              >
                Voir toutes les notifications
              </div>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="avatar avatar--sm" style={{ background: generateAvatarColor(user?.firstName || 'A'), cursor: 'pointer' }}>
              {getInitials(user?.firstName, user?.lastName)}
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className="dropdown-content" sideOffset={8} align="end">
              <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--color-gray-100)', marginBottom: 4 }}>
                <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--color-gray-900)' }}>
                  {user?.firstName} {user?.lastName}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>{user?.email}</div>
              </div>
              <DropdownMenu.Item className="dropdown-item" onSelect={() => navigate('/settings')}>
                <User size={16} /> Mon profil
              </DropdownMenu.Item>
              <DropdownMenu.Item className="dropdown-item" onSelect={() => navigate('/settings')}>
                <Settings size={16} /> Paramètres
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="dropdown-separator" />
              <DropdownMenu.Item className="dropdown-item dropdown-item--danger" onSelect={logout}>
                <LogOut size={16} /> Déconnexion
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
}
