<template>
  <g class="wire-layer" style="z-index: 10;">
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

    <g v-for="wire in wirePaths" :key="wire.id">
      <!-- Invisible hitbox path para eventos del ratón -->
      <path :d="wire.path" 
            fill="none" 
            stroke="transparent" 
            stroke-width="15" 
            class="pointer-events-auto cursor-pointer"
            @mouseenter="store.setHoveredNet(wire.net, wire.name, $event)"
            @mousemove="store.updateHoverPos($event)"
            @mouseleave="store.clearHoveredNet()" />

      <!-- Base dim wire -->
      <path :d="wire.path" 
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
      <path :d="wire.path" 
            fill="none" 
            :stroke="wire.color" 
            stroke-width="3" 
            filter="url(#neon-glow)"
            class="wire-pulse opacity-0 pointer-events-none"
            :class="{ 'opacity-100': isSimulating }"
            stroke-dasharray="10 10" />

      <!-- Conectores visuales profundos (Plugs metidos en los huecos) -->
      <g class="pointer-events-none">
        <!-- Pin Base / Sombra para dar profundidad -->
        <circle :cx="wire.p1.x" :cy="wire.p1.y" r="2.5" fill="#000000" class="opacity-80"/>
        <circle :cx="wire.p2.x" :cy="wire.p2.y" r="2.5" fill="#000000" class="opacity-80"/>
        
        <!-- Plástico del pin (del color del cable, levemente más arriba visualmente para dar 3D) -->
        <circle :cx="wire.p1.x" :cy="wire.p1.y - 1" r="2.5" :fill="wire.color" />
        <circle :cx="wire.p2.x" :cy="wire.p2.y - 1" r="2.5" :fill="wire.color" />
        
        <!-- Brillo / Punta de metal -->
        <circle :cx="wire.p1.x" :cy="wire.p1.y - 1" r="1" fill="#ffffff" class="opacity-90"/>
        <circle :cx="wire.p2.x" :cy="wire.p2.y - 1" r="1" fill="#ffffff" class="opacity-90"/>
      </g>
    </g>
  </g>
</template>

<script setup lang="ts">
import { watch, onMounted, onBeforeUnmount, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useCircuitStore } from '~/stores/circuit'
import { useRouting } from '~/composables/useRouting'
import anime from 'animejs'

const store = useCircuitStore()
const { wires, isSimulating } = storeToRefs(store)
const { getBezierPath, getPinGlobalCoords } = useRouting()

// OPTIMIZACIÓN EXTREMA: Pre-calculamos las rutas 1 sola vez por render cycle.
// Antes Vue llamaba a getBezierPath() 3 veces POR CABLE = ~90 llamadas lentas por cada pixel que movías.
// Ahora hace 1 llamada por cable y se guarda. Fluidez garantizada a 60FPS.
const wirePaths = computed(() => {
  return wires.value.map(wire => {
    const p1 = getPinGlobalCoords(wire.fromNode)
    const p2 = getPinGlobalCoords(wire.toNode)
    return {
      ...wire,
      p1,
      p2,
      path: getBezierPath(wire)
    }
  })
})

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
