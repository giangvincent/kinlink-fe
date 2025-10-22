import { defineStore } from 'pinia'
import { ref } from 'vue'

import { listEvents } from '@/api/events'
import { createPerson, deletePerson, getPerson, listPeople, updatePerson } from '@/api/people'
import type { EventItem, Person, Relationship } from '@/api/types'
import dayjs from '@/utils/date'

interface FamilyStats {
  totalMembers: number
  upcomingEvents: Array<{ id: string; title: string; date: string }>
  generations: number
}

export interface MemberPayload {
  id?: string
  name: string
  birthDate: string
  relationship: string
  generation?: number
}

interface GraphRelationship {
  id: string
  source: string
  target: string
  relationship: string
}

// Note: No development fallback/sample data. Rely on API responses and let callers handle errors.

export const useFamilyStore = defineStore('family', () => {
  const loading = ref(false)
  const members = ref<MemberPayload[]>([])
  const relationships = ref<GraphRelationship[]>([])
  const stats = ref<FamilyStats>({
    totalMembers: 0,
    upcomingEvents: [],
    generations: 0
  })

  async function loadFamily() {
    loading.value = true
    try {
      const [peopleResult, eventsResult] = await Promise.all([
        listPeople(),
        listEvents({ from: dayjs().format('YYYY-MM-DD') })
      ])

      let people = peopleResult.data.items
      let relationMap = collectRelationships(people)

      if (!relationMap.size && people.length > 0) {
        const detailed = await Promise.all(
          people.map(async (person) => {
            const { data } = await getPerson(person.id)
            return data
          })
        )
        people = detailed
        relationMap = collectRelationships(people)
      }

      members.value = people.map(mapPersonToMember)
      relationships.value = Array.from(relationMap.values()).map(mapRelationshipToGraph)
      stats.value = buildStats(people, eventsResult.data, peopleResult.data.pagination.total)
    } catch (error) {
      // Surface error to the caller/UI; keep a warning for debugging.
      console.warn('Failed to load family data', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function addMember(payload: MemberPayload) {
    await createPerson(buildPersonPayload(payload))
    await loadFamily()
  }

  async function editMember(id: string, payload: MemberPayload) {
    await updatePerson(id, buildPersonPayload(payload))
    await loadFamily()
  }

  async function removeMember(id: string) {
    await deletePerson(id)
    await loadFamily()
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

function mapPersonToMember(person: Person): MemberPayload {
  return {
    id: String(person.id),
    name: person.display_name || buildDisplayName(person),
    birthDate: person.birth_date ?? '',
    relationship: extractRelationshipLabel(person),
    generation: extractGeneration(person)
  }
}

function buildDisplayName(person: Person) {
  const parts = [person.given_name, person.middle_name, person.surname].filter(Boolean)
  return parts.join(' ') || `Person ${person.id}`
}

function extractRelationshipLabel(person: Person) {
  const meta = person.meta ?? {}
  if (typeof meta.relationship === 'string' && meta.relationship.trim().length > 0) {
    return meta.relationship
  }
  if (typeof meta.role === 'string' && meta.role.trim().length > 0) {
    return meta.role
  }
  return 'Relative'
}

function extractGeneration(person: Person) {
  const meta = person.meta ?? {}
  const generation = meta && typeof meta.generation === 'number' ? meta.generation : null
  return generation ?? undefined
}

function buildPersonPayload(payload: MemberPayload) {
  const { given, surname } = splitName(payload.name)
  const meta: Record<string, unknown> = {}

  if (payload.relationship) {
    meta.relationship = payload.relationship
  }

  if (typeof payload.generation === 'number') {
    meta.generation = payload.generation
  }

  return {
    given_name: given || payload.name,
    surname: surname || payload.name,
    display_name: payload.name,
    birth_date: payload.birthDate || null,
    meta: Object.keys(meta).length > 0 ? meta : null
  }
}

function splitName(name: string): { given: string; surname: string } {
  const parts = name.trim().split(/\s+/).filter(Boolean)

  if (parts.length <= 1) {
    const part = parts[0] ?? ''
    return { given: part, surname: part }
  }

  const surname = parts.pop() as string
  const given = parts.join(' ')

  return { given, surname }
}

function collectRelationships(people: Person[]): Map<number, Relationship> {
  const map = new Map<number, Relationship>()

  people.forEach((person) => {
    person.relationships?.forEach((relationship) => {
      map.set(relationship.id, relationship)
    })
  })

  return map
}

function mapRelationshipToGraph(relationship: Relationship): GraphRelationship {
  return {
    id: String(relationship.id),
    source: String(relationship.person_id_a),
    target: String(relationship.person_id_b),
    relationship: relationship.type
  }
}

function buildStats(
  people: Person[],
  events: EventItem[],
  totalFromPagination?: number
): FamilyStats {
  const totalMembers = typeof totalFromPagination === 'number' ? totalFromPagination : people.length
  const generations = computeGenerations(people, totalMembers)
  const upcomingEvents = events
    .filter((event) => !!event.date_exact)
    .slice(0, 5)
    .map((event) => ({
      id: String(event.id),
      title: event.notes || event.type,
      date: event.date_exact ?? ''
    }))

  return {
    totalMembers,
    upcomingEvents,
    generations
  }
}

function computeGenerations(people: Person[], totalMembers: number) {
  const generations = new Set<number>()

  people.forEach((person) => {
    const generation = extractGeneration(person)
    if (typeof generation === 'number') {
      generations.add(generation)
    }
  })

  if (generations.size > 0) {
    return generations.size
  }

  return totalMembers > 0 ? 1 : 0
}
