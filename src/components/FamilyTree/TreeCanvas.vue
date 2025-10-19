<template>
  <div ref="container" class="h-[540px] w-full rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900" />
</template>

<script setup lang="ts">
import cytoscape, { type ElementsDefinition } from 'cytoscape'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps<{
  elements: ElementsDefinition
}>()

const container = ref<HTMLDivElement | null>(null)
let instance: cytoscape.Core | undefined

const init = () => {
  if (!container.value) return

  instance = cytoscape({
    container: container.value,
    elements: props.elements,
    style: [
      {
        selector: 'node',
        style: {
          'background-color': '#2563eb',
          label: 'data(label)',
          color: '#fff',
          'text-outline-width': 2,
          'text-outline-color': '#2563eb',
          'font-size': 12
        }
      },
      {
        selector: 'edge',
        style: {
          width: 2,
          'target-arrow-shape': 'triangle',
          'line-color': '#94a3b8',
          'target-arrow-color': '#94a3b8'
        }
      }
    ],
    layout: {
      name: 'breadthfirst',
      directed: true,
      padding: 10,
      spacingFactor: 1.3
    }
  })

  instance.on('tap', 'node', (evt) => {
    console.info('Selected member', evt.target.data())
  })
}

const destroy = () => {
  if (instance) {
    instance.destroy()
    instance = undefined
  }
}

onMounted(() => {
  init()
})

onBeforeUnmount(() => {
  destroy()
})

watch(
  () => props.elements,
  (next) => {
    if (!instance) {
      init()
      return
    }

    instance.json({ elements: next })
    instance.layout({ name: 'breadthfirst', directed: true }).run()
  },
  { deep: true }
)
</script>
