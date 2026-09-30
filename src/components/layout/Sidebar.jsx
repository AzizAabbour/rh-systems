import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard, Users, UsersRound, CalendarDays, CalendarClock,
  ListTodo, FileText, Star, Megaphone, Bell, Settings,
  ChevronsLeft, ChevronsRight, LogOut, BookOpen
} from 'lucide-react';
import { getInitials, generateAvatarColor } from '../../utils/helpers';

const navItems = [
  { section: 'Principal', items: [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/employees', icon: Users, label: 'Employés' },
    { to: '/team', icon: UsersRound, label: 'Équipe' },
  ]},
  { section: 'Gestion', items: [
    { to: '/leaves', icon: CalendarDays, label: 'Congés & Absences', badge: 3 },
    { to: '/planning', icon: CalendarClock, label: 'Planning' },
    { to: '/tasks', icon: ListTodo, label: 'Tâches' },
    { to: '/documents', icon: FileText, label: 'Documents' },
  ]},
  { section: 'RH', items: [
    { to: '/evaluations', icon: Star, label: 'Évaluations' },
    { to: '/announcements', icon: Megaphone, label: 'Annonces' },
  ]},
  { section: 'Ressources', items: [
    { to: '/documentation', icon: BookOpen, label: 'Documentation' },
    { to: '/notifications', icon: Bell, label: 'Notifications', badge: 5 },
    { to: '/settings', icon: Settings, label: 'Paramètres' },
  ]},
];

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const sidebarClass = [
    'sidebar',
    collapsed && 'sidebar--collapsed',
    mobileOpen && 'sidebar--mobile-open',
  ].filter(Boolean).join(' ');

  return (
    <>
      <aside className={sidebarClass}>
        <div className="sidebar__brand">
          <div className="sidebar__logo">R</div>
          <div className="sidebar__brand-text">
            <span className="sidebar__brand-name">RH System</span>
            <span className="sidebar__brand-label">Gestion des talents</span>
          </div>
        </div>

        <nav className="sidebar__nav">
          {navItems.map((section) => (
            <div key={section.section} className="sidebar__section">
              <div className="sidebar__section-title">{section.section}</div>
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
                  }
                  onClick={onMobileClose}
                >
                  <item.icon className="sidebar__link-icon" size={20} />
                  <span className="sidebar__link-text">{item.label}</span>
                  {item.badge && (
                    <span className="sidebar__link-badge">{item.badge}</span>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar__footer">
          <div className="sidebar__user">
            <div
              className="avatar avatar--sm"
              style={{ background: generateAvatarColor(user?.firstName || 'A') }}
            >
              {getInitials(user?.firstName, user?.lastName)}
            </div>
            <div className="sidebar__user-info">
              <div className="sidebar__user-name">{user?.firstName} {user?.lastName}</div>
              <div className="sidebar__user-role">{user?.position}</div>
            </div>
          </div>

          <button className="sidebar__collapse-btn" onClick={onToggle}>
            {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
          </button>
        </div>
      </aside>

      {mobileOpen && <div className="sidebar-overlay" onClick={onMobileClose} />}
    </>
  );
}
