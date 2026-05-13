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
      <!-- Base dim wire -->
      <path :d="getBezierPath(wire)" 
            fill="none" 
            :stroke="wire.color" 
            stroke-width="2" 
            class="opacity-30 pointer-events-none" />
            
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

  // Enrutamiento mejorado para caídas naturales
  if (dx > dy * 1.5) {
     // Movimiento predominantemente horizontal
     const offset = dx * 0.4
     // Si p2 está a la izquierda de p1, forzar curva en S hacia abajo para no enrollarse
     if (p2.x < p1.x) {
       return `M ${p1.x} ${p1.y} C ${p1.x} ${p1.y + dy + 50}, ${p2.x} ${p2.y + dy + 50}, ${p2.x} ${p2.y}`
     }
     return `M ${p1.x} ${p1.y} C ${p1.x + offset} ${p1.y}, ${p2.x - offset} ${p2.y}, ${p2.x} ${p2.y}`
  } else {
     // Movimiento predominantemente vertical
     const offset = dy * 0.4
     // Si p2 está arriba de p1, forzar curva lateral para no enrollarse
     if (p2.y < p1.y) {
       return `M ${p1.x} ${p1.y} C ${p1.x + dx + 50} ${p1.y}, ${p2.x + dx + 50} ${p2.y}, ${p2.x} ${p2.y}`
     }
     return `M ${p1.x} ${p1.y} C ${p1.x} ${p1.y + offset}, ${p2.x} ${p2.y - offset}, ${p2.x} ${p2.y}`
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
watch([esp32, breadboard, leds, ledResistors, lcd, btnStart, btnFinish, resistor], () => {
  if (isSimulating.value) {
    // Pequeño debounce para no saturar anime.js mientras arrastramos
    setTimeout(() => {
      startWireAnimation()
    }, 50)
  }
}, { deep: true })
</script>
