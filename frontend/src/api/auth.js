import client from './client'

export const authApi = {
  register: (data) => client.post('/auth/register/', data),
  login: (data) => client.post('/auth/login/', data),
  refresh: (refresh) => client.post('/auth/token/refresh/', { refresh }),
  me: () => client.get('/auth/me/'),
  updateMe: (data) => client.patch('/auth/me/', data),
  upgradePlan: () => client.post('/auth/upgrade/'),
  buyCredits: (amount) => client.post('/auth/buy-credits/', { amount }),
}
