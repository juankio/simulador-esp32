<template>
  <g class="wall-node cursor-pointer" :transform="`translate(${x}, ${y})`" 
     @mousedown="$emit('touch', true)" 
     @mouseup="$emit('touch', false)"
     @mouseleave="$emit('touch', false)">
    
    <!-- Aluminum Foil representation -->
    <rect x="0" y="0" width="100" height="100" rx="2" 
          class="transition-all duration-100"
          :class="isTouched ? 'fill-gray-300 stroke-white' : (glitching ? 'fill-gray-500 stroke-neo-red' : 'fill-gray-600 stroke-gray-400')"
          stroke-width="3" />
          
    <text x="50" y="50" text-anchor="middle" class="fill-neo-bg text-[10px] font-mono font-bold">ALUMINUM</text>
    <text x="50" y="65" text-anchor="middle" class="fill-neo-bg text-[8px] font-mono opacity-60">(Click to touch)</text>

    <!-- Noise Indicator -->
    <circle v-if="glitching" cx="10" cy="10" r="4" class="fill-neo-red animate-ping" />

    <!-- Connection Pin -->
    <circle :cx="pin.x" :cy="pin.y" r="4" class="fill-neo-bg stroke-neo-gray" stroke-width="2" />
    <text :x="pin.x + 8" :y="pin.y + 3" class="fill-neo-gray text-[8px] font-mono">OUT</text>
  </g>
</template>

<script setup lang="ts">
defineProps<{
  x: number
  y: number
  pin: any
  isTouched: boolean
  glitching: boolean
}>()

defineEmits(['touch'])
</script>
