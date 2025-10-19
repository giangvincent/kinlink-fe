import { defineStore } from 'pinia'
import { ref } from 'vue'

import { createMember, deleteMember, fetchFamilySummary, fetchFamilyTree, updateMember, type MemberPayload } from '@/api/family'

interface FamilyStats {
  totalMembers: number
  upcomingEvents: Array<{ id: string; title: string; date: string }>
  generations: number
}

export const useFamilyStore = defineStore('family', () => {
  const loading = ref(false)
  const members = ref<MemberPayload[]>([])
  const relationships = ref<Array<{ id: string; source: string; target: string; relationship: string }>>([
    { id: 'rel-1', source: '1', target: '2', relationship: 'spouse' },
    { id: 'rel-2', source: '1', target: '3', relationship: 'parent' },
    { id: 'rel-3', source: '2', target: '3', relationship: 'parent' }
  ])
  const stats = ref<FamilyStats>({
    totalMembers: 12,
    upcomingEvents: [
      { id: 'evt-1', title: 'Grandma Hoa birthday', date: '2024-04-18' },
      { id: 'evt-2', title: 'Family reunion', date: '2024-05-05' }
    ],
    generations: 4
  })

  async function loadFamily() {
    loading.value = true
    try {
      const [treeData, summary] = await Promise.all([
        fetchFamilyTree(),
        fetchFamilySummary()
      ])
      members.value = treeData.members
      relationships.value = treeData.relationships
      stats.value = summary
    } catch (error) {
      console.warn('Falling back to sample data', error)
      members.value = [
        { id: '1', name: 'Nguyen Van A', birthDate: '1950-03-12', relationship: 'Patriarch', generation: 1 },
        { id: '2', name: 'Tran Thi B', birthDate: '1952-07-01', relationship: 'Matriarch', generation: 1 },
        { id: '3', name: 'Nguyen Van C', birthDate: '1975-02-10', relationship: 'Son', generation: 2 },
        { id: '4', name: 'Nguyen Thi D', birthDate: '1978-11-24', relationship: 'Daughter-in-law', generation: 2 }
      ]
      relationships.value = [
        { id: 'rel-1', source: '1', target: '2', relationship: 'spouse' },
        { id: 'rel-2', source: '1', target: '3', relationship: 'parent' },
        { id: 'rel-3', source: '2', target: '3', relationship: 'parent' },
        { id: 'rel-4', source: '3', target: '4', relationship: 'spouse' }
      ]
    } finally {
      loading.value = false
    }
  }

  async function addMember(payload: MemberPayload) {
    try {
      const { member } = await createMember(payload)
      members.value.push(member)
    } catch (error) {
      const fallbackMember = { ...payload, id: crypto.randomUUID() }
      members.value.push(fallbackMember)
      console.warn('addMember offline fallback', error)
    }
  }

  async function editMember(id: string, payload: MemberPayload) {
    try {
      const { member } = await updateMember(id, payload)
      const index = members.value.findIndex((item) => item.id === id)
      if (index !== -1) {
        members.value[index] = member
      }
    } catch (error) {
      const index = members.value.findIndex((item) => item.id === id)
      if (index !== -1) {
        members.value[index] = { ...members.value[index], ...payload, id }
      }
      console.warn('editMember offline fallback', error)
    }
  }

  async function removeMember(id: string) {
    try {
      await deleteMember(id)
    } catch (error) {
      console.warn('removeMember offline fallback', error)
    }
    members.value = members.value.filter((item) => item.id !== id)
    relationships.value = relationships.value.filter((item) => item.source !== id && item.target !== id)
  }

  return {
    loading,
    members,
    relationships,
    stats,
    loadFamily,
    addMember,
    editMember,
    removeMember
  }
})
