<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div class="bg-[#0f172a] border border-neo-grid rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
      <!-- Header -->
      <div class="sticky top-0 bg-[#0f172a] p-4 border-b border-neo-grid flex justify-between items-center z-10">
        <h2 class="text-xl font-bold text-neo-blue font-mono flex items-center gap-2">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
          MANUAL DE ELECTROMAGNETISMO
        </h2>
        <button @click="close" class="text-neo-gray hover:text-white transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <!-- Body -->
      <div class="p-6 space-y-8 text-neo-gray">
        
        <!-- SECTION 1: LEY DE OHM -->
        <section class="space-y-4">
          <h3 class="text-lg text-white font-bold border-l-4 border-neo-red pl-3">Ley de Ohm y Límite de Corriente (LEDs)</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div class="space-y-3 text-sm leading-relaxed">
              <p>
                Según la <strong>Ley de Ohm</strong> (<span class="text-neo-blue font-mono bg-black/30 px-1 rounded">V = I × R</span>), la corriente que atraviesa un componente es proporcional al voltaje e inversamente proporcional a la resistencia.
              </p>
              <p>
                Los pines GPIO del <strong>ESP32 operan a 3.3V</strong>. Sin embargo, un LED rojo común soporta un voltaje directo de aproximadamente <strong>2.0V</strong> y consume una corriente óptima de <strong>10mA a 20mA (0.02A)</strong>.
              </p>
              <div class="bg-black/30 p-3 rounded font-mono text-xs border border-neo-grid border-dashed">
                // Cálculo para calcular la Resistencia:<br>
                Vr = Voltaje ESP32 - Voltaje LED<br>
                Vr = 3.3V - 2.0V = 1.3V<br>
                <br>
                R = V / I<br>
                R = 1.3V / 0.01A = <strong class="text-neo-red">130 Ω</strong>
              </div>
              <p>
                Por seguridad, en los circuitos digitales se estandariza una resistencia comercial de <strong>220 Ω o 330 Ω</strong> por cada LED. Si conectas el LED directo a GND sin resistencia, el exceso de corriente quemará el LED y posiblemente dañará el pin del ESP32.
              </p>
            </div>
            
            <div class="bg-black/40 border border-neo-grid rounded-lg p-4 flex flex-col items-center justify-center min-h-[200px]">
              <div class="text-xs text-center text-white/50 mb-4 font-mono uppercase tracking-widest">Diagrama de Conexión</div>
              <!-- Diagrama SVG Simplificado -->
              <svg width="250" height="100" viewBox="0 0 250 100">
                <!-- ESP32 Pin -->
                <rect x="10" y="40" width="40" height="20" rx="3" fill="#38bdf8" />
                <text x="30" y="54" fill="black" font-size="12" font-family="monospace" text-anchor="middle" font-weight="bold">D4</text>
                <!-- Cable al Resistor -->
                <path d="M 50 50 L 90 50" stroke="#ef4444" stroke-width="2" fill="none" />
                <!-- Resistor (Zig-Zag) -->
                <path d="M 90 50 L 95 40 L 105 60 L 115 40 L 125 60 L 135 40 L 140 50 L 150 50" stroke="#facc15" stroke-width="2" fill="none" stroke-linejoin="round" />
                <text x="115" y="30" fill="#facc15" font-size="10" font-family="monospace" text-anchor="middle">220 Ω</text>
                <!-- Cable al LED -->
                <path d="M 150 50 L 180 50" stroke="#ef4444" stroke-width="2" fill="none" />
                <!-- LED Diodo -->
                <path d="M 180 40 L 180 60 L 200 50 Z" fill="#ef4444" />
                <path d="M 200 40 L 200 60" stroke="#ef4444" stroke-width="2" />
                <!-- Cable a GND -->
                <path d="M 200 50 L 230 50" stroke="#64748b" stroke-width="2" fill="none" />
                <!-- GND Symbol -->
                <path d="M 220 60 L 240 60 M 225 65 L 235 65 M 228 70 L 232 70" stroke="#64748b" stroke-width="2" fill="none" />
              </svg>
            </div>
          </div>
        </section>

        <hr class="border-neo-grid" />

        <!-- SECTION 2: RUIDO ELECTROMAGNÉTICO Y PULLUP -->
        <section class="space-y-4">
          <h3 class="text-lg text-white font-bold border-l-4 border-neo-green pl-3">Interferencia Electromagnética y Resistencias Pull-up</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div class="space-y-3 text-sm leading-relaxed order-2 md:order-1">
              <p>
                En el <strong>Laberinto de Aluminio</strong>, un cable actúa como una enorme antena de radio. Las leyes del electromagnetismo (como la <em>Ley de Faraday</em> o interferencias de radiofrecuencia) inducen pequeñas corrientes en cables metálicos largos.
              </p>
              <p>
                Si conectamos un pin de entrada del ESP32 directamente al aire (flotante), registrará un valor inestable saltando entre <code class="bg-black/30 text-neo-green px-1">HIGH</code> y <code class="bg-black/30 text-neo-red px-1">LOW</code> aleatoriamente debido a este ruido (ruido capacitivo por tocarlo, ruido ambiental, etc.).
              </p>
              <p>
                La solución de hardware es usar una <strong>Resistencia Pull-up</strong> (típicamente de 10k Ω). Esta resistencia ancla el pin firmemente a <strong>3.3V (HIGH)</strong>, proveyendo un voltaje estable y absorbiendo la interferencia. Cuando el aro toca el aluminio conectado a GND, la corriente busca el camino de menor resistencia y cae a <strong>0V (LOW)</strong> de forma limpia.
              </p>
            </div>
            
            <div class="bg-black/40 border border-neo-grid rounded-lg p-4 flex flex-col items-center justify-center min-h-[200px] order-1 md:order-2">
              <div class="text-xs text-center text-white/50 mb-4 font-mono uppercase tracking-widest">Diagrama Pull-Up</div>
              <svg width="250" height="160" viewBox="0 0 250 160">
                <!-- 3V3 Line -->
                <text x="30" y="20" fill="#ef4444" font-size="12" font-family="monospace" text-anchor="middle" font-weight="bold">3.3V</text>
                <path d="M 30 25 L 30 50" stroke="#ef4444" stroke-width="2" fill="none" />
                <!-- Resistor (Vertical) -->
                <path d="M 30 50 L 20 55 L 40 65 L 20 75 L 40 85 L 20 95 L 30 100 L 30 110" stroke="#34d399" stroke-width="2" fill="none" stroke-linejoin="round" />
                <text x="55" y="80" fill="#34d399" font-size="10" font-family="monospace">10k Ω</text>
                <!-- Junction -->
                <circle cx="30" cy="110" r="3" fill="#white" />
                
                <!-- Al Pin D13 -->
                <path d="M 30 110 L 100 110" stroke="#38bdf8" stroke-width="2" fill="none" />
                <rect x="100" y="100" width="40" height="20" rx="3" fill="#38bdf8" />
                <text x="120" y="114" fill="black" font-size="12" font-family="monospace" text-anchor="middle" font-weight="bold">D13</text>
                
                <!-- Al Aluminio (Switch) -->
                <path d="M 30 110 L 30 130" stroke="#a1a1aa" stroke-width="2" fill="none" />
                <circle cx="30" cy="130" r="2" fill="#white" />
                <!-- Switch open state -->
                <path d="M 30 130 L 15 145" stroke="#a1a1aa" stroke-width="2" fill="none" />
                <circle cx="15" cy="148" r="2" fill="#white" />
                
                <!-- A GND -->
                <path d="M 15 150 L 15 155" stroke="#64748b" stroke-width="2" fill="none" />
                <path d="M 5 155 L 25 155 M 10 158 L 20 158" stroke="#64748b" stroke-width="2" fill="none" />
                <text x="50" y="145" fill="#a1a1aa" font-size="10" font-family="monospace">Pared Aluminio</text>
              </svg>
            </div>
          </div>
        </section>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const close = () => {
  emit('close')
}
</script>