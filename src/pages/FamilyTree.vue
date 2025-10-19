<template>
  <div class="grid gap-8 lg:grid-cols-[2fr_1fr]">
    <section class="card">
      <header class="mb-4 flex items-center justify-between">
        <div>
          <h2 class="text-xl font-semibold text-slate-900 dark:text-slate-100">Family graph</h2>
          <p class="text-sm text-muted">
            Drag and zoom to explore connections. Add new members as your tree grows.
          </p>
        </div>
        <BaseButton @click="openModal()">Add member</BaseButton>
      </header>
      <TreeCanvas :elements="elements" />
    </section>

    <aside class="space-y-4">
      <div class="card">
        <h3 class="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">Relatives</h3>
        <div class="space-y-3">
          <MemberCard
            v-for="member in members"
            :key="member.id"
            :member="member"
            @select="selectMember"
          />
        </div>
      </div>
    </aside>
  </div>

  <BaseModal :open="modalOpen" @close="closeModal">
    <template #title>
      {{ editingMember ? 'Edit member' : 'Add member' }}
    </template>
    <form class="space-y-4" @submit.prevent="submitMember">
      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300" for="name">
          Name
        </label>
        <input
          id="name"
          v-model="form.name"
          class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
          required
          type="text"
        />
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300" for="relationship">
          Relationship
        </label>
        <input
          id="relationship"
          v-model="form.relationship"
          class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
          required
          type="text"
        />
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300" for="birthDate">
          Birth date
        </label>
        <input
          id="birthDate"
          v-model="form.birthDate"
          class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
          required
          type="date"
        />
      </div>
      <div class="flex justify-end gap-3 pt-2">
        <BaseButton type="button" variant="ghost" @click="closeModal">Cancel</BaseButton>
        <BaseButton type="submit">Save</BaseButton>
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { ElementsDefinition } from 'cytoscape'
import { storeToRefs } from 'pinia'
import { onMounted, reactive, ref, watch } from 'vue'
import { useToast } from 'vue-toastification'

import BaseButton from '@/components/Base/BaseButton.vue'
import BaseModal from '@/components/Base/BaseModal.vue'
import MemberCard from '@/components/FamilyTree/MemberCard.vue'
import TreeCanvas from '@/components/FamilyTree/TreeCanvas.vue'
import { useFamilyStore } from '@/store/familyStore'

const toast = useToast()
const familyStore = useFamilyStore()
const { members, relationships } = storeToRefs(familyStore)

const modalOpen = ref(false)
const editingMember = ref<string | null>(null)

const form = reactive({
  id: '',
  name: '',
  relationship: '',
  birthDate: ''
})

const elements = ref<ElementsDefinition>({ nodes: [], edges: [] })

watch(
  [members, relationships],
  () => {
    elements.value = {
      nodes: members.value.map((member) => ({ data: { id: member.id, label: member.name } })),
      edges: relationships.value.map((rel) => ({ data: { id: rel.id, source: rel.source, target: rel.target } }))
    }
  },
  { immediate: true, deep: true }
)

const openModal = (memberId?: string) => {
  if (memberId) {
    const member = members.value.find((item) => item.id === memberId)
    if (member) {
      editingMember.value = memberId
      Object.assign(form, member)
    }
  } else {
    Object.assign(form, { id: '', name: '', relationship: '', birthDate: '' })
    editingMember.value = null
  }
  modalOpen.value = true
}

const selectMember = (id: string) => {
  openModal(id)
}

const closeModal = () => {
  modalOpen.value = false
}

const submitMember = async () => {
  try {
    if (editingMember.value) {
      await familyStore.editMember(editingMember.value, form)
      toast.success('Member updated')
    } else {
      await familyStore.addMember(form)
      toast.success('Member added')
    }
    closeModal()
  } catch (error) {
    toast.error('Unable to save member')
  }
}

onMounted(() => {
  familyStore.loadFamily()
})
</script>
