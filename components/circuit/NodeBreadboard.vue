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
       <!-- Power Lines (Internal Connections) -->
       <line v-if="i > 1" :x1="20" :y1="10 + (i-1)*19" :x2="20" :y2="10 + i*19" class="stroke-neo-red opacity-30" stroke-width="2" />
       <line v-if="i > 1" :x1="45" :y1="10 + (i-1)*19" :x2="45" :y2="10 + i*19" class="stroke-neo-blue opacity-30" stroke-width="2" />

       <!-- Power Holes -->
       <circle :cx="20" :cy="10 + i*19" r="3" class="fill-[#0b1121] stroke-neo-red opacity-80" />
       <circle :cx="45" :cy="10 + i*19" r="3" class="fill-[#0b1121] stroke-neo-blue opacity-80" />
       
       <!-- Row Holes (Simulated terminal strips) -->
       <!-- Left Side connection line -->
       <rect :x="65" :y="10 + i*19 - 5" width="30" height="10" rx="5" class="fill-[#0b1121] stroke-[#334155]" />
       <line :x1="70" :y1="10 + i*19" :x2="90" :y2="10 + i*19" class="stroke-[#475569]" stroke-width="3" stroke-linecap="round" />
       
       <!-- Holes -->
       <circle :cx="70" :cy="10 + i*19" r="2.5" class="fill-[#0b1121]" />
       <circle :cx="80" :cy="10 + i*19" r="2.5" class="fill-[#0b1121]" />
       <circle :cx="90" :cy="10 + i*19" r="2.5" class="fill-[#0b1121]" />

       <!-- Right Side connection line -->
       <rect :x="105" :y="10 + i*19 - 5" width="30" height="10" rx="5" class="fill-[#0b1121] stroke-[#334155]" />
       <line :x1="110" :y1="10 + i*19" :x2="130" :y2="10 + i*19" class="stroke-[#475569]" stroke-width="3" stroke-linecap="round" />

       <!-- Holes -->
       <circle :cx="110" :cy="10 + i*19" r="2.5" class="fill-[#0b1121]" />
       <circle :cx="120" :cy="10 + i*19" r="2.5" class="fill-[#0b1121]" />
       <circle :cx="130" :cy="10 + i*19" r="2.5" class="fill-[#0b1121]" />
       
       <!-- Row Labels -->
       <text :x="148" :y="10 + i*19 + 3" class="fill-neo-gray text-[9px] font-mono opacity-80 font-bold">{{ i }}</text>
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
