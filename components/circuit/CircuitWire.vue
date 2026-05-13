<template>
  <g>
    <!-- Invisible hitbox path para eventos del ratón -->
    <path :d="pathData" 
          fill="none" 
          stroke="transparent" 
          stroke-width="15" 
          class="pointer-events-auto cursor-pointer"
          @mouseenter="store.setHoveredNet(wire.net, wire.name, $event)"
          @mousemove="store.updateHoverPos($event)"
          @mouseleave="store.clearHoveredNet()" />

    <!-- Base dim wire -->
    <path :d="pathData" 
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
    <path ref="animatedPath"
          :d="pathData" 
          fill="none" 
          :stroke="wire.color" 
          stroke-width="3" 
          filter="url(#neon-glow)"
          class="opacity-0 pointer-events-none"
          :class="{ 'opacity-100': store.isSimulating }"
          stroke-dasharray="10 10" />
  </g>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useCircuitStore } from '~/stores/circuit'
import { useRouting } from '~/composables/useRouting'
import anime from 'animejs'

const props = defineProps<{ wire: any }>()
const store = useCircuitStore()
const { getBezierPath } = useRouting()

const animatedPath = ref<SVGPathElement | null>(null)
let animation: any = null

const pathData = computed(() => {
  return getBezierPath(props.wire)
})

watch(() => store.isSimulating, (active) => {
  if (active) {
    if (!animation && animatedPath.value) {
      animation = anime({
        targets: animatedPath.value,
        strokeDashoffset: [20, 0], // Magic trick! Animates just one cycle, ignoring total path length!
        easing: 'linear',
        duration: 400,
        loop: true
      })
    } else if (animation) {
      animation.play()
    }
  } else {
    if (animation) animation.pause()
  }
})

onMounted(() => {
  if (store.isSimulating && animatedPath.value) {
    animation = anime({
      targets: animatedPath.value,
      strokeDashoffset: [20, 0],
      easing: 'linear',
      duration: 400,
      loop: true
    })
  }
})

onBeforeUnmount(() => {
  if (animation) animation.pause()
})
</script>
