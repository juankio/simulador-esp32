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
import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useCircuitStore } from '~/stores/circuit'
import anime from 'animejs'

const store = useCircuitStore()
const { wires, esp32, breadboard, leds, ledResistors, btnStart, btnFinish, lcd, wallSensor, resistor, isSimulating } = storeToRefs(store)

const getPinGlobalCoords = (nodeId: string) => {
  // 1. ESP32
  let pin = esp32.value.pins.find(p => p.id === nodeId)
  if (pin) return { x: esp32.value.x + pin.x, y: esp32.value.y + pin.y }

  // 2. Breadboard
  if (nodeId.startsWith('bb_')) {
    // Parámetros de la protoboard SVG
    const bbX = breadboard.value.x
    const bbY = breadboard.value.y

    // Rieles de Poder VCC/GND (Izquierda)
    if (nodeId.startsWith('bb_vcc_')) {
      const idx = parseInt(nodeId.replace('bb_vcc_', ''))
      return { x: bbX + 15, y: bbY + 15 + (idx * 15) } // Distribuido a lo largo del riel rojo
    }
    if (nodeId.startsWith('bb_gnd_')) {
      const idx = parseInt(nodeId.replace('bb_gnd_', ''))
      return { x: bbX + 40, y: bbY + 15 + (idx * 15) } // Distribuido a lo largo del riel azul
    }
    
    // Antiguo fallback para VCC/GND simple (retrocompatibilidad)
    if (nodeId === 'bb_vcc') return { x: bbX + 15, y: bbY + 150 }
    if (nodeId === 'bb_gnd') return { x: bbX + 40, y: bbY + 150 }

    // Filas (Horizontales) con índices (A, B, C, D, E emulados con números _1, _2, _3)
    // Formato ej: bb_r10_1, bb_r5_2
    const rowMatchFull = nodeId.match(/bb_r(\d+)_(\d+)/)
    if (rowMatchFull) {
       const rowIdx = parseInt(rowMatchFull[1])
       const colIdx = parseInt(rowMatchFull[2])
       // x: 65 es el inicio de los huecos izquierdos, sumamos colIdx * 8 para separar horizontalmente
       return { x: bbX + 65 + (colIdx * 7), y: bbY + 10 + rowIdx*19 }
    }

    // Antiguo fallback para Filas sin índice (retrocompatibilidad)
    const rowMatch = nodeId.match(/bb_r(\d+)/)
    if (rowMatch) {
       const rowIdx = parseInt(rowMatch[1])
       return { x: bbX + 80, y: bbY + 10 + rowIdx*19 }
    }
  }

  // 3. LCD
  pin = lcd.value.pins.find(p => p.id === nodeId)
  if (pin) return { x: lcd.value.x + pin.x, y: lcd.value.y - 8 }

  // 4. LEDs (Array)
  for (const led of leds.value) {
    if (nodeId === led.anode.id) return { x: led.x + led.anode.x, y: led.y + led.anode.y }
    if (nodeId === led.cathode.id) return { x: led.x + led.cathode.x, y: led.y + led.cathode.y }
  }

  // 4.5. LED Resistors (Array)
  for (const res of ledResistors.value) {
    if (nodeId === res.p1.id) return { x: res.x + res.p1.x, y: res.y + res.p1.y }
    if (nodeId === res.p2.id) return { x: res.x + res.p2.x, y: res.y + res.p2.y }
  }

  // 5. Button (Start)
  if (nodeId === btnStart.value.p1.id) return { x: btnStart.value.x + btnStart.value.p1.x, y: btnStart.value.y + btnStart.value.p1.y }
  if (nodeId === btnStart.value.p2.id) return { x: btnStart.value.x + btnStart.value.p2.x, y: btnStart.value.y + btnStart.value.p2.y }

  // 5.5. Button (Finish)
  if (btnFinish?.value) {
    if (nodeId === btnFinish.value.p1.id) return { x: btnFinish.value.x + btnFinish.value.p1.x, y: btnFinish.value.y + btnFinish.value.p1.y }
    if (nodeId === btnFinish.value.p2.id) return { x: btnFinish.value.x + btnFinish.value.p2.x, y: btnFinish.value.y + btnFinish.value.p2.y }
  }

  // 6. Wall Sensor (Aluminio)
  if (nodeId === wallSensor.value.pin.id) return { x: wallSensor.value.x + wallSensor.value.pin.x, y: wallSensor.value.y + wallSensor.value.pin.y }

  // 7. Resistor
  if (nodeId === resistor.value.p1.id) return { x: resistor.value.x + resistor.value.p1.x, y: resistor.value.y + resistor.value.p1.y }
  if (nodeId === resistor.value.p2.id) return { x: resistor.value.x + resistor.value.p2.x, y: resistor.value.y + resistor.value.p2.y }

  console.warn(`Pin no encontrado: ${nodeId}`)
  return { x: 0, y: 0 }
}

