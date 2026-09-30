const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

const currentUser = {
  id: 1,
  firstName: 'Aziz',
  lastName: 'Benali',
  email: 'aziz.benali@rhtech.io',
  role: 'admin',
  position: 'Lead Frontend Developer',
  department: 'Frontend',
  avatar: null,
};

const authService = {
  async login(email, password) {
    await delay(500);
    if (email && password) {
      localStorage.setItem('auth_token', 'mock_jwt_token');
      localStorage.setItem('user', JSON.stringify(currentUser));
      return { user: currentUser, token: 'mock_jwt_token' };
    }
    throw new Error('Identifiants invalides');
  },

  async logout() {
    await delay();
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    return { success: true };
  },

  async getCurrentUser() {
    await delay();
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  async forgotPassword(email) {
    await delay(500);
    if (email) return { success: true, message: 'Un email de réinitialisation a été envoyé.' };
    throw new Error('Email requis');
  },

  async resetPassword(token, password) {
    await delay(500);
    if (token && password) return { success: true };
    throw new Error('Token invalide');
  },

  isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  },
};

export default authService;
