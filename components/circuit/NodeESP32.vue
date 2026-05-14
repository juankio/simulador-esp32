<template>
  <g class="esp32-node" :transform="`translate(${x}, ${y})`">
    <!-- Board Base -->
    <rect x="0" y="0" width="120" height="290" rx="6" 
          class="fill-neo-bg stroke-neo-blue transition-colors duration-300"
          :class="isActive ? 'stroke-neo-blue shadow-[0_0_15px_#38bdf8]' : 'stroke-neo-gray'"
          stroke-width="2" />
          
    <!-- Chip details -->
    <rect x="20" y="10" width="80" height="80" rx="4" class="fill-[#141d2f] stroke-neo-gray" stroke-width="1.5" />
    <text x="60" y="55" text-anchor="middle" class="fill-neo-blue text-[10px] font-mono tracking-widest uppercase">ESP-WROOM-32</text>
    
    <!-- WiFi Antenna pattern -->
    <path d="M 40 20 L 80 20 M 40 25 L 80 25" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="2 2" />

    <!-- Pins -->
    <g v-for="pin in pins" :key="pin.id" :transform="`translate(${pin.x}, ${pin.y})`">
      <circle cx="0" cy="0" r="3" 
              class="transition-all duration-300"
              :class="pin.state === 1 ? 'fill-neo-purple stroke-neo-purple drop-shadow-[0_0_5px_#a855f7]' : 'fill-[#0b1121] stroke-neo-gray'"
              stroke-width="1.5" />
      <text :x="pin.x < 60 ? 12 : -12" :y="3" 
            :text-anchor="pin.x < 60 ? 'start' : 'end'"
            class="fill-neo-gray text-[8px] font-mono select-none font-bold">
        {{ pin.label }}
      </text>
    </g>
  </g>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCircuitStore } from '~/stores/circuit'

const props = defineProps<{
  x: number
  y: number
  pins: any[]
}>()

const store = useCircuitStore()
const isActive = computed(() => store.isSimulating)
</script>
