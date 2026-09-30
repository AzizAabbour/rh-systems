import leavesData from '../data/leaves';

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));
let leaves = [...leavesData];

const leaveService = {
  async getAll(filters = {}) {
    await delay();
    let result = [...leaves];
    if (filters.status) result = result.filter(l => l.status === filters.status);
    if (filters.employeeId) result = result.filter(l => l.employeeId === Number(filters.employeeId));
    return { data: result, total: result.length };
  },

  async getById(id) {
    await delay();
    return leaves.find(l => l.id === Number(id));
  },

  async create(data) {
    await delay();
    const newLeave = { ...data, id: Math.max(...leaves.map(l => l.id)) + 1, status: 'pending', requestedAt: new Date().toISOString().split('T')[0] };
    leaves.push(newLeave);
    return newLeave;
  },

  async approve(id, approver) {
    await delay();
    const index = leaves.findIndex(l => l.id === Number(id));
    if (index !== -1) { leaves[index] = { ...leaves[index], status: 'approved', approvedBy: approver }; }
    return leaves[index];
  },

  async reject(id) {
    await delay();
    const index = leaves.findIndex(l => l.id === Number(id));
    if (index !== -1) { leaves[index] = { ...leaves[index], status: 'rejected' }; }
    return leaves[index];
  },
};

export default leaveService;
