import client from './client'

export const programsApi = {
  list: () => client.get('/programs/'),
  get: (id) => client.get(`/programs/${id}/`),
  checklist: (id) => client.get(`/programs/${id}/checklist/`),
}
