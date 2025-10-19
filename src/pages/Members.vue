<template>
  <div class="space-y-6">
    <header class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Family members</h1>
        <p class="text-sm text-muted">Search, filter, and invite relatives to collaborate.</p>
      </div>
      <BaseButton @click="invite">Invite member</BaseButton>
    </header>

    <div class="card">
      <div class="grid gap-4 md:grid-cols-4">
        <div class="md:col-span-2">
          <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted" for="search">
            Search
          </label>
          <input
            id="search"
            v-model="search"
            class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
            placeholder="Filter by name"
            type="text"
          />
        </div>
        <div>
          <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted" for="generation">
            Generation
          </label>
          <select
            id="generation"
            v-model="generation"
            class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
          >
            <option value="">All</option>
            <option v-for="level in generationOptions" :key="level" :value="level">Generation {{ level }}</option>
          </select>
        </div>
        <div>
          <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted" for="relationship">
            Relationship
          </label>
          <select
            id="relationship"
            v-model="relationship"
            class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
          >
            <option value="">All</option>
            <option v-for="rel in relationshipOptions" :key="rel" :value="rel">{{ rel }}</option>
          </select>
        </div>
      </div>
    </div>

    <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <table class="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-700">
        <thead class="bg-slate-50 dark:bg-slate-800/50">
          <tr>
            <th class="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Name</th>
            <th class="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Relationship</th>
            <th class="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Generation</th>
            <th class="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Birth date</th>
            <th class="px-6 py-3 text-right font-semibold text-slate-600 dark:text-slate-300">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
          <tr v-for="member in filteredMembers" :key="member.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/50">
            <td class="px-6 py-4">
              <div class="font-semibold text-slate-900 dark:text-slate-100">{{ member.name }}</div>
              <div class="text-xs text-muted">{{ member.email || '—' }}</div>
            </td>
            <td class="px-6 py-4 text-slate-600 dark:text-slate-300">{{ member.relationship }}</td>
            <td class="px-6 py-4 text-slate-600 dark:text-slate-300">{{ member.generation ?? '—' }}</td>
            <td class="px-6 py-4 text-slate-600 dark:text-slate-300">{{ formatDate(member.birthDate) }}</td>
            <td class="px-6 py-4 text-right">
              <div class="flex justify-end gap-2">
                <BaseButton variant="ghost" @click="edit(member.id!)">Edit</BaseButton>
                <BaseButton variant="ghost" @click="remove(member.id!)">Delete</BaseButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { useToast } from 'vue-toastification'

import BaseButton from '@/components/Base/BaseButton.vue'
import dayjs from '@/utils/date'
import { useFamilyStore } from '@/store/familyStore'

const toast = useToast()
const familyStore = useFamilyStore()
const { members } = storeToRefs(familyStore)

const search = ref('')
const generation = ref('')
const relationship = ref('')

const filteredMembers = computed(() => {
  return members.value.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(search.value.toLowerCase())
    const matchesGeneration = !generation.value || member.generation?.toString() === generation.value
    const matchesRelationship = !relationship.value || member.relationship === relationship.value
    return matchesSearch && matchesGeneration && matchesRelationship
  })
})

const generationOptions = computed(() => Array.from(new Set(members.value.map((m) => m.generation).filter(Boolean))))
const relationshipOptions = computed(() => Array.from(new Set(members.value.map((m) => m.relationship).filter(Boolean))))

const formatDate = (date: string) => dayjs(date).format('DD MMM YYYY')

const invite = () => {
  toast.info('Invite flow coming soon')
}

const edit = (id: string) => {
  toast.info(`Edit member ${id}`)
}

const remove = async (id: string) => {
  await familyStore.removeMember(id)
  toast.success('Member removed')
}

onMounted(() => {
  if (!familyStore.members.length) {
    familyStore.loadFamily()
  }
})
</script>
