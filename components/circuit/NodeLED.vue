<template>
  <g class="led-node" :transform="`translate(${x}, ${y})`">
    <!-- Anode -->
    <circle :cx="anode.x" :cy="anode.y" r="4" class="fill-neo-bg stroke-neo-gray" stroke-width="2" />
    <text :x="anode.x - 12" :y="anode.y + 3" class="fill-neo-gray text-[8px] font-mono">A</text>
    
    <!-- Cathode -->
    <circle :cx="cathode.x" :cy="cathode.y" r="4" class="fill-neo-bg stroke-neo-gray" stroke-width="2" />
    <text :x="cathode.x + 12" :y="cathode.y + 3" class="fill-neo-gray text-[8px] font-mono">C</text>

    <!-- Diode Symbol (Triangle and Line) -->
    <g :class="colorClass" class="transition-all duration-300">
      <path :d="`M ${anode.x + 8} ${anode.y} L ${cathode.x - 8} ${cathode.y - 10} L ${cathode.x - 8} ${cathode.y + 10} Z`" 
            fill="none" stroke-width="2" />
      <line :x1="cathode.x - 8" :y1="cathode.y - 12" :x2="cathode.x - 8" :y2="cathode.y + 12" stroke-width="2" />
    </g>
  </g>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  x: number
  y: number
  anode: any
  cathode: any
  isOn: boolean
  color?: 'red' | 'green' | 'purple'
}>()

const colorClass = computed(() => {
  if (!props.isOn) return 'stroke-neo-gray'
  
  if (props.color === 'green') return 'stroke-[#4ade80] drop-shadow-[0_0_10px_#4ade80]'
  if (props.color === 'purple') return 'stroke-neo-purple drop-shadow-[0_0_10px_#a855f7]'
  
  return 'stroke-neo-red drop-shadow-[0_0_10px_#ef4444]' // Red is default
})
</script>
