<template>
  <div class="h-screen w-screen flex bg-neo-bg font-sans overflow-hidden">
    <SimulatorSidebar @toast="showToast" />
    <CircuitCanvas :toast="toast" />
  </div>
</template>

<script setup lang="ts">
import { useCircuitStore } from '~/stores/circuit'

const store = useCircuitStore()

const toast = ref({ show: false, message: '', type: 'error' })
const showToast = (msg: string, type = 'error') => {
  toast.value = { show: true, message: msg, type }
  setTimeout(() => toast.value.show = false, 4000)
}

onMounted(() => {
  store.updateWires()
})
</script>