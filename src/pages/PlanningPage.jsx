import { useState } from 'react';
import { CalendarClock, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import employees from '../data/employees';
import leaves from '../data/leaves';
import { getInitials, generateAvatarColor } from '../utils/helpers';

export default function PlanningPage() {
  const daysOfWeek = ['Lundi 28', 'Mardi 29', 'Mercredi 30', 'Jeudi 1', 'Vendredi 2', 'Samedi 3', 'Dimanche 4'];

  return (
    <div className="page-enter">
      <div className="page-header">
        <div className="page-header__left">
          <h1 className="page-title">Planning & Emploi du Temps</h1>
          <p className="page-subtitle">Vue hebdomadaire de la présence de l'équipe et des rotations de garde</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button className="btn btn--secondary btn--sm"><ChevronLeft size={16} /></button>
          <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Semaine 40 (Sep - Oct 2026)</span>
          <button className="btn btn--secondary btn--sm"><ChevronRight size={16} /></button>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: 220 }}>Collaborateur</th>
              {daysOfWeek.map(d => (
                <th key={d} style={{ textAlign: 'center' }}>{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.slice(0, 10).map(emp => {
              const empLeave = leaves.find(l => l.employeeName.includes(emp.firstName) && l.status === 'approved');
              return (
                <tr key={emp.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="avatar avatar--sm" style={{ background: generateAvatarColor(emp.firstName) }}>
                        {getInitials(emp.firstName, emp.lastName)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 'var(--text-xs)' }}>{emp.firstName} {emp.lastName}</div>
                        <div style={{ fontSize: 10, color: 'var(--color-gray-400)' }}>{emp.department}</div>
                      </div>
                    </div>
                  </td>
                  {daysOfWeek.map((day, idx) => {
                    const isWeekend = idx >= 5;
                    return (
                      <td key={day} style={{ textAlign: 'center', padding: 8 }}>
                        {isWeekend ? (
                          <span style={{ fontSize: 11, color: 'var(--color-gray-400)' }}>W-E</span>
                        ) : empLeave ? (
                          <span className="badge badge--info" style={{ fontSize: 10 }}>Congé</span>
                        ) : (
                          <span className="badge badge--success" style={{ fontSize: 10 }}>Présent</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