const getBezierPath = (wire: any) => {
  const p1 = getPinGlobalCoords(wire.fromNode)
  const p2 = getPinGlobalCoords(wire.toNode)
  
  const dx = Math.abs(p2.x - p1.x)
  const dy = Math.abs(p2.y - p1.y)

  // Enrutamiento Ortogonal ("En paralelo", Manhattan Routing)
  const midX = p1.x + (p2.x - p1.x) / 2
  const midY = p1.y + (p2.y - p1.y) / 2

  // Añadimos un radio de curvatura (fillet) para que los codos no sean 100% en pico
  const r = Math.min(10, dx / 2, dy / 2)

  if (dx > dy) {
     // Ruta horizontal-vertical-horizontal
     const dirX = p2.x > p1.x ? 1 : -1
     const dirY = p2.y > p1.y ? 1 : -1
     if (r <= 0) return `M ${p1.x} ${p1.y} L ${midX} ${p1.y} L ${midX} ${p2.y} L ${p2.x} ${p2.y}`
     
     return `M ${p1.x} ${p1.y} 
             L ${midX - r * dirX} ${p1.y} 
             Q ${midX} ${p1.y} ${midX} ${p1.y + r * dirY} 
             L ${midX} ${p2.y - r * dirY} 
             Q ${midX} ${p2.y} ${midX + r * dirX} ${p2.y} 
             L ${p2.x} ${p2.y}`
  } else {
     // Ruta vertical-horizontal-vertical
     const dirX = p2.x > p1.x ? 1 : -1
     const dirY = p2.y > p1.y ? 1 : -1
     if (r <= 0) return `M ${p1.x} ${p1.y} L ${p1.x} ${midY} L ${p2.x} ${midY} L ${p2.x} ${p2.y}`
     
     return `M ${p1.x} ${p1.y} 
             L ${p1.x} ${midY - r * dirY} 
             Q ${p1.x} ${midY} ${p1.x + r * dirX} ${midY} 
             L ${p2.x - r * dirX} ${midY} 
             Q ${p2.x} ${midY} ${p2.x} ${midY + r * dirY} 
             L ${p2.x} ${p2.y}`
  }
}

// Watch global states to recalculate paths or animations
let animation: any = null

const startWireAnimation = () => {
  if (animation) animation.pause()
  animation = anime({
    targets: '.wire-pulse',
    strokeDashoffset: [anime.setDashoffset, 0],
    easing: 'linear',
    duration: 1200,
    loop: true
  })
}

// Escuchar cambios tanto en isSimulating como en los wires (si cambian/estiran)
watch(isSimulating, (active) => {
  if (active) {
    startWireAnimation()
  } else {
    if (animation) animation.pause()
  }
})

// Escuchar cambios profundos en las coordenadas para reiniciar la longitud de la animación
let dragDebounce: any = null
watch([esp32, breadboard, leds, ledResistors, lcd, btnStart, btnFinish, resistor], () => {
  if (isSimulating.value) {
    if (dragDebounce) clearTimeout(dragDebounce)
    dragDebounce = setTimeout(() => {
      startWireAnimation()
    }, 50)
  }
}, { deep: true })
</script>
