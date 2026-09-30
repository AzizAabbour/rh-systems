import employeesData from '../data/employees';

const USE_API = false;

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

let employees = [...employeesData];

const employeeService = {
  async getAll(filters = {}) {
    if (USE_API) {
      const { apiClient } = await import('./apiClient');
      return apiClient.get('/employees', filters);
    }
    await delay();
    let result = [...employees];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(e =>
        `${e.firstName} ${e.lastName}`.toLowerCase().includes(q) ||
        e.position.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q)
      );
    }
    if (filters.department) {
      result = result.filter(e => e.department === filters.department);
    }
    if (filters.status) {
      result = result.filter(e => e.status === filters.status);
    }
    return { data: result, total: result.length };
  },

  async getById(id) {
    if (USE_API) {
      const { apiClient } = await import('./apiClient');
      return apiClient.get(`/employees/${id}`);
    }
    await delay();
    const employee = employees.find(e => e.id === Number(id));
    if (!employee) throw new Error('Employé non trouvé');
    return employee;
  },

  async create(data) {
    if (USE_API) {
      const { apiClient } = await import('./apiClient');
      return apiClient.post('/employees', data);
    }
    await delay();
    const newEmployee = {
      ...data,
      id: Math.max(...employees.map(e => e.id)) + 1,
      status: 'active',
      availability: 'available',
      leaveBalance: { annual: 22, sick: 10, used: 0 },
      skills: data.skills || [],
    };
    employees.push(newEmployee);
    return newEmployee;
  },

  async update(id, data) {
    if (USE_API) {
      const { apiClient } = await import('./apiClient');
      return apiClient.put(`/employees/${id}`, data);
    }
    await delay();
    const index = employees.findIndex(e => e.id === Number(id));
    if (index === -1) throw new Error('Employé non trouvé');
    employees[index] = { ...employees[index], ...data };
    return employees[index];
  },

  async delete(id) {
    if (USE_API) {
      const { apiClient } = await import('./apiClient');
      return apiClient.delete(`/employees/${id}`);
    }
    await delay();
    employees = employees.filter(e => e.id !== Number(id));
    return { success: true };
  },
};

export default employeeService;
