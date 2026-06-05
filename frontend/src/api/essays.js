import client from './client'

export const essaysApi = {
  analyze: (applicationId, essayText) =>
    client.post('/ai/analyze-essay/', {
      application_id: applicationId,
      essay_text: essayText,
    }),
  score: (applicationId) =>
    client.post('/ai/score-application/', { application_id: applicationId }),
  myEssays: () => client.get('/ai/my-essays/'),
}
