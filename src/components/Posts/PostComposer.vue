<template>
  <div class="space-y-3">
    <textarea
      v-model="body"
      placeholder="Share a memory or update with your family..."
      class="w-full resize-none rounded-md border border-slate-200 p-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      rows="4"
    ></textarea>
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <select v-model="visibility" class="rounded-md border p-1 text-sm">
          <option value="family">Family</option>
          <option value="guests">Guests</option>
        </select>
        <label class="inline-flex items-center text-sm text-muted">
          <input v-model="pinned" type="checkbox" class="mr-2" /> Pinned
        </label>
      </div>
      <div class="flex items-center gap-2">
        <BaseButton variant="ghost" @click="clear">Clear</BaseButton>
        <BaseButton :disabled="submitting || !body.trim()" @click="submit">Post</BaseButton>
      </div>
    </div>
    <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/components/Base/BaseButton.vue'
import { createPost } from '@/api/posts'
import { getActiveFamilyId } from '@/api/axios'

const emit = defineEmits<{ (e: 'posted'): void }>()

const body = ref('')
const visibility = ref<'family' | 'guests'>('family')
const pinned = ref(false)
const submitting = ref(false)
const error = ref<string | null>(null)

const clear = () => {
  body.value = ''
  visibility.value = 'family'
  pinned.value = false
  error.value = null
}

const submit = async () => {
  if (!body.value.trim()) return
  // Ensure we have a family context before creating a post
  const familyId = getActiveFamilyId()
  if (!familyId) {
    error.value = 'No family selected — create or join a family first.'
    return
  }
  submitting.value = true
  error.value = null
  try {
    await createPost({ body: body.value.trim(), visibility: visibility.value, pinned: pinned.value })
    clear()
    emit('posted')
  } catch (err: any) {
    console.error('Failed to create post', err)
    error.value = err?.response?.data?.message || 'Failed to create post'
  } finally {
    submitting.value = false
  }
}
</script>
