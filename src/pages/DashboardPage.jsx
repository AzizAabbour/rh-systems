import { useNavigate } from 'react-router-dom';
import {
  Users, UserCheck, UserPlus, CalendarDays, AlertCircle, ListTodo,
  Plus, FileText, Megaphone, Send, TrendingUp, ArrowUpRight,
  Calendar, CheckCircle, GitBranch, Star, Settings, UserPlusIcon
} from 'lucide-react';
import employees from '../data/employees';
import leaves from '../data/leaves';
import tasks from '../data/tasks';
import { activities, teams, projects, announcements } from '../data/mockData';
import {
  getInitials, generateAvatarColor, formatRelativeDate,
  getStatusLabel, getStatusColor, getPriorityLabel
} from '../utils/helpers';

const activityIcons = {
  calendar: CalendarDays,
  megaphone: Megaphone,
  file: FileText,
  check: CheckCircle,
  star: Star,
  'user-plus': UserPlusIcon,
  settings: Settings,
  'git-branch': GitBranch,
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.status === 'active').length;
  const newHires = employees.filter(e => {
    const hired = new Date(e.hireDate);
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    return hired >= threeMonthsAgo;
  }).length;
  const pendingLeaves = leaves.filter(l => l.status === 'pending').length;
  const todayAbsent = employees.filter(e => e.availability === 'on-leave').length;
  const activeTasks = tasks.filter(t => t.status === 'in-progress').length;

  const stats = [
    { label: 'Total employés', value: totalEmployees, icon: Users, color: 'primary', change: '+2 ce mois' },
    { label: 'Employés actifs', value: activeEmployees, icon: UserCheck, color: 'success', change: '92% du total' },
    { label: 'Nouvelles recrues', value: newHires, icon: UserPlus, color: 'info', change: 'Derniers 3 mois' },
    { label: 'Congés en attente', value: pendingLeaves, icon: CalendarDays, color: 'warning', change: 'À traiter' },
    { label: 'Absences aujourd\'hui', value: todayAbsent, icon: AlertCircle, color: 'error', change: `${todayAbsent} sur ${totalEmployees}` },
    { label: 'Tâches en cours', value: activeTasks, icon: ListTodo, color: 'primary', change: `${tasks.filter(t => t.status === 'done').length} terminées` },
  ];

  const quickActions = [
    { label: 'Ajouter un employé', icon: UserPlus, action: () => navigate('/employees') },
    { label: 'Demande de congé', icon: CalendarDays, action: () => navigate('/leaves') },
    { label: 'Ajouter un document', icon: FileText, action: () => navigate('/documents') },
    { label: 'Créer une annonce', icon: Megaphone, action: () => navigate('/announcements') },
    { label: 'Inviter un collaborateur', icon: Send, action: () => navigate('/employees') },
  ];

  // Chart data simulation
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct'];
  const employeeGrowth = [8, 8, 9, 9, 10, 10, 10, 11, 12, 12];
  const maxGrowth = Math.max(...employeeGrowth);
  const absencesByMonth = [2, 3, 1, 4, 2, 3, 5, 2, 3, 1];
  const maxAbsence = Math.max(...absencesByMonth);

  return (
    <div className="page-enter">
      <div className="page-header">
        <div className="page-header__left">
          <h1 className="page-title">Vue d'ensemble</h1>
          <p className="page-subtitle">Bienvenue sur votre tableau de bord RH</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
        {stats.map((stat) => (
          <div key={stat.label} className="card" style={{ cursor: 'default' }}>
            <div className="stat-card">
              <div className={`stat-card__icon stat-card__icon--${stat.color}`}>
                <stat.icon size={22} />
              </div>
              <div className="stat-card__content">
                <div className="stat-card__label">{stat.label}</div>
                <div className="stat-card__value">{stat.value}</div>
                <div className="stat-card__change">{stat.change}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
        {/* Employee Growth Chart */}
        <div className="card">
          <div className="card__header">
            <div>
              <div className="card__title">Évolution des effectifs</div>
              <div className="card__subtitle">Croissance sur les 10 derniers mois</div>
            </div>
            <TrendingUp size={18} style={{ color: 'var(--color-success-500)' }} />
          </div>
          <div className="card__body">
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 140 }}>
              {employeeGrowth.map((val, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 11, color: 'var(--color-gray-500)' }}>{val}</span>
                  <div style={{
                    width: '100%',
                    height: `${(val / maxGrowth) * 100}px`,
                    background: i === employeeGrowth.length - 1
                      ? 'linear-gradient(180deg, var(--color-primary-400), var(--color-primary-600))'
                      : 'var(--color-primary-100)',
                    borderRadius: 'var(--radius-sm)',
                    transition: 'height 0.5s ease',
                  }} />
                  <span style={{ fontSize: 10, color: 'var(--color-gray-400)' }}>{months[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Absences Chart */}
        <div className="card">
          <div className="card__header">
            <div>
              <div className="card__title">Absences par mois</div>
              <div className="card__subtitle">Nombre d'absences mensuelles</div>
            </div>
            <CalendarDays size={18} style={{ color: 'var(--color-warning-500)' }} />
          </div>
          <div className="card__body">
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 140 }}>
              {absencesByMonth.map((val, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 11, color: 'var(--color-gray-500)' }}>{val}</span>
                  <div style={{
                    width: '100%',
                    height: `${(val / maxAbsence) * 100}px`,
                    background: val >= 4
                      ? 'linear-gradient(180deg, var(--color-error-300), var(--color-error-500))'
                      : 'var(--color-warning-100)',
                    borderRadius: 'var(--radius-sm)',
                    transition: 'height 0.5s ease',
                  }} />
                  <span style={{ fontSize: 10, color: 'var(--color-gray-400)' }}>{months[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Team Distribution + Leave Usage */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
        {/* Team Distribution */}
        <div className="card">
          <div className="card__header">
            <div className="card__title">Répartition des équipes</div>
          </div>
          <div className="card__body">
            {teams.map(team => {
              const memberCount = team.members.length;
              const pct = Math.round((memberCount / totalEmployees) * 100);
              return (
                <div key={team.id} style={{ marginBottom: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-gray-700)' }}>{team.name}</span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>{memberCount} • {pct}%</span>
                  </div>
                  <div className="progress">
                    <div className="progress__bar" style={{ width: `${pct}%`, background: team.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Leave Usage */}
        <div className="card">
          <div className="card__header">
            <div className="card__title">Congés utilisés</div>
          </div>
          <div className="card__body">
            {employees.slice(0, 6).map(emp => {
              const total = emp.leaveBalance.annual;
              const used = emp.leaveBalance.used;
              const pct = Math.round((used / total) * 100);
              return (
                <div key={emp.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                  <div className="avatar avatar--sm" style={{ background: generateAvatarColor(emp.firstName) }}>
                    {getInitials(emp.firstName, emp.lastName)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-gray-700)' }}>
                        {emp.firstName} {emp.lastName}
                      </span>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>{used}/{total} jours</span>
                    </div>
                    <div className="progress">
                      <div
                        className={`progress__bar ${pct > 70 ? 'progress__bar--warning' : pct > 90 ? 'progress__bar--error' : ''}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
        {/* Recent Activity */}
        <div className="card">
          <div className="card__header">
            <div className="card__title">Activité récente</div>
          </div>
          <div className="card__body" style={{ padding: 0 }}>
            {activities.map(activity => {
              const Icon = activityIcons[activity.icon] || CheckCircle;
              return (
                <div key={activity.id} style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                  padding: '12px var(--space-6)', borderBottom: '1px solid var(--color-gray-50)',
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 'var(--radius-full)',
                    background: 'var(--color-gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--color-gray-500)', flexShrink: 0,
                  }}>
                    <Icon size={16} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-700)' }}>
                      <strong style={{ color: 'var(--color-gray-900)' }}>{activity.user}</strong> {activity.action}
                    </span>
                  </div>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)', flexShrink: 0 }}>
                    {formatRelativeDate(activity.date)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="card__header">
            <div className="card__title">Actions rapides</div>
          </div>
          <div className="card__body">
            <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
              {quickActions.map(action => (
                <button
                  key={action.label}
                  className="btn btn--secondary"
                  style={{ justifyContent: 'flex-start', width: '100%' }}
                  onClick={action.action}
                >
                  <action.icon size={18} />
                  {action.label}
                </button>
              ))}
            </div>

            {/* Pending Leaves Preview */}
            <div style={{ marginTop: 'var(--space-6)' }}>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-gray-900)', marginBottom: 'var(--space-3)' }}>
                Congés en attente
              </div>
              {leaves.filter(l => l.status === 'pending').slice(0, 3).map(leave => (
                <div key={leave.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '8px 0', borderBottom: '1px solid var(--color-gray-50)',
                }}>
                  <div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-gray-800)' }}>{leave.employeeName}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>{leave.type} • {leave.days} jours</div>
                  </div>
                  <span className="badge badge--warning badge--dot">{getStatusLabel(leave.status)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
