import { useState } from 'react';
import {
  BookOpen, Code, Terminal, GitBranch, Shield, Users, HelpCircle,
  Search, ChevronRight, FileText, ExternalLink, Info, CheckCircle2, AlertTriangle
} from 'lucide-react';

const docSections = [
  { id: 'intro', title: 'Guide de démarrage', icon: BookOpen },
  { id: 'company', title: 'Règles & Processus RH', icon: Users },
  { id: 'dev-process', title: 'Processus de Développement', icon: Code },
  { id: 'git-workflow', title: 'Git & Workflow GitHub', icon: GitBranch },
  { id: 'frontend', title: 'Architecture Frontend', icon: Terminal },
  { id: 'backend', title: 'Architecture Backend & API', icon: Shield },
  { id: 'devops', title: 'Déploiement & DevOps', icon: ExternalLink },
  { id: 'faq', title: 'Foire Aux Questions (FAQ)', icon: HelpCircle },
];

export default function DocumentationPage() {
  const [activeTab, setActiveTab] = useState('intro');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="page-enter">
      <div className="page-header">
        <div className="page-header__left">
          <h1 className="page-title">Documentation Interne & Knowledge Base</h1>
          <p className="page-subtitle">Guide d'onboarding, normes techniques et processus RH de la startup</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 'var(--space-6)' }}>
        {/* Sidebar Nav Documentation */}
        <div className="card" style={{ height: 'fit-content' }}>
          <div className="card__header" style={{ padding: 'var(--space-4)' }}>
            <div className="search-input" style={{ width: '100%' }}>
              <Search size={14} className="search-input__icon" />
              <input
                className="input"
                placeholder="Rechercher..."
                style={{ fontSize: 'var(--text-xs)' }}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="card__body" style={{ padding: 'var(--space-2)' }}>
            {docSections.map(sec => {
              const Icon = sec.icon;
              const isActive = activeTab === sec.id;
              return (
                <button
                  key={sec.id}
                  className={`sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
                  style={{ width: '100%', border: 'none', textAlign: 'left', cursor: 'pointer' }}
                  onClick={() => setActiveTab(sec.id)}
                >
                  <Icon size={16} />
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: isActive ? 600 : 400 }}>{sec.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content View */}
        <div className="card">
          <div className="card__body" style={{ padding: 'var(--space-8)', lineHeight: 1.7 }}>
            {activeTab === 'intro' && (
              <div>
                <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-4)', color: 'var(--color-gray-900)' }}>
                  👋 Bienvenue dans l'équipe de développement !
                </h2>
                <p style={{ color: 'var(--color-gray-700)', marginBottom: 'var(--space-4)' }}>
                  Cette plateforme RH et technique est conçue pour faciliter l'intégration et le quotidien de chaque collaborateur, manager et développeur au sein de la startup.
                </p>

                <div style={{ padding: 'var(--space-4)', background: 'var(--color-primary-50)', borderLeft: '4px solid var(--color-primary-600)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-6)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, color: 'var(--color-primary-800)', marginBottom: 4 }}>
                    <Info size={18} /> Premier jour ?
                  </div>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary-900)' }}>
                    Consultez votre manager direct pour obtenir vos accès Slack, GitHub, Figma, et votre adresse email professionnelle en <code>@rhtech.io</code>.
                  </p>
                </div>

                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginTop: 'var(--space-6)', marginBottom: 'var(--space-2)' }}>🚀 Outils essentiels</h3>
                <ul style={{ listStyleType: 'disc', paddingLeft: 20, color: 'var(--color-gray-700)', display: 'grid', gap: 6 }}>
                  <td><strong>Slack :</strong> Communication quotidienne et channels d'équipe.</td>
                  <td><strong>GitHub :</strong> Dépôts de code, PR et review.</td>
                  <td><strong>RH System :</strong> Gestion de vos congés, tâches et documents.</td>
                  <td><strong>Figma :</strong> Design system et prototypes UI/UX.</td>
                </ul>
              </div>
            )}

            {activeTab === 'company' && (
              <div>
                <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
                  🏛️ Règles d'entreprise & Processus RH
                </h2>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginTop: 'var(--space-4)' }}>1. Politiques de Télétravail</h3>
                <p style={{ color: 'var(--color-gray-700)', marginBottom: 'var(--space-4)' }}>
                  La startup adopte un modèle hybride : jusqu'à 3 jours de télétravail par semaine sont autorisés pour l'équipe technique avec validation sur la plateforme.
                </p>

                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginTop: 'var(--space-4)' }}>2. Demandes de congés</h3>
                <p style={{ color: 'var(--color-gray-700)' }}>
                  Toute demande de congé doit être soumise au moins 1 semaine à l'avance via l'onglet <strong>Congés & Absences</strong>.
                </p>
              </div>
            )}

            {activeTab === 'git-workflow' && (
              <div>
                <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
                  🔀 Git & Workflow GitHub
                </h2>
                <p style={{ color: 'var(--color-gray-700)', marginBottom: 'var(--space-4)' }}>
                  Nous utilisons <strong>GitHub Flow</strong> pour garantir la stabilité de la branche principale <code>main</code>.
                </p>

                <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 600, marginBottom: 8 }}>Convention de nommage des branches</h3>
                <pre style={{ background: 'var(--color-gray-900)', color: 'var(--color-white)', padding: 16, borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-mono)', fontSize: 13, marginBottom: 16 }}>
                  feature/add-employee-form{'\n'}
                  fix/dashboard-chart-render{'\n'}
                  refactor/leave-service-api
                </pre>

                <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 600, marginBottom: 8 }}>Exemple de workflow Git</h3>
                <pre style={{ background: 'var(--color-gray-900)', color: '#818cf8', padding: 16, borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
                  git checkout main{'\n'}
                  git pull origin main{'\n'}
                  git checkout -b feature/ma-fonctionnalite{'\n'}
                  # Travail et commits...{'\n'}
                  git push origin feature/ma-fonctionnalite
                </pre>
              </div>
            )}

            {activeTab === 'frontend' && (
              <div>
                <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
                  💻 Architecture Frontend React
                </h2>
                <p style={{ color: 'var(--color-gray-700)', marginBottom: 'var(--space-4)' }}>
                  Le frontend est développé en <strong>React.js + Vite</strong> sans Tailwind. Les styles s'appuient sur des variables CSS globales et des composants modulaires Radix UI.
                </p>
                <div style={{ background: 'var(--color-gray-50)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-200)', fontSize: 13, fontFamily: 'var(--font-mono)' }}>
                  src/<br/>
                  ├── components/ (layout, ui)<br/>
                  ├── contexts/ (AuthContext, ToastContext)<br/>
                  ├── data/ (mockData)<br/>
                  ├── pages/ (Dashboard, Employees, Tasks...)<br/>
                  ├── services/ (apiClient, employeeService...)<br/>
                  └── styles/ (variables.css, globals.css, components.css)<br/>
                </div>
              </div>
            )}

            {activeTab === 'faq' && (
              <div>
                <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
                  ❓ Foire Aux Questions
                </h2>
                <div style={{ display: 'grid', gap: 16 }}>
                  <div>
                    <strong>Comment réinitialiser mon mot de passe ?</strong>
                    <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--text-sm)', marginTop: 4 }}>
                      Rendez-vous dans Paramètres &gt; Sécurité ou contactez l'équipe RH.
                    </p>
                  </div>
                  <div>
                    <strong>Comment ajouter un document confidentiel ?</strong>
                    <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--text-sm)', marginTop: 4 }}>
                      Dans la section Documents, utilisez le bouton "Téléverser" et définissez la catégorie appropriée.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {['backend', 'devops', 'dev-process'].includes(activeTab) && (
              <div>
                <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
                  📘 Section technique ({activeTab})
                </h2>
                <p style={{ color: 'var(--color-gray-700)' }}>
                  Cette section détaille les conventions d'architecture et les pipelines CI/CD de l'infrastructure cloud.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
