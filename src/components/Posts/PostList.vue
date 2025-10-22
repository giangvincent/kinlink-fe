<template>
  <div class="space-y-4">
    <PostComposer @posted="refresh" />

    <div v-if="loading" class="text-sm text-muted">Loading posts...</div>

    <div v-if="posts.length === 0 && !loading" class="text-sm text-muted">No posts yet.</div>

    <div class="space-y-4">
      <article v-for="post in posts" :key="post.id" class="p-4 border rounded-lg">
        <div class="flex items-start gap-3">
          <div class="flex-shrink-0 w-10 h-10 rounded-full bg-slate-200"></div>
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <div>
                <div class="font-semibold">{{ post.author?.name || 'Someone' }}</div>
                <div class="text-xs text-muted">{{ formatDate(post.created_at) }}</div>
              </div>
              <div class="text-sm text-muted">{{ post.visibility }}</div>
            </div>
            <p class="mt-2 text-sm text-slate-800 dark:text-slate-200">{{ post.body }}</p>
          </div>
        </div>
      </article>
    </div>

    <div class="flex justify-center">
      <BaseButton v-if="hasMore && !loading" @click="loadMore">Load more</BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PostComposer from './PostComposer.vue'
import BaseButton from '@/components/Base/BaseButton.vue'
import { listPosts } from '@/api/posts'
import type { PostItem } from '@/api/types'

const posts = ref<PostItem[]>([])
const loading = ref(false)
const cursor = ref<string | null>(null)
const hasMore = ref(true)

const formatDate = (d?: string | null) => (d ? new Date(d).toLocaleString() : '')

const load = async (refresh = false) => {
  if (loading.value) return
  loading.value = true
  try {
    const params = refresh ? {} : { cursor: cursor.value }
    const res = await listPosts(params)
    const items = res.data.items || []
    if (refresh) {
      posts.value = items
    } else {
      posts.value = posts.value.concat(items)
    }
    cursor.value = res.meta?.next_cursor ?? null
    hasMore.value = Boolean(cursor.value)
  } finally {
    loading.value = false
  }
}

const refresh = () => load(true)
const loadMore = () => load(false)

onMounted(() => {
  load(true)
})
</script>
