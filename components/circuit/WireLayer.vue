<template>
  <svg class="absolute inset-0 w-full h-full pointer-events-none" style="z-index: 10;">
    <defs>
      <!-- Neon Glow Filter -->
      <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <CircuitWire v-for="wire in wires" :key="wire.id" :wire="wire" />
  </svg>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCircuitStore } from '~/stores/circuit'

const store = useCircuitStore()
const { wires } = storeToRefs(store)
</script>
