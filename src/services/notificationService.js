import { notifications as notifData } from '../data/mockData';

const delay = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms));
let notifications = [...notifData];

const notificationService = {
  async getAll() {
    await delay();
    return { data: notifications, unreadCount: notifications.filter(n => !n.read).length };
  },

  async markAsRead(id) {
    await delay();
    const index = notifications.findIndex(n => n.id === Number(id));
    if (index !== -1) notifications[index].read = true;
    return notifications[index];
  },

  async markAllAsRead() {
    await delay();
    notifications = notifications.map(n => ({ ...n, read: true }));
    return { success: true };
  },
};

export default notificationService;
