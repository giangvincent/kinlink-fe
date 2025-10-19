import api from './axios'

export async function fetchMembers(params?: Record<string, string>) {
  const { data } = await api.get('/people', { params })
  return data
}

export async function inviteMember(email: string) {
  const { data } = await api.post('/people/invite', { email })
  return data
}
