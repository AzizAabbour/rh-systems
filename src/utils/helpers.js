export function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatDateShort(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function formatRelativeDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diff === 0) return "Aujourd'hui";
  if (diff === 1) return 'Hier';
  if (diff < 7) return `Il y a ${diff} jours`;
  if (diff < 30) return `Il y a ${Math.floor(diff / 7)} semaines`;
  return formatDate(dateStr);
}

export function getInitials(firstName, lastName) {
  return `${(firstName || '')[0] || ''}${(lastName || '')[0] || ''}`.toUpperCase();
}

export function getStatusLabel(status) {
  const labels = {
    active: 'Actif',
    inactive: 'Inactif',
    probation: 'Période d\'essai',
    pending: 'En attente',
    approved: 'Approuvé',
    rejected: 'Refusé',
    todo: 'À faire',
    'in-progress': 'En cours',
    'in-review': 'En revue',
    done: 'Terminé',
    scheduled: 'Programmé',
    completed: 'Terminé',
    available: 'Disponible',
    'in-meeting': 'En réunion',
    'on-leave': 'En congé',
    offline: 'Hors ligne',
  };
  return labels[status] || status;
}

export function getStatusColor(status) {
  const colors = {
    active: 'success',
    inactive: 'gray',
    probation: 'warning',
    pending: 'warning',
    approved: 'success',
    rejected: 'error',
    todo: 'gray',
    'in-progress': 'primary',
    'in-review': 'warning',
    done: 'success',
    scheduled: 'info',
    completed: 'success',
    available: 'success',
    'in-meeting': 'warning',
    'on-leave': 'info',
    offline: 'gray',
  };
  return colors[status] || 'gray';
}

export function getPriorityLabel(priority) {
  const labels = { low: 'Basse', medium: 'Moyenne', high: 'Haute', urgent: 'Urgente' };
  return labels[priority] || priority;
}

export function getPriorityColor(priority) {
  const colors = { low: 'gray', medium: 'warning', high: 'error', urgent: 'error' };
  return colors[priority] || 'gray';
}

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function generateAvatarColor(name) {
  const colors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f59e0b',
    '#10b981', '#06b6d4', '#3b82f6', '#14b8a6', '#f97316',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}
