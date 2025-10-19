import api from './axios'

export interface MemberPayload {
  id?: string
  name: string
  birthDate: string
  relationship: string
  generation?: number
}

export async function fetchFamilySummary() {
  const { data } = await api.get('/family/summary')
  return data
}

export async function fetchFamilyTree() {
  const { data } = await api.get('/family/tree')
  return data
}

export async function createMember(payload: MemberPayload) {
  const { data } = await api.post('/family/members', payload)
  return data
}

export async function updateMember(id: string, payload: MemberPayload) {
  const { data } = await api.put(`/family/members/${id}`, payload)
  return data
}

export async function deleteMember(id: string) {
  await api.delete(`/family/members/${id}`)
}
