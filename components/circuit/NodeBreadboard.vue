<template>
  <g class="breadboard-node" :transform="`translate(${x}, ${y})`">
    <!-- Base -->
    <rect x="0" y="0" width="160" height="320" rx="8" class="fill-[#141d2f] stroke-[#1e293b]" stroke-width="2" />
    
    <!-- Power Rails Lines -->
    <rect x="10" y="10" width="20" height="300" rx="4" class="fill-[#0b1121] stroke-neo-red/30" />
    <rect x="35" y="10" width="20" height="300" rx="4" class="fill-[#0b1121] stroke-neo-blue/30" />
    
    <text x="20" y="8" text-anchor="middle" class="fill-neo-red text-[8px] font-bold">+</text>
    <text x="45" y="8" text-anchor="middle" class="fill-neo-blue text-[8px] font-bold">-</text>

    <!-- Nodes visual points -->
    <g v-for="i in 15" :key="i">
       <!-- Power Holes -->
       <circle :cx="20" :cy="10 + i*19" r="2.5" class="fill-neo-bg stroke-[#334155]" />
       <circle :cx="45" :cy="10 + i*19" r="2.5" class="fill-neo-bg stroke-[#334155]" />
       
       <!-- Row Holes (Simulated terminal strips) -->
       <rect :x="65" :y="10 + i*19 - 4" width="30" height="8" rx="2" class="fill-neo-bg stroke-[#334155]" />
       <circle :cx="70" :cy="10 + i*19" r="1.5" class="fill-[#334155]" />
       <circle :cx="80" :cy="10 + i*19" r="1.5" class="fill-[#334155]" />
       <circle :cx="90" :cy="10 + i*19" r="1.5" class="fill-[#334155]" />

       <rect :x="105" :y="10 + i*19 - 4" width="30" height="8" rx="2" class="fill-neo-bg stroke-[#334155]" />
       <circle :cx="110" :cy="10 + i*19" r="1.5" class="fill-[#334155]" />
       <circle :cx="120" :cy="10 + i*19" r="1.5" class="fill-[#334155]" />
       <circle :cx="130" :cy="10 + i*19" r="1.5" class="fill-[#334155]" />
       
       <!-- Row Labels -->
       <text :x="148" :y="10 + i*19 + 3" class="fill-neo-gray text-[8px] font-mono opacity-50">{{ i }}</text>
    </g>
    <text x="80" y="315" text-anchor="middle" class="fill-neo-gray text-[10px] font-mono font-bold tracking-widest opacity-30">BREADBOARD</text>
  </g>
</template>

<script setup lang="ts">
defineProps<{
  x: number
  y: number
}>()
</script>
