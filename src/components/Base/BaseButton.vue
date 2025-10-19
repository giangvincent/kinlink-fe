<template>
  <button
    :type="type"
    :class="buttonClasses"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost'
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    variant: 'primary',
    type: 'button'
  }
)

const buttonClasses = computed(() => {
  switch (props.variant) {
    case 'secondary':
      return 'inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700 shadow-sm hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
    case 'ghost':
      return 'inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 dark:text-slate-300 dark:hover:bg-slate-800'
    default:
      return 'btn-primary'
  }
})
</script>
