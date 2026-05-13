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

    <g v-for="wire in wires" :key="wire.id">
      <!-- Invisible hitbox path para eventos del ratón -->
      <path :d="getBezierPath(wire)" 
            fill="none" 
            stroke="transparent" 
            stroke-width="15" 
            class="pointer-events-auto cursor-pointer"
            @mouseenter="store.setHoveredNet(wire.net, wire.name, $event)"
            @mousemove="store.updateHoverPos($event)"
            @mouseleave="store.clearHoveredNet()" />

      <!-- Base dim wire -->
      <path :d="getBezierPath(wire)" 
            fill="none" 
            :stroke="wire.color" 
            :stroke-width="store.hoveredNet === wire.net ? 4 : 2"
            class="pointer-events-none transition-all duration-300"
            :class="{ 
              'opacity-100 drop-shadow-[0_0_8px_currentColor]': store.hoveredNet === wire.net,
              'opacity-10': store.hoveredNet && store.hoveredNet !== wire.net,
              'opacity-30': !store.hoveredNet
            }" />
            
      <!-- Active animated wire overlay -->
      <path :d="getBezierPath(wire)" 
            fill="none" 
            :stroke="wire.color" 
            stroke-width="3" 
            filter="url(#neon-glow)"
            class="wire-pulse opacity-0 pointer-events-none"
            :class="{ 'opacity-100': isSimulating }"
            stroke-dasharray="10 10" />
    </g>
  </svg>
</template>

<script setup lang="ts">
import { watch, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useCircuitStore } from '~/stores/circuit'
import { useRouting } from '~/composables/useRouting'
import anime from 'animejs'

const store = useCircuitStore()
const { wires, isSimulating } = storeToRefs(store)
const { getBezierPath } = useRouting()

let animation: any = null

const startWireAnimation = () => {
  if (animation) animation.pause()
  animation = anime({
    targets: '.wire-pulse',
    strokeDashoffset: [20, 0], // Trick mágico: forzar offset en un rango fijo independientemente de la longitud real
    easing: 'linear',
    duration: 500,
    loop: true
  })
}

// Escuchar inicio/fin de simulación
watch(isSimulating, (active) => {
  if (active) {
    startWireAnimation()
  } else {
    if (animation) animation.pause()
  }
})

// Arrancar por si carga en caliente
onMounted(() => {
  if (isSimulating.value) {
    startWireAnimation()
  }
})

onBeforeUnmount(() => {
  if (animation) animation.pause()
})
</script>
