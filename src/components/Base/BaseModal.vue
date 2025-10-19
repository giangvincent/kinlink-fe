<template>
  <Transition name="fade">
    <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-slate-900/70" @click="emit('close')" />
      <div class="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
        <header class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">
            <slot name="title" />
          </h3>
          <button
            class="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            @click="emit('close')"
          >
            <span class="sr-only">Close</span>
            ✕
          </button>
        </header>
        <div class="space-y-4">
          <slot />
        </div>
        <footer v-if="$slots.footer" class="mt-6 flex justify-end gap-3">
          <slot name="footer" />
        </footer>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{ (e: 'close'): void }>()

const open = computed(() => props.open)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.98);
}
</style>
