import { useState, useEffect } from 'react';
import {
  CalendarDays, Plus, Check, X, Clock, Calendar as CalendarIcon,
  CheckCircle2, AlertCircle, Filter, Search
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import leaveService from '../services/leaveService';
import employees from '../data/employees';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import {
  getStatusLabel, getStatusColor, formatDateShort,
  getInitials, generateAvatarColor
} from '../utils/helpers';

export default function LeavesPage() {
  const toast = useToast();
  const { user } = useAuth();
  const [leavesList, setLeavesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const [formData, setFormData] = useState({
    employeeId: user?.id || 1,
    employeeName: `${user?.firstName || 'Aziz'} ${user?.lastName || 'Benali'}`,
    type: 'Congé annuel',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    reason: '',
  });

  const loadLeaves = async () => {
    setLoading(true);
    try {
      const res = await leaveService.getAll();
      setLeavesList(res.data);
    } catch (err) {
      toast.error('Erreur lors du chargement des demandes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const handleCreateLeave = async (e) => {
    e.preventDefault();
    try {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end - start);
      const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      await leaveService.create({
        ...formData,
        days: days > 0 ? days : 1,
      });
      toast.success('Demande de congé soumise avec succès');
      setIsModalOpen(false);
      loadLeaves();
    } catch (err) {
      toast.error('Impossible de soumettre la demande');
    }
  };

  const handleApprove = async (id) => {
    try {
      await leaveService.approve(id, `${user?.firstName} ${user?.lastName}`);
      toast.success('Demande approuvée');
      loadLeaves();
    } catch (err) {
      toast.error('Erreur lors de la validation');
    }
  };

  const handleReject = async (id) => {
    try {
      await leaveService.reject(id);
      toast.info('Demande refusée');
      loadLeaves();
    } catch (err) {
      toast.error('Erreur lors du refus');
    }
  };

  const filteredLeaves = leavesList.filter(l => {
    if (filterStatus === 'pending') return l.status === 'pending';
    if (filterStatus === 'approved') return l.status === 'approved';
    if (filterStatus === 'rejected') return l.status === 'rejected';
    return true;
  });

  return (
    <div className="page-enter">
      <div className="page-header">
        <div className="page-header__left">
          <h1 className="page-title">Congés & Absences</h1>
          <p className="page-subtitle">Suivi des demandes, validations managers et soldes de congés</p>
        </div>
        <button className="btn btn--primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Demander un congé
        </button>
      </div>

      {/* Leave Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
        <div className="card">
          <div className="stat-card">
            <div className="stat-card__icon stat-card__icon--primary">
              <CalendarDays size={22} />
            </div>
            <div className="stat-card__content">
              <div className="stat-card__label">Solde Annuel</div>
              <div className="stat-card__value">22 jours</div>
              <div className="stat-card__change">Acquis pour l'année</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="stat-card">
            <div className="stat-card__icon stat-card__icon--warning">
              <Clock size={22} />
            </div>
            <div className="stat-card__content">
              <div className="stat-card__label">En attente</div>
              <div className="stat-card__value">{leavesList.filter(l => l.status === 'pending').length}</div>
              <div className="stat-card__change">À valider</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="stat-card">
            <div className="stat-card__icon stat-card__icon--success">
              <CheckCircle2 size={22} />
            </div>
            <div className="stat-card__content">
              <div className="stat-card__label">Approuvés</div>
              <div className="stat-card__value">{leavesList.filter(l => l.status === 'approved').length}</div>
              <div className="stat-card__change">Ce mois-ci</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs.Root defaultValue="requests">
        <Tabs.List className="tabs-list" style={{ padding: 0, marginBottom: 'var(--space-6)' }}>
          <Tabs.Trigger value="requests" className="tab-trigger">Demandes de congés</Tabs.Trigger>
          <Tabs.Trigger value="calendar" className="tab-trigger">Aperçu Calendrier Équipe</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="requests">
          <div className="card" style={{ marginBottom: 'var(--space-4)', padding: 'var(--space-4)' }}>
            <div className="filters-bar">
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-gray-600)' }}>Filtrer par statut:</span>
              <select
                className="filter-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Toutes les demandes</option>
                <option value="pending">En attente</option>
                <option value="approved">Approuvées</option>
                <option value="rejected">Refusées</option>
              </select>
            </div>
          </div>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Collaborateur</th>
                  <th>Type de congé</th>
                  <th>Dates</th>
                  <th>Durée</th>
                  <th>Motif</th>
                  <th>Statut</th>
                  <th style={{ textAlign: 'right' }}>Actions Manager</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeaves.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <div className="empty-state">
                        <CalendarDays size={32} />
                        <div className="empty-state__title">Aucune demande trouvée</div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredLeaves.map((leave) => (
                    <tr key={leave.id}>
                      <td style={{ fontWeight: 600, color: 'var(--color-gray-900)' }}>
                        {leave.employeeName}
                      </td>
                      <td><span className="tag">{leave.type}</span></td>
                      <td>
                        {formatDateShort(leave.startDate)} → {formatDateShort(leave.endDate)}
                      </td>
                      <td style={{ fontWeight: 500 }}>{leave.days} jour(s)</td>
                      <td style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)', maxWidth: 200 }}>
                        {leave.reason || '—'}
                      </td>
                      <td>
                        <span className={`badge badge--${getStatusColor(leave.status)} badge--dot`}>
                          {getStatusLabel(leave.status)}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {leave.status === 'pending' ? (
                          <div className="table__actions" style={{ justifyContent: 'flex-end' }}>
                            <button
                              className="btn btn--sm btn--primary"
                              onClick={() => handleApprove(leave.id)}
                            >
                              <Check size={14} /> Accepter
                            </button>
                            <button
                              className="btn btn--sm btn--danger"
                              onClick={() => handleReject(leave.id)}
                            >
                              <X size={14} /> Refuser
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)' }}>
                            {leave.approvedBy ? `Par ${leave.approvedBy}` : 'Traité'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Tabs.Content>

        <Tabs.Content value="calendar">
          <div className="card">
            <div className="card__header">
              <div className="card__title">Planning des absences de l'équipe</div>
            </div>
            <div className="card__body">
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)', marginBottom: 'var(--space-4)' }}>
                Visualisez les disponibilités et congés programmés pour l'ensemble de l'équipe cette semaine.
              </p>

              <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                {employees.slice(0, 8).map(emp => {
                  const onLeave = leavesList.find(l => l.employeeName.includes(emp.firstName) && l.status === 'approved');
                  return (
                    <div key={emp.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--color-gray-25)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-200)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <div className="avatar avatar--sm" style={{ background: generateAvatarColor(emp.firstName) }}>
                          {getInitials(emp.firstName, emp.lastName)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{emp.firstName} {emp.lastName}</div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>{emp.position}</div>
                        </div>
                      </div>

                      <div>
                        {onLeave ? (
                          <span className="badge badge--info badge--dot">En congé ({onLeave.type})</span>
                        ) : (
                          <span className="badge badge--success badge--dot">Présent</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Tabs.Content>
      </Tabs.Root>

      {/* Radix Dialog: Request Leave */}
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="dialog-content">
            <div className="dialog-header">
              <Dialog.Title className="dialog-title">Nouvelle demande de congé</Dialog.Title>
            </div>
            <form onSubmit={handleCreateLeave}>
              <div className="dialog-body">
                <div className="input-group" style={{ marginBottom: 'var(--space-4)' }}>
                  <label className="input-label">Collaborateur</label>
                  <input className="input" disabled value={formData.employeeName} />
                </div>

                <div className="input-group" style={{ marginBottom: 'var(--space-4)' }}>
                  <label className="input-label">Type de congé *</label>
                  <select
                    className="filter-select"
                    style={{ width: '100%' }}
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="Congé annuel">Congé annuel</option>
                    <option value="Congé maladie">Congé maladie</option>
                    <option value="Congé sans solde">Congé sans solde</option>
                    <option value="Télétravail">Télétravail exceptionnel</option>
                  </select>
                </div>

                <div className="form-grid form-grid--2" style={{ marginBottom: 'var(--space-4)' }}>
                  <div className="input-group">
                    <label className="input-label">Date de début *</label>
                    <input
                      type="date"
                      className="input"
                      required
                      value={formData.startDate}
                      onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Date de fin *</label>
                    <input
                      type="date"
                      className="input"
                      required
                      value={formData.endDate}
                      onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Motif / Commentaire</label>
                  <textarea
                    className="input textarea"
                    placeholder="Précisez la raison de votre absence..."
                    value={formData.reason}
                    onChange={e => setFormData({ ...formData, reason: e.target.value })}
                  />
                </div>
              </div>
              <div className="dialog-footer">
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Annuler
                </button>
                <button type="submit" className="btn btn--primary">
                  Soumettre la demande
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
