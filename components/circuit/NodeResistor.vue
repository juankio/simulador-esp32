<template>
  <g class="resistor-node" :transform="`translate(${x}, ${y})`">
    <!-- Invisible Hitbox for easy dragging -->
    <rect :x="p1.x - 10" :y="p1.y - 15" :width="Math.abs(p2.x - p1.x) + 20" height="30" fill="transparent" class="cursor-move" />

    <!-- Pin 1 -->
    <circle :cx="p1.x" :cy="p1.y" r="4" class="fill-neo-bg stroke-neo-gray" stroke-width="2" />
    
    <!-- ZigZag Line (Resistor Symbol) -->
    <path :d="`M ${p1.x + 4} ${p1.y} L ${p1.x + 10} ${p1.y - 8} L ${p1.x + 20} ${p1.y + 8} L ${p1.x + 30} ${p1.y - 8} L ${p1.x + 40} ${p1.y + 8} L ${p1.x + 50} ${p1.y - 8} L ${p2.x - 4} ${p1.y}`" 
          fill="none" class="stroke-neo-blue" stroke-width="2" stroke-linejoin="round" />
          
    <!-- Pin 2 -->
    <circle :cx="p2.x" :cy="p2.y" r="4" class="fill-neo-bg stroke-neo-gray" stroke-width="2" />
    
    <!-- Value -->
    <text :x="(p1.x + p2.x)/2" :y="p1.y + 20" text-anchor="middle" class="fill-neo-blue text-[8px] font-mono">10kΩ</text>
  </g>
</template>

<script setup lang="ts">
defineProps<{
  x: number
  y: number
  p1: any
  p2: any
}>()
</script>
