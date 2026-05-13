<template>
  <main 
    class="flex-1 relative overflow-hidden bg-neo-bg cursor-grab active:cursor-grabbing"
    @mousedown="startPanOrDrag"
    @mousemove="doPanOrDrag"
    @mouseup="endPanOrDrag"
    @mouseleave="endPanOrDrag"
    @wheel="doZoom"
  >
    <svg class="absolute inset-0 w-full h-full pointer-events-none opacity-20">
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" stroke-width="1"/>
        </pattern>
      </defs>
      <!-- The grid pattern moves with the pan offset -->
      <rect width="100%" height="100%" fill="url(#grid)" :transform="`translate(${pan.x % 40}, ${pan.y % 40})`" />
    </svg>

    <!-- SVG Components Container -->
    <svg class="w-full h-full overflow-visible">
      <g :transform="`translate(${pan.x}, ${pan.y}) scale(${zoom})`">
        <g class="cursor-move" @mousedown="startNodeDrag($event, store.esp32)"><CircuitNodeESP32 :x="store.esp32.x" :y="store.esp32.y" :pins="store.esp32.pins" /></g>
        <g class="cursor-move" @mousedown="startNodeDrag($event, store.breadboard)"><CircuitNodeBreadboard :x="store.breadboard.x" :y="store.breadboard.y" /></g>
        
        <!-- LEDs (3 Rojos de Error y 1 Verde de Éxito) -->
        <g class="cursor-move" v-for="led in store.leds" :key="led.id" @mousedown="startNodeDrag($event, led)">
          <CircuitNodeLED 
            :x="led.x" :y="led.y" :anode="led.anode" :cathode="led.cathode" 
            :isOn="led.isOn" :color="(led.color as any)" />
        </g>
        
        <!-- Botón de Inicio -->
        <g class="cursor-move" @mousedown="startNodeDrag($event, store.btnStart)">
          <CircuitNodeButton 
            :x="store.btnStart.x" :y="store.btnStart.y" :p1="store.btnStart.p1" :p2="store.btnStart.p2"
            :isPressed="store.btnStart.isPressed" label="START"
            @press="(s) => store.triggerButton(s, false)" />
        </g>

        <!-- Botón de Meta / Finish -->
        <g class="cursor-move" @mousedown="startNodeDrag($event, store.btnFinish)">
          <CircuitNodeButton 
            :x="store.btnFinish.x" :y="store.btnFinish.y" :p1="store.btnFinish.p1" :p2="store.btnFinish.p2"
            :isPressed="store.btnFinish.isPressed" label="FINISH"
            @press="(s) => store.triggerButton(s, true)" />
        </g>
          
        <g class="cursor-move" @mousedown="startNodeDrag($event, store.lcd)">
          <CircuitNodeLCD 
            :x="store.lcd.x" :y="store.lcd.y" :pins="store.lcd.pins" 
            :backlightOn="store.lcd.backlightOn" :errorLowVoltage="store.lcd.errorLowVoltage" :text="store.lcd.text" />
        </g>
          
        <g class="cursor-move" @mousedown="startNodeDrag($event, store.wallSensor)">
          <CircuitNodeWall 
            :x="store.wallSensor.x" :y="store.wallSensor.y" :pin="store.wallSensor.pin" 
            :isTouched="store.wallSensor.isTouched" :glitching="store.wallSensor.glitching"
            @touch="store.triggerWallTouch" />
        </g>
          
        <!-- Resistencia PullUp -->
        <g class="cursor-move" @mousedown="startNodeDrag($event, store.resistor)" v-if="store.fixSensorPullup">
          <CircuitNodeResistor :x="store.resistor.x" :y="store.resistor.y" :p1="store.resistor.p1" :p2="store.resistor.p2" />
        </g>

        <!-- Resistencias de los LEDs -->
        <g class="cursor-move" v-for="res in store.ledResistors" :key="res.id" @mousedown="startNodeDrag($event, res)">
          <CircuitNodeResistor :x="res.x" :y="res.y" :p1="res.p1" :p2="res.p2" />
        </g>
        
        <!-- Dynamic Wires -->
        <CircuitWireLayer />
      </g>
    </svg>
    
      <!-- Zoom Controls UI -->
      <div class="absolute bottom-6 left-6 flex flex-col gap-2 bg-[#0b1121] border border-neo-grid p-1 rounded z-10 shadow-lg">
        <button @click="zoom += 0.2" class="w-8 h-8 flex items-center justify-center text-neo-gray hover:text-white hover:bg-white/10 rounded transition-colors">+</button>
        <div class="w-8 h-[1px] bg-neo-grid"></div>
        <button @click="zoom = Math.max(0.4, zoom - 0.2)" class="w-8 h-8 flex items-center justify-center text-neo-gray hover:text-white hover:bg-white/10 rounded transition-colors">-</button>
        <div class="w-8 h-[1px] bg-neo-grid"></div>
        <button @click="resetView" class="w-8 h-8 flex items-center justify-center text-neo-blue hover:text-white hover:bg-white/10 rounded transition-colors" title="Reset View">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
        </button>
      </div>

      <!-- Net Highlighter Tooltip -->
      <div v-if="store.hoveredNet" 
           class="fixed pointer-events-none z-50 bg-[#0f172a] border p-2 rounded shadow-2xl font-mono text-xs text-white"
           :class="{
             'border-neo-red': store.hoveredNet.includes('5V') || store.hoveredNet.includes('3V3'),
             'border-neo-gray': store.hoveredNet === 'GND',
             'border-neo-blue': store.hoveredNet.includes('SIG_') || store.hoveredNet.includes('I2C_')
           }"
           :style="{ left: store.hoverPos.x + 15 + 'px', top: store.hoverPos.y + 15 + 'px' }">
        <div class="font-bold flex items-center gap-2"
             :class="{
               'text-neo-red': store.hoveredNet.includes('5V') || store.hoveredNet.includes('3V3'),
               'text-white': store.hoveredNet === 'GND',
               'text-neo-blue': store.hoveredNet.includes('SIG_') || store.hoveredNet.includes('I2C_')
             }">
          <span class="w-2 h-2 rounded-full animate-pulse"
                :class="{
                  'bg-neo-red': store.hoveredNet.includes('5V') || store.hoveredNet.includes('3V3'),
                  'bg-white': store.hoveredNet === 'GND',
                  'bg-neo-blue': store.hoveredNet.includes('SIG_') || store.hoveredNet.includes('I2C_')
                }"></span>
          {{ store.hoveredNet }}
        </div>
        <div class="text-neo-gray mt-1 border-t border-neo-grid pt-1">{{ store.hoveredName }}</div>
      </div>

    <!-- Custom Neon Toast Notification -->
    <transition 
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-y-10 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform translate-y-10 opacity-0"
    >
      <div v-if="toast.show" 
           class="absolute bottom-8 right-8 px-6 py-4 rounded bg-[#0b1121] border font-mono text-sm z-50 flex items-center gap-3 shadow-2xl"
           :class="toast.type === 'error' ? 'border-neo-red text-neo-red shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'border-neo-blue text-neo-blue shadow-[0_0_20px_rgba(56,189,248,0.3)]'">
        <span v-if="toast.type === 'error'" class="animate-pulse text-lg">⚠️</span>
        <span v-else class="text-lg">⚡</span>
        {{ toast.message }}
      </div>
    </transition>
    
  </main>
