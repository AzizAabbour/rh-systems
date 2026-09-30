import { useState, useEffect } from 'react';
import {
  FileText, Upload, Search, Download, Trash2, Eye, Filter, Plus, Shield
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import documentService from '../services/documentService';
import { useToast } from '../contexts/ToastContext';

export default function DocumentsPage() {
  const toast = useToast();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const [newDoc, setNewDoc] = useState({
    name: '',
    category: 'Documents internes',
    type: 'PDF',
    size: '250 Ko',
    uploadedBy: 'Aziz Benali',
  });

  const loadDocs = async () => {
    setLoading(true);
    try {
      const res = await documentService.getAll({ category: categoryFilter, search });
      setDocuments(res.data);
    } catch (err) {
      toast.error('Erreur lors du chargement des documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocs();
  }, [categoryFilter, search]);

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      await documentService.create(newDoc);
      toast.success('Document téléversé avec succès');
      setIsUploadOpen(false);
      setNewDoc({ name: '', category: 'Documents internes', type: 'PDF', size: '250 Ko', uploadedBy: 'Aziz Benali' });
      loadDocs();
    } catch (err) {
      toast.error('Erreur lors du téléversement');
    }
  };

  const handleDelete = async (id) => {
    try {
      await documentService.delete(id);
      toast.success('Document supprimé');
      loadDocs();
    } catch (err) {
      toast.error('Erreur de suppression');
    }
  };

  return (
    <div className="page-enter">
      <div className="page-header">
        <div className="page-header__left">
          <h1 className="page-title">Documents RH & Coffre-Fort</h1>
          <p className="page-subtitle">Espace sécurisé pour les contrats, attestations et documents d'entreprise</p>
        </div>
        <button className="btn btn--primary" onClick={() => setIsUploadOpen(true)}>
          <Upload size={18} /> Téléverser un document
        </button>
      </div>

      {/* Filter bar */}
      <div className="card" style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-4)' }}>
        <div className="filters-bar">
          <div className="search-input" style={{ flex: 1, minWidth: 240 }}>
            <Search size={16} className="search-input__icon" />
            <input
              className="input"
              placeholder="Rechercher un document par nom..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="filter-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">Toutes les catégories</option>
            <option value="Contrats">Contrats</option>
            <option value="CV">CV</option>
            <option value="Attestations">Attestations</option>
            <option value="Documents internes">Documents internes</option>
            <option value="Documents administratifs">Documents administratifs</option>
          </select>
        </div>
      </div>

      {/* Documents Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Nom du document</th>
              <th>Catégorie</th>
              <th>Format</th>
              <th>Taille</th>
              <th>Ajouté par</th>
              <th>Date</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="empty-state">
                    <FileText size={32} />
                    <div className="empty-state__title">Aucun document trouvé</div>
                  </div>
                </td>
              </tr>
            ) : (
              documents.map(doc => (
                <tr key={doc.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 600, color: 'var(--color-gray-900)' }}>
                      <FileText size={18} style={{ color: 'var(--color-primary-600)' }} />
                      {doc.name}
                    </div>
                  </td>
                  <td><span className="tag">{doc.category}</span></td>
                  <td><span className="badge badge--gray">{doc.type}</span></td>
                  <td>{doc.size}</td>
                  <td>{doc.uploadedBy}</td>
                  <td>{doc.uploadedAt}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="table__actions" style={{ justifyContent: 'flex-end' }}>
                      <button
                        className="btn btn--ghost btn--icon btn--sm"
                        title="Aperçu"
                        onClick={() => toast.info(`Aperçu du document: ${doc.name}`)}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="btn btn--ghost btn--icon btn--sm"
                        title="Télécharger"
                        onClick={() => toast.success(`Téléchargement de ${doc.name}`)}
                      >
                        <Download size={16} />
                      </button>
                      <button
                        className="btn btn--ghost btn--icon btn--sm"
                        style={{ color: 'var(--color-error-600)' }}
                        title="Supprimer"
                        onClick={() => handleDelete(doc.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Radix Dialog: Upload Document */}
      <Dialog.Root open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="dialog-content">
            <div className="dialog-header">
              <Dialog.Title className="dialog-title">Ajouter un document</Dialog.Title>
            </div>
            <form onSubmit={handleUpload}>
              <div className="dialog-body">
                <div className="input-group" style={{ marginBottom: 'var(--space-4)' }}>
                  <label className="input-label">Nom du document *</label>
                  <input
                    className="input"
                    required
                    placeholder="ex: Contrat de travail — Sara El Amrani"
                    value={newDoc.name}
                    onChange={e => setNewDoc({ ...newDoc, name: e.target.value })}
                  />
                </div>

                <div className="form-grid form-grid--2" style={{ marginBottom: 'var(--space-4)' }}>
                  <div className="input-group">
                    <label className="input-label">Catégorie</label>
                    <select
                      className="filter-select"
                      style={{ width: '100%' }}
                      value={newDoc.category}
                      onChange={e => setNewDoc({ ...newDoc, category: e.target.value })}
                    >
                      <option value="Contrats">Contrats</option>
                      <option value="CV">CV</option>
                      <option value="Attestations">Attestations</option>
                      <option value="Documents internes">Documents internes</option>
                      <option value="Documents administratifs">Documents administratifs</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Format / Type</label>
                    <input
                      className="input"
                      value={newDoc.type}
                      onChange={e => setNewDoc({ ...newDoc, type: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ padding: '24px', border: '2px dashed var(--color-gray-300)', borderRadius: 'var(--radius-lg)', textAlign: 'center', background: 'var(--color-gray-25)', cursor: 'pointer' }}>
                  <Upload size={32} style={{ color: 'var(--color-gray-400)', marginBottom: 8 }} />
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>Glissez un fichier ici ou cliquez pour parcourir</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)', marginTop: 4 }}>PDF, DOCX, PNG jusqu'à 10MB</div>
                </div>
              </div>

              <div className="dialog-footer">
                <button type="button" className="btn btn--secondary" onClick={() => setIsUploadOpen(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn btn--primary">
                  Téléverser
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
