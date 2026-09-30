import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Mail, Phone, MapPin, Calendar, Briefcase, UserCheck,
  FileText, CheckCircle2, Star, Shield, Clock, Plus, Download, Code
} from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';
import employeeService from '../services/employeeService';
import { documents as mockDocs } from '../data/mockData';
import { activities as mockActivities } from '../data/mockData';
import { useToast } from '../contexts/ToastContext';
import {
  getInitials, generateAvatarColor, formatDate,
  getStatusLabel, getStatusColor
} from '../utils/helpers';

export default function EmployeeProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEmp() {
      try {
        const data = await employeeService.getById(id);
        setEmployee(data);
      } catch (err) {
        toast.error('Employé non trouvé');
        navigate('/employees');
      } finally {
        setLoading(false);
      }
    }
    fetchEmp();
  }, [id]);

  if (loading) {
    return (
      <div className="page-enter" style={{ padding: 'var(--space-8)' }}>
        <div className="skeleton skeleton--title" style={{ marginBottom: 16 }} />
        <div className="skeleton skeleton--card" />
      </div>
    );
  }

  if (!employee) return null;

  const empDocs = mockDocs.filter(d => d.employeeId === employee.id || !d.employeeId);
  const empActivities = mockActivities.filter(a => a.user.includes(employee.firstName));

  return (
    <div className="page-enter">
      {/* Back button */}
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <button
          className="btn btn--ghost btn--sm"
          onClick={() => navigate('/employees')}
          style={{ gap: 6 }}
        >
          <ArrowLeft size={16} />
          Retour aux employés
        </button>
      </div>

      {/* Header Banner Card */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card__body" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
          <div
            className="avatar avatar--2xl"
            style={{ background: generateAvatarColor(employee.firstName) }}
          >
            {getInitials(employee.firstName, employee.lastName)}
            <span className={`avatar__status avatar__status--${employee.availability || 'available'}`} />
          </div>

          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
              <h1 className="page-title" style={{ marginBottom: 0 }}>
                {employee.firstName} {employee.lastName}
              </h1>
              <span className={`badge badge--${getStatusColor(employee.status)} badge--dot`}>
                {getStatusLabel(employee.status)}
              </span>
            </div>
            <div style={{ fontSize: 'var(--text-md)', fontWeight: 500, color: 'var(--color-primary-600)', marginTop: 4 }}>
              {employee.position} • {employee.department}
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 12, flexWrap: 'wrap', fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Mail size={14} /> {employee.email}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Phone size={14} /> {employee.phone || 'Non renseigné'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <MapPin size={14} /> {employee.address || 'Non renseignée'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 160 }}>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)' }}>Solde de congés</div>
            <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-gray-900)' }}>
              {employee.leaveBalance ? employee.leaveBalance.annual - employee.leaveBalance.used : 22} <span style={{ fontSize: 'var(--text-sm)', fontWeight: 400, color: 'var(--color-gray-500)' }}>jours restants</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs.Root defaultValue="info">
        <Tabs.List className="tabs-list" style={{ padding: 0, marginBottom: 'var(--space-6)' }}>
          <Tabs.Trigger value="info" className="tab-trigger">Informations</Tabs.Trigger>
          <Tabs.Trigger value="skills" className="tab-trigger">Compétences</Tabs.Trigger>
          <Tabs.Trigger value="activity" className="tab-trigger">Activité récente</Tabs.Trigger>
          <Tabs.Trigger value="documents" className="tab-trigger">Documents ({empDocs.length})</Tabs.Trigger>
        </Tabs.List>

        {/* Tab 1: Informations */}
        <Tabs.Content value="info">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
            <div className="card">
              <div className="card__header">
                <div className="card__title">Informations Personnelles</div>
              </div>
              <div className="card__body" style={{ display: 'grid', gap: 'var(--space-4)' }}>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>Nom complet</div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-gray-900)' }}>{employee.firstName} {employee.lastName}</div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>Email professionnel</div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-gray-900)' }}>{employee.email}</div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>Téléphone</div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-gray-900)' }}>{employee.phone || 'Non renseigné'}</div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>Adresse</div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-gray-900)' }}>{employee.address || 'Non renseignée'}</div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card__header">
                <div className="card__title">Informations Professionnelles</div>
              </div>
              <div className="card__body" style={{ display: 'grid', gap: 'var(--space-4)' }}>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>Poste actuel</div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-gray-900)' }}>{employee.position}</div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>Département</div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-gray-900)' }}>{employee.department}</div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>Manager direct</div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-gray-900)' }}>{employee.manager || 'Aucun'}</div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>Date d'embauche</div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-gray-900)' }}>{formatDate(employee.hireDate)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>Type de contrat</div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-gray-900)' }}>{employee.contractType}</div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>Projet actuel</div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-primary-600)' }}>{employee.currentProject || 'Non assigné'}</div>
                </div>
              </div>
            </div>
          </div>
        </Tabs.Content>

        {/* Tab 2: Compétences */}
        <Tabs.Content value="skills">
          <div className="card">
            <div className="card__header">
              <div className="card__title">Compétences & Technologies</div>
            </div>
            <div className="card__body">
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                {employee.skills && employee.skills.map(skill => (
                  <span
                    key={skill}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--color-primary-50)',
                      color: 'var(--color-primary-700)',
                      fontWeight: 500,
                      fontSize: 'var(--text-sm)',
                    }}
                  >
                    <Code size={14} />
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Tabs.Content>

        {/* Tab 3: Activité */}
        <Tabs.Content value="activity">
          <div className="card">
            <div className="card__header">
              <div className="card__title">Historique d'activité</div>
            </div>
            <div className="card__body">
              {empActivities.length === 0 ? (
                <div style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)' }}>
                  Aucune activité récente enregistrée pour ce collaborateur.
                </div>
              ) : (
                empActivities.map(act => (
                  <div key={act.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--color-gray-100)', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-700)' }}>
                      <strong>{act.user}</strong> {act.action}
                    </span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)' }}>{act.date}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </Tabs.Content>

        {/* Tab 4: Documents */}
        <Tabs.Content value="documents">
          <div className="card">
            <div className="card__header">
              <div className="card__title">Documents RH & Administratifs</div>
            </div>
            <div className="card__body" style={{ padding: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Nom du document</th>
                    <th>Catégorie</th>
                    <th>Taille</th>
                    <th>Date d'ajout</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {empDocs.map(doc => (
                    <tr key={doc.id}>
                      <td style={{ fontWeight: 500 }}>{doc.name}</td>
                      <td><span className="tag">{doc.category}</span></td>
                      <td>{doc.size}</td>
                      <td>{doc.uploadedAt}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn btn--ghost btn--sm"
                          onClick={() => toast.info(`Téléchargement de ${doc.name}`)}
                        >
                          <Download size={16} /> Télécharger
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
