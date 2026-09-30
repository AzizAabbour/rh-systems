import { useState, useEffect } from 'react';
import {
  ListTodo, Plus, Kanban, List, CheckCircle2, Clock,
  AlertTriangle, Filter, Search, Tag, Calendar
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import taskService from '../services/taskService';
import employees from '../data/employees';
import { useToast } from '../contexts/ToastContext';
import {
  getStatusLabel, getStatusColor, getPriorityLabel,
  getPriorityColor, formatDateShort, getInitials, generateAvatarColor
} from '../utils/helpers';

const columns = [
  { id: 'todo', title: 'À faire', color: '#6b7280' },
  { id: 'in-progress', title: 'En cours', color: '#6366f1' },
  { id: 'in-review', title: 'En revue', color: '#f59e0b' },
  { id: 'done', title: 'Terminé', color: '#10b981' },
];

export default function TasksPage() {
  const toast = useToast();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('kanban'); // kanban | list
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigneeId: 1,
    priority: 'medium',
    status: 'todo',
    dueDate: new Date().toISOString().split('T')[0],
    project: 'RH System v2',
    tags: 'frontend, UI',
  });

  const loadTasks = async () => {
    setLoading(true);
    try {
      const res = await taskService.getAll({
        priority: priorityFilter,
        project: projectFilter,
      });
      setTasks(res.data);
    } catch (err) {
      toast.error('Erreur lors du chargement des tâches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [priorityFilter, projectFilter]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const assignee = employees.find(e => e.id === Number(formData.assigneeId));
      await taskService.create({
        ...formData,
        assignee: assignee ? `${assignee.firstName} ${assignee.lastName}` : 'Aziz Benali',
        tags: typeof formData.tags === 'string'
          ? formData.tags.split(',').map(t => t.trim()).filter(Boolean)
          : formData.tags,
      });
      toast.success('Tâche créée avec succès');
      setIsModalOpen(false);
      loadTasks();
    } catch (err) {
      toast.error('Erreur lors de la création de la tâche');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.updateStatus(taskId, newStatus);
      toast.success('Statut mis à jour');
      loadTasks();
    } catch (err) {
      toast.error('Erreur lors du changement de statut');
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (search) {
      const q = search.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.assignee.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="page-enter">
      <div className="page-header">
        <div className="page-header__left">
          <h1 className="page-title">Gestion des Tâches & Kanban</h1>
          <p className="page-subtitle">Suivi des sprints, tickets de développement et fonctionnalités</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <div style={{ display: 'flex', border: '1px solid var(--color-gray-200)', borderRadius: 'var(--radius-md)', padding: 2, background: 'var(--color-white)' }}>
            <button
              className={`btn btn--sm ${viewMode === 'kanban' ? 'btn--primary' : 'btn--ghost'}`}
              onClick={() => setViewMode('kanban')}
            >
              <Kanban size={16} /> Kanban
            </button>
            <button
              className={`btn btn--sm ${viewMode === 'list' ? 'btn--primary' : 'btn--ghost'}`}
              onClick={() => setViewMode('list')}
            >
              <List size={16} /> Liste
            </button>
          </div>

          <button className="btn btn--primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Créer une tâche
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="card" style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-4)' }}>
        <div className="filters-bar">
          <div className="search-input" style={{ flex: 1, minWidth: 220 }}>
            <Search size={16} className="search-input__icon" />
            <input
              className="input"
              placeholder="Rechercher une tâche..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="filter-select"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="">Toutes les priorités</option>
            <option value="low">Basse</option>
            <option value="medium">Moyenne</option>
            <option value="high">Haute</option>
          </select>

          <select
            className="filter-select"
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
          >
            <option value="">Tous les projets</option>
            <option value="RH System v2">RH System v2</option>
            <option value="API Gateway">API Gateway</option>
            <option value="Design System">Design System</option>
            <option value="Infrastructure Cloud">Infrastructure Cloud</option>
          </select>
        </div>
      </div>

      {/* Kanban View */}
      {viewMode === 'kanban' ? (
        <div className="kanban">
          {columns.map(col => {
            const colTasks = filteredTasks.filter(t => t.status === col.id);
            return (
              <div key={col.id} className="kanban__column">
                <div className="kanban__column-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: col.color }} />
                    <span className="kanban__column-title">{col.title}</span>
                  </div>
                  <span className="kanban__column-count">{colTasks.length}</span>
                </div>

                <div className="kanban__cards">
                  {colTasks.map(task => (
                    <div key={task.id} className="kanban__card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span className="tag" style={{ fontSize: 10 }}>{task.project}</span>
                        <span className={`badge badge--${getPriorityColor(task.priority)}`} style={{ fontSize: 10, padding: '1px 6px' }}>
                          {getPriorityLabel(task.priority)}
                        </span>
                      </div>

                      <div className="kanban__card-title">{task.title}</div>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)', marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {task.description}
                      </p>

                      <div className="kanban__card-meta">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div className="avatar avatar--sm" style={{ width: 22, height: 22, fontSize: 10, background: generateAvatarColor(task.assignee) }}>
                            {getInitials(task.assignee)}
                          </div>
                          <span>{task.assignee}</span>
                        </div>
                        <span>{formatDateShort(task.dueDate)}</span>
                      </div>

                      {/* Change status action */}
                      <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px dashed var(--color-gray-100)', display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
                        {col.id !== 'done' && (
                          <button
                            className="btn btn--ghost btn--sm"
                            style={{ fontSize: 11, padding: '2px 6px' }}
                            onClick={() => handleStatusChange(task.id, col.id === 'todo' ? 'in-progress' : col.id === 'in-progress' ? 'in-review' : 'done')}
                          >
                            Avancer →
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Tâche</th>
                <th>Projet</th>
                <th>Responsable</th>
                <th>Priorité</th>
                <th>Date limite</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map(task => (
                <tr key={task.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--color-gray-900)' }}>{task.title}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>{task.description}</div>
                  </td>
                  <td><span className="tag">{task.project}</span></td>
                  <td>{task.assignee}</td>
                  <td>
                    <span className={`badge badge--${getPriorityColor(task.priority)}`}>
                      {getPriorityLabel(task.priority)}
                    </span>
                  </td>
                  <td>{formatDateShort(task.dueDate)}</td>
                  <td>
                    <select
                      className="filter-select"
                      style={{ padding: '2px 24px 2px 8px', fontSize: 'var(--text-xs)' }}
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    >
                      <option value="todo">À faire</option>
                      <option value="in-progress">En cours</option>
                      <option value="in-review">En revue</option>
                      <option value="done">Terminé</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Radix Dialog: Create Task */}
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="dialog-content">
            <div className="dialog-header">
              <Dialog.Title className="dialog-title">Nouvelle tâche</Dialog.Title>
            </div>
            <form onSubmit={handleCreateTask}>
              <div className="dialog-body">
                <div className="input-group" style={{ marginBottom: 'var(--space-4)' }}>
                  <label className="input-label">Titre de la tâche *</label>
                  <input
                    className="input"
                    required
                    placeholder="ex: Refactoriser le module d'auth"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="input-group" style={{ marginBottom: 'var(--space-4)' }}>
                  <label className="input-label">Description</label>
                  <textarea
                    className="input textarea"
                    placeholder="Détails du travail à effectuer..."
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="form-grid form-grid--2" style={{ marginBottom: 'var(--space-4)' }}>
                  <div className="input-group">
                    <label className="input-label">Responsable *</label>
                    <select
                      className="filter-select"
                      style={{ width: '100%' }}
                      value={formData.assigneeId}
                      onChange={e => setFormData({ ...formData, assigneeId: e.target.value })}
                    >
                      {employees.map(e => (
                        <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>
                      ))}
                    </select>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Projet</label>
                    <select
                      className="filter-select"
                      style={{ width: '100%' }}
                      value={formData.project}
                      onChange={e => setFormData({ ...formData, project: e.target.value })}
                    >
                      <option value="RH System v2">RH System v2</option>
                      <option value="API Gateway">API Gateway</option>
                      <option value="Design System">Design System</option>
                      <option value="Infrastructure Cloud">Infrastructure Cloud</option>
                    </select>
                  </div>
                </div>

                <div className="form-grid form-grid--2" style={{ marginBottom: 'var(--space-4)' }}>
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

                  <div className="input-group">
                    <label className="input-label">Date limite</label>
                    <input
                      type="date"
                      className="input"
                      value={formData.dueDate}
                      onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="dialog-footer">
                <button type="button" className="btn btn--secondary" onClick={() => setIsModalOpen(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn btn--primary">
                  Créer la tâche
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
