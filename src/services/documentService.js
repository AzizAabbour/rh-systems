import { documents as docsData } from '../data/mockData';

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));
let documents = [...docsData];

const documentService = {
  async getAll(filters = {}) {
    await delay();
    let result = [...documents];
    if (filters.category) result = result.filter(d => d.category === filters.category);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(d => d.name.toLowerCase().includes(q));
    }
    return { data: result, total: result.length };
  },

  async create(data) {
    await delay();
    const newDoc = { ...data, id: Math.max(...documents.map(d => d.id)) + 1, uploadedAt: new Date().toISOString().split('T')[0] };
    documents.push(newDoc);
    return newDoc;
  },

  async delete(id) {
    await delay();
    documents = documents.filter(d => d.id !== Number(id));
    return { success: true };
  },
};

export default documentService;
