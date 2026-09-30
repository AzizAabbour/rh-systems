import tasksData from '../data/tasks';

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));
let tasks = [...tasksData];

const taskService = {
  async getAll(filters = {}) {
    await delay();
    let result = [...tasks];
    if (filters.status) result = result.filter(t => t.status === filters.status);
    if (filters.assigneeId) result = result.filter(t => t.assigneeId === Number(filters.assigneeId));
    if (filters.project) result = result.filter(t => t.project === filters.project);
    if (filters.priority) result = result.filter(t => t.priority === filters.priority);
    return { data: result, total: result.length };
  },

  async create(data) {
    await delay();
    const newTask = { ...data, id: Math.max(...tasks.map(t => t.id)) + 1, createdAt: new Date().toISOString().split('T')[0] };
    tasks.push(newTask);
    return newTask;
  },

  async update(id, data) {
    await delay();
    const index = tasks.findIndex(t => t.id === Number(id));
    if (index !== -1) tasks[index] = { ...tasks[index], ...data };
    return tasks[index];
  },

  async updateStatus(id, status) {
    return this.update(id, { status });
  },

  async delete(id) {
    await delay();
    tasks = tasks.filter(t => t.id !== Number(id));
    return { success: true };
  },
};

export default taskService;
