import { useState } from 'react';
import { UsersRound, Code, Layers, CheckCircle2, Clock, Calendar, AlertCircle } from 'lucide-react';
import employees from '../data/employees';
import { teams, projects } from '../data/mockData';
import { getInitials, generateAvatarColor, getStatusLabel } from '../utils/helpers';

export default function TeamPage() {
  const [selectedTeam, setSelectedTeam] = useState('all');

  const filteredTeams = selectedTeam === 'all'
    ? teams
    : teams.filter(t => t.id === selectedTeam);

  return (
    <div className="page-enter">
      <div className="page-header">
        <div className="page-header__left">
          <h1 className="page-title">Gestion des Équipes & Collaboration</h1>
          <p className="page-subtitle">Visualisez les départements, la disponibilité en temps réel et les projets en cours</p>
        </div>
      </div>

      {/* Team Filter Tabs */}
      <div className="card" style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-4)' }}>
        <div className="filters-bar">
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-gray-600)' }}>Équipes:</span>
          <button
            className={`btn btn--sm ${selectedTeam === 'all' ? 'btn--primary' : 'btn--secondary'}`}
            onClick={() => setSelectedTeam('all')}
          >
            Toutes ({teams.length})
          </button>
          {teams.map(t => (
            <button
              key={t.id}
              className={`btn btn--sm ${selectedTeam === t.id ? 'btn--primary' : 'btn--secondary'}`}
              onClick={() => setSelectedTeam(t.id)}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Teams Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
        {filteredTeams.map(t => {
          const teamMembers = employees.filter(e => t.members.includes(e.id));
          return (
            <div key={t.id} className="card">
              <div className="card__header" style={{ borderLeft: `4px solid ${t.color}` }}>
                <div>
                  <div className="card__title">{t.name}</div>
                  <div className="card__subtitle">Lead: {t.lead} • {teamMembers.length} membres</div>
                </div>
              </div>

              <div className="card__body">
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-gray-500)', textTransform: 'uppercase', marginBottom: 'var(--space-3)' }}>
                  Membres et disponibilité
                </div>

                <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                  {teamMembers.map(member => (
                    <div
                      key={member.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--color-gray-25)',
                        border: '1px solid var(--color-gray-100)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <div className="avatar avatar--sm" style={{ background: generateAvatarColor(member.firstName) }}>
                          {getInitials(member.firstName, member.lastName)}
                          <span className={`avatar__status avatar__status--${member.availability}`} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{member.firstName} {member.lastName}</div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>{member.position}</div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span className={`badge badge--${member.availability === 'available' ? 'success' : member.availability === 'in-meeting' ? 'warning' : 'info'} badge--dot`}>
                          {getStatusLabel(member.availability)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--color-gray-100)' }}>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)', marginBottom: 6 }}>Projets de l'équipe</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {t.projects.map(p => (
                      <span key={p} className="tag" style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary-700)' }}>
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Section: Travail en cours (Current Projects / Work in progress) */}
      <div className="card">
        <div className="card__header">
          <div>
            <div className="card__title">Travail en cours — Projets & Équipes</div>
            <div className="card__subtitle">Aperçu du déroulement des projets logiciels et des développeurs assignés</div>
          </div>
        </div>
        <div className="card__body" style={{ padding: 0 }}>
          <table className="table">
            <thead>
              <tr>
                <th>Projet</th>
                <th>Responsable</th>
                <th>Membres assignés</th>
                <th>Progression</th>
                <th>Deadline</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(prj => {
                const prjMembers = employees.filter(e => prj.members.includes(e.id));
                return (
                  <tr key={prj.id}>
                    <td style={{ fontWeight: 600, color: 'var(--color-gray-900)' }}>{prj.name}</td>
                    <td>{prj.lead}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {prjMembers.map((m, idx) => (
                          <div
                            key={m.id}
                            className="avatar avatar--sm"
                            style={{
                              background: generateAvatarColor(m.firstName),
                              marginLeft: idx > 0 ? -8 : 0,
                              border: '2px solid white',
                            }}
                            title={`${m.firstName} ${m.lastName}`}
                          >
                            {getInitials(m.firstName, m.lastName)}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td style={{ width: 180 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="progress" style={{ flex: 1 }}>
                          <div className="progress__bar" style={{ width: `${prj.progress}%` }} />
                        </div>
                        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>{prj.progress}%</span>
                      </div>
                    </td>
                    <td>{prj.deadline}</td>
                    <td>
                      <span className="badge badge--success badge--dot">En cours</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
