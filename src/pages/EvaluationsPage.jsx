import { useState } from 'react';
import { Star, Plus, CheckCircle, Calendar, User, Award, MessageSquare } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { evaluations as initialEvaluations } from '../data/mockData';
import employees from '../data/employees';
import { useToast } from '../contexts/ToastContext';

export default function EvaluationsPage() {
  const toast = useToast();
  const [evalList, setEvalList] = useState(initialEvaluations);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: 1,
    period: 'S2 2026',
    performance: 4,
    skills: 4,
    objectives: 4,
    comments: '',
    feedback: '',
  });

  const handleCreateEval = (e) => {
    e.preventDefault();
    const emp = employees.find(e => e.id === Number(formData.employeeId));
    const overall = (Number(formData.performance) + Number(formData.skills) + Number(formData.objectives)) / 3;

    const newEval = {
      id: Date.now(),
      employeeId: Number(formData.employeeId),
      employeeName: emp ? `${emp.firstName} ${emp.lastName}` : 'Collaborateur',
      period: formData.period,
      performance: Number(formData.performance),
      skills: Number(formData.skills),
      objectives: Number(formData.objectives),
      overallRating: Number(overall.toFixed(1)),
      comments: formData.comments,
      feedback: formData.feedback,
      evaluator: 'Aziz Benali',
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
    };

    setEvalList([newEval, ...evalList]);
    toast.success('Évaluation enregistrée');
    setIsModalOpen(false);
  };

  return (
    <div className="page-enter">
      <div className="page-header">
        <div className="page-header__left">
          <h1 className="page-title">Évaluations des Performances</h1>
          <p className="page-subtitle">Entretiens individuels, objectifs trimestriels et retours managériaux</p>
        </div>
        <button className="btn btn--primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Nouvelle évaluation
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
        {evalList.map(ev => (
          <div key={ev.id} className="card">
            <div className="card__header">
              <div>
                <div className="card__title">{ev.employeeName}</div>
                <div className="card__subtitle">Période: {ev.period} • Évaluateur: {ev.evaluator}</div>
              </div>
              {ev.overallRating ? (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  padding: '4px 10px', borderRadius: 'var(--radius-full)',
                  background: 'var(--color-primary-50)', color: 'var(--color-primary-700)',
                  fontWeight: 700, fontSize: 'var(--text-md)',
                }}>
                  <Star size={16} style={{ fill: 'currentColor' }} />
                  {ev.overallRating} / 5
                </div>
              ) : (
                <span className="badge badge--info badge--dot">Programmé</span>
              )}
            </div>

            <div className="card__body">
              {ev.overallRating ? (
                <div style={{ display: 'grid', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', marginBottom: 2 }}>
                      <span>Performance globale</span>
                      <span>{ev.performance}/5</span>
                    </div>
                    <div className="progress"><div className="progress__bar" style={{ width: `${(ev.performance / 5) * 100}%` }} /></div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', marginBottom: 2 }}>
                      <span>Compétences techniques</span>
                      <span>{ev.skills}/5</span>
                    </div>
                    <div className="progress"><div className="progress__bar" style={{ width: `${(ev.skills / 5) * 100}%` }} /></div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', marginBottom: 2 }}>
                      <span>Atteinte des objectifs</span>
                      <span>{ev.objectives}/5</span>
                    </div>
                    <div className="progress"><div className="progress__bar" style={{ width: `${(ev.objectives / 5) * 100}%` }} /></div>
                  </div>
                </div>
              ) : (
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)', marginBottom: 'var(--space-4)' }}>
                  L'évaluation est prévue pour le {ev.date}.
                </p>
              )}

              {ev.comments && (
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-600)', background: 'var(--color-gray-50)', padding: 10, borderRadius: 'var(--radius-md)' }}>
                  <strong>Commentaires:</strong> {ev.comments}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Radix Dialog: Create Evaluation */}
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="dialog-content">
            <div className="dialog-header">
              <Dialog.Title className="dialog-title">Nouvelle Évaluation de Performance</Dialog.Title>
            </div>
            <form onSubmit={handleCreateEval}>
              <div className="dialog-body">
                <div className="input-group" style={{ marginBottom: 'var(--space-4)' }}>
                  <label className="input-label">Collaborateur *</label>
                  <select
                    className="filter-select"
                    style={{ width: '100%' }}
                    value={formData.employeeId}
                    onChange={e => setFormData({ ...formData, employeeId: e.target.value })}
                  >
                    {employees.map(e => (
                      <option key={e.id} value={e.id}>{e.firstName} {e.lastName} ({e.position})</option>
                    ))}
                  </select>
                </div>

                <div className="form-grid form-grid--3" style={{ marginBottom: 'var(--space-4)' }}>
                  <div className="input-group">
                    <label className="input-label">Performance (1-5)</label>
                    <input
                      type="number" min="1" max="5" className="input"
                      value={formData.performance}
                      onChange={e => setFormData({ ...formData, performance: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Compétences (1-5)</label>
                    <input
                      type="number" min="1" max="5" className="input"
                      value={formData.skills}
                      onChange={e => setFormData({ ...formData, skills: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Objectifs (1-5)</label>
                    <input
                      type="number" min="1" max="5" className="input"
                      value={formData.objectives}
                      onChange={e => setFormData({ ...formData, objectives: e.target.value })}
                    />
                  </div>
                </div>

                <div className="input-group" style={{ marginBottom: 'var(--space-4)' }}>
                  <label className="input-label">Commentaires & Réalisations</label>
                  <textarea
                    className="input textarea"
                    placeholder="Synthèse de l'évaluation..."
                    value={formData.comments}
                    onChange={e => setFormData({ ...formData, comments: e.target.value })}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Axe d'amélioration / Feedback</label>
                  <textarea
                    className="input textarea"
                    placeholder="Objectifs futurs..."
                    value={formData.feedback}
                    onChange={e => setFormData({ ...formData, feedback: e.target.value })}
                  />
                </div>
              </div>

              <div className="dialog-footer">
                <button type="button" className="btn btn--secondary" onClick={() => setIsModalOpen(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn btn--primary">
                  Enregistrer l'évaluation
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
