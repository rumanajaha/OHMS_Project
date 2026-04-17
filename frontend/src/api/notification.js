import { apiClient } from './client';

const PREFIX = '/notifications';

export const getNotificationsApi = () => apiClient(PREFIX);

export const markNotificationAsReadApi = (notificationId) =>
  apiClient(`${PREFIX}/${notificationId}/read`, {
    method: 'PUT',
  });
