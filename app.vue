<template>
  <div class="h-screen w-screen flex flex-col md:flex-row bg-neo-bg font-sans overflow-hidden">
    <UiSimulatorSidebar @toast="showToast" @open-diagrams="diagramsOpen = true" />
    <UiCircuitCanvas :toast="toast" />
    <UiCircuitDiagrams :is-open="diagramsOpen" @close="diagramsOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { useCircuitStore } from '~/stores/circuit'

const store = useCircuitStore()

const toast = ref({ show: false, message: '', type: 'error' })
const diagramsOpen = ref(false)

const showToast = (msg: string, type = 'error') => {
  toast.value = { show: true, message: msg, type }
  setTimeout(() => toast.value.show = false, 4000)
}

onMounted(() => {
  store.updateWires()
})
</script>