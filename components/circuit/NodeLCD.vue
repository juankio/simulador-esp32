<template>
  <g class="lcd-node" :transform="`translate(${x}, ${y})`">
    <!-- LCD Base PCB -->
    <rect x="0" y="0" width="160" height="60" rx="4" class="fill-neo-bg stroke-neo-gray" stroke-width="2" />
    
    <!-- LCD Screen Area -->
    <rect x="10" y="10" width="140" height="40" rx="2" 
          class="transition-colors duration-500"
          :class="screenClass" />

    <!-- Screen Text -->
    <text v-if="backlightOn && !errorLowVoltage" 
          x="80" y="35" 
          text-anchor="middle" 
          class="font-mono text-[12px] fill-neo-bg font-bold tracking-widest drop-shadow-sm">
      {{ text }}
    </text>

    <!-- Error Indicator (Low Voltage 3V3) -->
    <text v-if="errorLowVoltage" 
          x="80" y="35" 
          text-anchor="middle" 
          class="font-mono text-[8px] fill-white/20 font-bold tracking-widest">
      [NO DATA - VOLTAGE TOO LOW]
    </text>

    <!-- I2C Backpack Pins -->
    <g v-for="pin in pins" :key="pin.id" :transform="`translate(${pin.x}, -8)`">
      <circle cx="0" cy="0" r="4" class="fill-neo-bg stroke-neo-gray" stroke-width="2" />
      <text x="0" y="-12" text-anchor="middle" class="fill-neo-gray text-[8px] font-mono font-bold">{{ pin.label }}</text>
    </g>
  </g>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  x: number
  y: number
  pins: any[]
  backlightOn: boolean
  errorLowVoltage: boolean
  text: string
}>()

const screenClass = computed(() => {
  if (!props.backlightOn) return 'fill-[#1a2e1a] stroke-[#2d4a2d] stroke-[2]' // Off
  if (props.errorLowVoltage) return 'fill-[#2d4a2d] stroke-[#4ade80] stroke-[1] opacity-50' // Dimmed (3.3V Error)
  return 'fill-[#4ade80] stroke-[#22c55e] stroke-[2] drop-shadow-[0_0_15px_rgba(74,222,128,0.4)]' // On (5V OK)
})
</script>