</template>

<script setup lang="ts">
import { useCircuitStore } from '~/stores/circuit'

const store = useCircuitStore()

const props = defineProps<{
  toast: { show: boolean, message: string, type: string }
}>()

// Zoom & Pan & Drag System
const zoom = ref(1.1) 
const pan = ref({ x: 0, y: 0 })
const isDraggingPan = ref(false)
const startDragPan = ref({ x: 0, y: 0 })

// Node Dragging System
const draggingNode = ref<any>(null)
const startDragNodeOffset = ref({ x: 0, y: 0 })

const startPanOrDrag = (e: MouseEvent) => {
  if ((e.target as Element).tagName === 'svg' || (e.target as Element).tagName === 'rect' && (e.target as Element).id === '') {
    isDraggingPan.value = true
    startDragPan.value = { x: e.clientX - pan.value.x, y: e.clientY - pan.value.y }
  }
}

const startNodeDrag = (e: MouseEvent, nodeRef: any) => {
  e.stopPropagation()
  draggingNode.value = nodeRef
  
  // Calcular el mouse en coordenadas del SVG (restando el paneo y el zoom)
  const svgMouseX = (e.clientX - pan.value.x) / zoom.value
  const svgMouseY = (e.clientY - pan.value.y) / zoom.value
  
  startDragNodeOffset.value = {
    x: svgMouseX - nodeRef.x,
    y: svgMouseY - nodeRef.y
  }
}

const doPanOrDrag = (e: MouseEvent) => {
  if (draggingNode.value) {
    const svgMouseX = (e.clientX - pan.value.x) / zoom.value
    const svgMouseY = (e.clientY - pan.value.y) / zoom.value
    
    draggingNode.value.x = svgMouseX - startDragNodeOffset.value.x
    draggingNode.value.y = svgMouseY - startDragNodeOffset.value.y
  } else if (isDraggingPan.value) {
    pan.value = {
      x: e.clientX - startDragPan.value.x,
      y: e.clientY - startDragPan.value.y
    }
  }
}

const endPanOrDrag = () => {
  isDraggingPan.value = false
  draggingNode.value = null
}

const doZoom = (e: WheelEvent) => {
  e.preventDefault()
  const zoomFactor = 0.05
  if (e.deltaY < 0) {
    zoom.value = Math.min(2.5, zoom.value + zoomFactor)
  } else {
    zoom.value = Math.max(0.4, zoom.value - zoomFactor)
  }
}

const resetView = () => {
  zoom.value = 1.1
  pan.value = { x: 0, y: 0 }
}
</script>