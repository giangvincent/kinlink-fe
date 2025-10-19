<template>
  <div :id="galleryId" class="grid gap-3 sm:grid-cols-2">
    <a
      v-for="item in items"
      :key="item.src"
      :data-pswp-width="item.width"
      :data-pswp-height="item.height"
      :href="item.src"
      class="group relative overflow-hidden rounded-xl"
    >
      <img :alt="item.title" :src="item.thumbnail || item.src" class="h-48 w-full object-cover" />
      <div class="absolute inset-0 bg-slate-900/40 opacity-0 transition group-hover:opacity-100" />
      <p class="absolute bottom-3 left-3 text-sm font-medium text-white" v-if="item.title">
        {{ item.title }}
      </p>
    </a>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import 'photoswipe/style.css'

interface GalleryItem {
  src: string
  width: number
  height: number
  title?: string
  thumbnail?: string
}

const props = defineProps<{ items: GalleryItem[] }>()

let lightbox: PhotoSwipeLightbox | null = null
const galleryId = `pswp-${Math.random().toString(36).slice(2)}`

onMounted(() => {
  lightbox = new PhotoSwipeLightbox({
    gallery: `#${galleryId}`,
    children: 'a',
    pswpModule: () => import('photoswipe')
  })
  lightbox.init()
})

onBeforeUnmount(() => {
  lightbox?.destroy()
  lightbox = null
})
</script>
