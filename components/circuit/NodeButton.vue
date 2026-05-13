<template>
  <g class="btn-node cursor-pointer" :transform="`translate(${x}, ${y})`"
     @mousedown="$emit('press', true)"
     @mouseup="$emit('press', false)"
     @mouseleave="$emit('press', false)">
    
    <!-- Base -->
    <rect x="0" y="0" width="40" height="40" rx="4" class="fill-[#0b1121] stroke-neo-gray" stroke-width="2" />
    
    <!-- Tactile Button -->
    <circle cx="20" cy="20" r="12" 
            class="transition-all duration-100"
            :class="isPressed ? 'fill-neo-blue stroke-[#38bdf8] drop-shadow-[0_0_10px_#38bdf8] scale-95' : 'fill-neo-bg stroke-neo-gray scale-100'" 
            stroke-width="2" />
            
    <!-- Pins -->
    <circle :cx="p1.x" :cy="p1.y" r="4" class="fill-neo-bg stroke-neo-gray" stroke-width="2" />
    <circle :cx="p2.x" :cy="p2.y" r="4" class="fill-neo-bg stroke-neo-gray" stroke-width="2" />
    
    <!-- Label -->
    <text x="20" y="55" text-anchor="middle" class="fill-neo-gray text-[8px] font-mono font-bold">{{ label }}</text>
  </g>
</template>

<script setup lang="ts">
defineProps<{
  x: number
  y: number
  p1: any
  p2: any
  isPressed: boolean
  label: string
}>()

defineEmits(['press'])
</script>
