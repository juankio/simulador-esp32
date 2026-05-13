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
    if (nodeId === 'bb_vcc') return { x: breadboard.value.x + 20, y: breadboard.value.y + 150 }
    if (nodeId === 'bb_gnd') return { x: breadboard.value.x + 45, y: breadboard.value.y + 150 }
    const rowMatch = nodeId.match(/bb_r(\d+)/)
    if (rowMatch) {
       const rowIdx = parseInt(rowMatch[1])
       return { x: breadboard.value.x + 80, y: breadboard.value.y + 10 + rowIdx*19 }
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
  
  // Si la línea es muy corta horizontalmente, no forzamos curva brusca
  if (dx > dy && dx > 50) {
     const offset = dx * 0.4
     return `M ${p1.x} ${p1.y} C ${p1.x + offset} ${p1.y}, ${p2.x - offset} ${p2.y}, ${p2.x} ${p2.y}`
  } else {
     const offset = dy * 0.4
     return `M ${p1.x} ${p1.y} C ${p1.x} ${p1.y + offset}, ${p2.x} ${p2.y - offset}, ${p2.x} ${p2.y}`
  }
}

let animation: any = null

watch(isSimulating, (active) => {
  if (active) {
    animation = anime({
      targets: '.wire-pulse',
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'linear',
      duration: 1200,
      loop: true
    })
  } else {
    if (animation) animation.pause()
  }
})
</script>
