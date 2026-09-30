import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Plus, Search, Filter, Eye, Edit, Trash2, Mail, Phone,
  Building, ChevronLeft, ChevronRight, UserCheck, ShieldAlert
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import employeeService from '../services/employeeService';
import { useToast } from '../contexts/ToastContext';
import {
  getInitials, generateAvatarColor, getStatusLabel,
  getStatusColor, formatDateShort
} from '../utils/helpers';

export default function EmployeesPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Dialog states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    department: 'Frontend',
    contractType: 'CDI',
    hireDate: new Date().toISOString().split('T')[0],
    manager: 'Aziz Benali',
    skills: 'React.js, JavaScript',
  });

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const res = await employeeService.getAll({
        search,
        department: departmentFilter,
        status: statusFilter,
      });
      setEmployees(res.data);
    } catch (err) {
      toast.error('Erreur lors du chargement des employés');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, [search, departmentFilter, statusFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        skills: typeof formData.skills === 'string'
          ? formData.skills.split(',').map(s => s.trim()).filter(Boolean)
          : formData.skills,
      };

      if (selectedEmployee) {
        await employeeService.update(selectedEmployee.id, payload);
        toast.success('Employé mis à jour avec succès');
      } else {
        await employeeService.create(payload);
        toast.success('Employé ajouté avec succès');
      }

      setIsAddOpen(false);
      setSelectedEmployee(null);
      resetForm();
      loadEmployees();
    } catch (err) {
      toast.error(err.message || 'Une erreur est survenue');
    }
  };

  const handleDelete = async () => {
    if (!selectedEmployee) return;
    try {
      await employeeService.delete(selectedEmployee.id);
      toast.success('Employé supprimé');
      setIsDeleteOpen(false);
      setSelectedEmployee(null);
      loadEmployees();
    } catch (err) {
      toast.error('Impossible de supprimer cet employé');
    }
  };

  const openEdit = (emp) => {
    setSelectedEmployee(emp);
    setFormData({
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      phone: emp.phone || '',
      position: emp.position,
      department: emp.department,
      contractType: emp.contractType,
      hireDate: emp.hireDate,
      manager: emp.manager || '',
      skills: Array.isArray(emp.skills) ? emp.skills.join(', ') : '',
    });
    setIsAddOpen(true);
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      position: '',
      department: 'Frontend',
      contractType: 'CDI',
      hireDate: new Date().toISOString().split('T')[0],
      manager: 'Aziz Benali',
      skills: 'React.js, JavaScript',
    });
  };

  // Pagination logic
  const totalPages = Math.ceil(employees.length / itemsPerPage) || 1;
  const paginatedEmployees = employees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="page-enter">
      <div className="page-header">
        <div className="page-header__left">
          <h1 className="page-title">Gestion des Employés</h1>
          <p className="page-subtitle">Gérez et consultez les collaborateurs de la startup ({employees.length} au total)</p>
        </div>
        <button
          className="btn btn--primary"
          onClick={() => {
            setSelectedEmployee(null);
            resetForm();
            setIsAddOpen(true);
          }}
        >
          <Plus size={18} />
          Ajouter un employé
        </button>
      </div>

      {/* Filters Bar */}
      <div className="card" style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-4)' }}>
        <div className="filters-bar">
          <div className="search-input" style={{ flex: 1, minWidth: 240 }}>
            <Search size={16} className="search-input__icon" />
            <input
              className="input"
              placeholder="Rechercher par nom, poste, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="filter-select"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <option value="">Tous les départements</option>
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Design">Design</option>
            <option value="DevOps">DevOps</option>
            <option value="QA">QA</option>
            <option value="Product">Product</option>
            <option value="RH">RH</option>
          </select>

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="probation">Période d'essai</option>
            <option value="inactive">Inactif</option>
          </select>
        </div>
      </div>

      {/* Employees Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Collaborateur</th>
              <th>Poste / Dépt</th>
              <th>Email</th>
              <th>Contrat</th>
              <th>Arrivée</th>
              <th>Manager</th>
              <th>Statut</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx}>
                  <td colSpan={8}>
                    <div className="skeleton skeleton--row" />
                  </td>
                </tr>
              ))
            ) : paginatedEmployees.length === 0 ? (
              <tr>
                <td colSpan={8}>
                  <div className="empty-state">
                    <div className="empty-state__icon">
                      <Users size={32} />
                    </div>
                    <div className="empty-state__title">Aucun employé trouvé</div>
                    <div className="empty-state__description">
                      Ajustez vos filtres de recherche ou ajoutez un nouveau membre à l'équipe.
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedEmployees.map((emp) => {
                const statusColor = getStatusColor(emp.status);
                return (
                  <tr key={emp.id}>
                    <td>
                      <div
                        style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', cursor: 'pointer' }}
                        onClick={() => navigate(`/employees/${emp.id}`)}
                      >
                        <div
                          className="avatar avatar--md"
                          style={{ background: generateAvatarColor(emp.firstName) }}
                        >
                          {getInitials(emp.firstName, emp.lastName)}
                          <span className={`avatar__status avatar__status--${emp.availability || 'available'}`} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--color-gray-900)' }}>
                            {emp.firstName} {emp.lastName}
                          </div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>
                            ID: #{emp.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500, color: 'var(--color-gray-900)' }}>{emp.position}</div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>{emp.department}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-xs)' }}>
                        <Mail size={14} style={{ color: 'var(--color-gray-400)' }} />
                        {emp.email}
                      </div>
                    </td>
                    <td>
                      <span className="tag">{emp.contractType}</span>
                    </td>
                    <td>{formatDateShort(emp.hireDate)}</td>
                    <td>{emp.manager || '—'}</td>
                    <td>
                      <span className={`badge badge--${statusColor} badge--dot`}>
                        {getStatusLabel(emp.status)}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="table__actions" style={{ justifyContent: 'flex-end' }}>
                        <button
                          className="btn btn--ghost btn--icon btn--sm"
                          title="Voir le profil"
                          onClick={() => navigate(`/employees/${emp.id}`)}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="btn btn--ghost btn--icon btn--sm"
                          title="Modifier"
                          onClick={() => openEdit(emp)}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="btn btn--ghost btn--icon btn--sm"
                          style={{ color: 'var(--color-error-600)' }}
                          title="Supprimer"
                          onClick={() => {
                            setSelectedEmployee(emp);
                            setIsDeleteOpen(true);
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <div className="pagination__info">
              Affichage de {(currentPage - 1) * itemsPerPage + 1} à {Math.min(currentPage * itemsPerPage, employees.length)} sur {employees.length} employés
            </div>
            <div className="pagination__buttons">
              <button
                className="pagination__btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  className={`pagination__btn ${currentPage === i + 1 ? 'pagination__btn--active' : ''}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="pagination__btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Radix Dialog: Add / Edit Employee */}
      <Dialog.Root open={isAddOpen} onOpenChange={setIsAddOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="dialog-content">
            <div className="dialog-header">
              <Dialog.Title className="dialog-title">
                {selectedEmployee ? 'Modifier le collaborateur' : 'Ajouter un collaborateur'}
              </Dialog.Title>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="dialog-body">
                <div className="form-grid form-grid--2">
                  <div className="input-group">
                    <label className="input-label">Prénom *</label>
                    <input
                      className="input"
                      required
                      value={formData.firstName}
                      onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Nom *</label>
                    <input
                      className="input"
                      required
                      value={formData.lastName}
                      onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-grid form-grid--2" style={{ marginTop: 'var(--space-4)' }}>
                  <div className="input-group">
                    <label className="input-label">Email professionnel *</label>
                    <input
                      type="email"
                      className="input"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Téléphone</label>
                    <input
                      className="input"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-grid form-grid--2" style={{ marginTop: 'var(--space-4)' }}>
                  <div className="input-group">
                    <label className="input-label">Poste *</label>
                    <input
                      className="input"
                      required
                      value={formData.position}
                      onChange={e => setFormData({ ...formData, position: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Département *</label>
                    <select
                      className="filter-select"
                      style={{ width: '100%' }}
                      value={formData.department}
                      onChange={e => setFormData({ ...formData, department: e.target.value })}
                    >
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="Design">Design</option>
                      <option value="DevOps">DevOps</option>
                      <option value="QA">QA</option>
                      <option value="Product">Product</option>
                      <option value="RH">RH</option>
                    </select>
                  </div>
                </div>

                <div className="form-grid form-grid--2" style={{ marginTop: 'var(--space-4)' }}>
                  <div className="input-group">
                    <label className="input-label">Type de contrat</label>
                    <select
                      className="filter-select"
                      style={{ width: '100%' }}
                      value={formData.contractType}
                      onChange={e => setFormData({ ...formData, contractType: e.target.value })}
                    >
                      <option value="CDI">CDI</option>
                      <option value="CDD">CDD</option>
                      <option value="Stage">Stage</option>
                      <option value="Freelance">Freelance</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Date d'embauche</label>
                    <input
                      type="date"
                      className="input"
                      value={formData.hireDate}
                      onChange={e => setFormData({ ...formData, hireDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="input-group" style={{ marginTop: 'var(--space-4)' }}>
                  <label className="input-label">Compétences (séparées par des virgules)</label>
                  <input
                    className="input"
                    placeholder="ex: React.js, Node.js, Docker"
                    value={formData.skills}
                    onChange={e => setFormData({ ...formData, skills: e.target.value })}
                  />
                </div>
              </div>
              <div className="dialog-footer">
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => setIsAddOpen(false)}
                >
                  Annuler
                </button>
                <button type="submit" className="btn btn--primary">
                  {selectedEmployee ? 'Sauvegarder' : 'Ajouter l\'employé'}
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Radix Dialog: Confirm Delete */}
      <Dialog.Root open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="dialog-content" style={{ maxWidth: 440 }}>
            <div className="dialog-header">
              <Dialog.Title className="dialog-title">Confirmer la suppression</Dialog.Title>
            </div>
            <div className="dialog-body">
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)' }}>
                Êtes-vous sûr de vouloir supprimer{' '}
                <strong>
                  {selectedEmployee?.firstName} {selectedEmployee?.lastName}
                </strong>{' '}
                ? Cette action est irréversible.
              </p>
            </div>
            <div className="dialog-footer">
              <button
                className="btn btn--secondary"
                onClick={() => setIsDeleteOpen(false)}
              >
                Annuler
              </button>
              <button className="btn btn--danger" onClick={handleDelete}>
                Supprimer
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
