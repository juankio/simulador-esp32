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

        <!-- SECTION 0: TALLER DE CÁLCULOS (KIRCHHOFF & CONTACTO) -->
        <section class="space-y-4">
          <h3 class="text-lg text-white font-bold border-l-4 border-neo-purple pl-3">Cálculos de Taller: Análisis del Circuito del Prototipo</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            <!-- Kirchhoff LEDs -->
            <div class="bg-black/40 border border-neo-grid rounded-lg p-4 flex flex-col min-h-[300px]">
              <div class="text-xs text-center text-neo-purple mb-4 font-mono uppercase tracking-widest">Leyes de Kirchhoff (Nodos - LCK)</div>
              
              <!-- Diagrama LCK Clásico Académico (Modo Neo) -->
              <svg width="100%" height="150" viewBox="0 0 300 150" class="mx-auto block max-w-full h-auto">
                <!-- Malla Rectangular Base Cerrada -->
                <path d="M 40 75 L 40 40 L 240 40 M 240 120 L 40 120 L 40 85" stroke="#a1a1aa" stroke-width="2" fill="none" />
                
                <!-- Fuente 3.3V (Batería Clásica) sobre la línea izquierda -->
                <path d="M 20 75 L 60 75" stroke="#ef4444" stroke-width="3" fill="none" /> <!-- Polo Positivo (Largo) -->
                <path d="M 30 85 L 50 85" stroke="#38bdf8" stroke-width="4" fill="none" /> <!-- Polo Negativo (Corto) -->
                
                <text x="25" y="65" fill="#ef4444" font-size="16" font-weight="bold">+</text>
                <text x="25" y="100" fill="#38bdf8" font-size="16" font-weight="bold">-</text>
                <text x="15" y="84" fill="white" font-size="14" font-weight="bold" font-family="monospace" text-anchor="end">V1</text>
                <text x="15" y="96" fill="#a1a1aa" font-size="10" font-family="monospace" text-anchor="end">3.3V</text>

                <!-- Nodos Principales (Puntos de conexión LCK) Arriba -->
                <circle cx="100" cy="40" r="3" fill="#38bdf8" />
                <circle cx="170" cy="40" r="3" fill="#38bdf8" />
                
                <!-- Nodos Inferiores (Solo conexión, sin ramas extra hacia abajo) -->
                <circle cx="100" cy="120" r="3" fill="#a1a1aa" />
                <circle cx="170" cy="120" r="3" fill="#a1a1aa" />

                <!-- Flecha Corriente Total (I_T entrando al primer nodo) en el centro del cable superior -->
                <path d="M 55 30 L 75 30" stroke="#facc15" stroke-width="2" fill="none" />
                <polygon points="75,30 70,25 70,35" fill="#facc15" />
                <text x="65" y="23" fill="#facc15" font-size="14" font-family="monospace" font-weight="bold" text-anchor="middle">I_T</text>

                <!-- Rama Central 1 (LED 1) -->
                <path d="M 100 40 L 100 50 M 100 80 L 100 90 M 100 110 L 100 120" stroke="#a1a1aa" stroke-width="2" fill="none" />
                <!-- Resistencia -->
                <path d="M 100 50 L 94 53 L 106 59 L 94 65 L 106 71 L 94 77 L 100 80" stroke="#38bdf8" stroke-width="2" fill="none" stroke-linejoin="round" />
                <text x="125" y="65" fill="#38bdf8" font-size="12" font-family="monospace" text-anchor="middle">220Ω</text>
                <!-- LED -->
                <path d="M 90 90 L 110 90 L 100 105 Z" fill="#ef4444" />
                <path d="M 90 105 L 110 105" stroke="#ef4444" stroke-width="2" />
                <!-- Flecha I1 -->
                <path d="M 85 60 L 85 80" stroke="#facc15" stroke-width="1.5" fill="none" />
                <polygon points="85,80 80,75 90,75" fill="#facc15" />
                <text x="80" y="73" fill="#facc15" font-size="14" font-family="monospace" font-weight="bold" text-anchor="end">I1</text>

                <!-- Rama Central 2 (LED 2) -->
                <path d="M 170 40 L 170 50 M 170 80 L 170 90 M 170 110 L 170 120" stroke="#a1a1aa" stroke-width="2" fill="none" />
                <!-- Resistencia -->
                <path d="M 170 50 L 164 53 L 176 59 L 164 65 L 176 71 L 164 77 L 170 80" stroke="#38bdf8" stroke-width="2" fill="none" stroke-linejoin="round" />
                <text x="195" y="65" fill="#38bdf8" font-size="12" font-family="monospace" text-anchor="middle">220Ω</text>
                <!-- LED -->
                <path d="M 160 90 L 180 90 L 170 105 Z" fill="#ef4444" />
                <path d="M 160 105 L 180 105" stroke="#ef4444" stroke-width="2" />
                <!-- Flecha I2 -->
                <path d="M 155 60 L 155 80" stroke="#facc15" stroke-width="1.5" fill="none" />
                <polygon points="155,80 150,75 160,75" fill="#facc15" />
                <text x="150" y="73" fill="#facc15" font-size="14" font-family="monospace" font-weight="bold" text-anchor="end">I2</text>

                <!-- Rama Derecha (LED 3 - En el borde de la malla) -->
                <!-- Resistencia -->
                <path d="M 240 40 L 240 50 M 240 80 L 240 90 M 240 110 L 240 120" stroke="#a1a1aa" stroke-width="2" fill="none" />
                <path d="M 240 50 L 234 53 L 246 59 L 234 65 L 246 71 L 234 77 L 240 80" stroke="#38bdf8" stroke-width="2" fill="none" stroke-linejoin="round" />
                <text x="265" y="65" fill="#38bdf8" font-size="12" font-family="monospace" text-anchor="middle">220Ω</text>
                <!-- LED -->
                <path d="M 230 90 L 250 90 L 240 105 Z" fill="#ef4444" />
                <path d="M 230 105 L 250 105" stroke="#ef4444" stroke-width="2" />
                <!-- Flecha I3 -->
                <path d="M 225 60 L 225 80" stroke="#facc15" stroke-width="1.5" fill="none" />
                <polygon points="225,80 220,75 230,75" fill="#facc15" />
                <text x="220" y="73" fill="#facc15" font-size="14" font-family="monospace" font-weight="bold" text-anchor="end">I3</text>
              </svg>
              <div class="mt-4 space-y-2 text-xs font-mono bg-black/50 p-3 rounded text-neo-gray">
                <div class="text-white font-bold border-b border-neo-grid pb-1 mb-2">Ecuaciones de Sistema (Leyes de Kirchhoff)</div>
                <p>1) Corriente por LED: <span class="text-neo-blue">I_LED = (3.3V - 2.0V) / 220Ω = 5.9mA</span></p>
                <p>2) Nodos (LCK): <span class="text-neo-red">I_T = I₁ + I₂ + I₃</span></p>
                <p>3) Corriente Total: <span class="text-neo-red">I_T = 5.9 + 5.9 + 5.9 = 17.7mA</span></p>
              </div>
            </div>

            <!-- Circuito Contacto -->
            <div class="bg-black/40 border border-neo-grid rounded-lg p-4 flex flex-col min-h-[300px]">
              <div class="text-xs text-center text-neo-purple mb-4 font-mono uppercase tracking-widest">Malla de Detección (LVK y Contacto)</div>
              
              <!-- Diagrama de Malla de Contacto Clásico (Académico) -->
              <svg width="100%" height="150" viewBox="0 0 300 150" class="mx-auto block max-w-full h-auto">
                <!-- Malla Rectangular Base -->
                <path d="M 80 120 L 80 40 L 120 40 M 180 40 L 220 40 L 220 120 L 80 120" stroke="#a1a1aa" stroke-width="2" fill="none" />

                <!-- Fuente 3.3V (Batería Clásica izquierda) -->
                <path d="M 60 75 L 100 75" stroke="#ef4444" stroke-width="3" fill="none" /> <!-- Polo Positivo (Largo) -->
                <path d="M 70 85 L 90 85" stroke="#38bdf8" stroke-width="4" fill="none" /> <!-- Polo Negativo (Corto) -->
                
                <text x="65" y="65" fill="#ef4444" font-size="16" font-weight="bold">+</text>
                <text x="65" y="100" fill="#38bdf8" font-size="16" font-weight="bold">-</text>
                <text x="45" y="84" fill="white" font-size="14" font-weight="bold" font-family="monospace" text-anchor="end">V1</text>
                <text x="45" y="96" fill="#a1a1aa" font-size="10" font-family="monospace" text-anchor="end">3.3V</text>

                <!-- 10k Resistor (Arriba) -->
                <path d="M 120 40 L 125 35 L 135 45 L 145 35 L 155 45 L 165 35 L 175 45 L 180 40" stroke="#38bdf8" stroke-width="2" fill="none" stroke-linejoin="round" />
                <text x="150" y="25" fill="#38bdf8" font-size="10" font-family="monospace" text-anchor="middle">R_pullup (10kΩ)</text>
                
                <!-- Esfera a Pared (Switch cerrado directamente en la pared derecha) -->
                <!-- Sin puerta, solo nodos conectados por la malla gris de fondo -->
                <circle cx="220" cy="55" r="3" fill="#38bdf8" />
                <circle cx="220" cy="85" r="3" fill="#64748b" />
                
                <!-- Recorrido Circular I_contacto (Loop LVK) Exactamente en el centro -->
                <path d="M 130 80 C 130 50, 170 50, 170 80 C 170 110, 135 110, 135 95" stroke="#facc15" stroke-width="3" fill="none" />
                <polygon points="135,95 130,105 142,100" fill="#facc15" />
                <text x="150" y="85" fill="#facc15" font-size="16" font-family="monospace" text-anchor="middle" font-weight="bold">I_contacto</text>
              </svg>

              <div class="mt-4 space-y-2 text-xs font-mono bg-black/50 p-3 rounded text-neo-gray">
                <div class="text-white font-bold border-b border-neo-grid pb-1 mb-2">Leyes de Kirchhoff (Mallas - LVK)</div>
                <p>1) Malla cerrada: <span class="text-neo-blue">3.3V - V_Rpullup - V_contacto = 0</span></p>
                <div class="flex items-center gap-2">
                  <span>2) Ley Ohm (Sensor):</span> 
                  <span class="inline-flex flex-col items-center align-middle text-neo-green ml-1">
                    <span class="border-b border-neo-green px-1 leading-none pb-0.5">3.3V</span>
                    <span class="leading-none pt-0.5">10000Ω</span>
                  </span>
                  <span class="text-neo-green">= 0.33 mA</span>
                </div>
                <p>3) Comprobación LVK: <span class="text-neo-red">3.3V - (0.33mA)(10kΩ) - 0V = 0</span></p>
              </div>
            </div>

          </div>
        </section>

        <hr class="border-neo-grid" />
        
        <!-- SECTION 1: LEY DE OHM -->
        <section class="space-y-4">
          <h3 class="text-lg text-white font-bold border-l-4 border-neo-red pl-3">Ley de Ohm y Protección del Microcontrolador (3.3V)</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div class="space-y-3 text-sm leading-relaxed">
              <p>
                El diseño exige proteger los delicados pines lógicos del ESP32. Alimentaremos los LEDs de las "vidas" con <strong>3.3V</strong>. Un LED rojo común requiere un voltaje directo de <strong>2.0V</strong> y consume una corriente ideal de <strong>15mA (0.015A)</strong>.
              </p>
              <div class="bg-black/30 p-3 rounded font-mono text-xs border border-neo-grid border-dashed">
                // Cálculo de resistencia teórica mínima:<br>
                Vr = Voltaje ESP32 - Voltaje LED<br>
                Vr = 3.3V - 2.0V = 1.3V<br>
                <br>
                R_min = V / I<br>
                R_min = 1.3V / 0.015A = <strong class="text-neo-red">86.6 Ω</strong>
              </div>
              <p>
                Sin embargo, para proteger el ESP32 (cuyo límite absoluto es ~12mA por pin) y reducir el consumo térmico, se utilizaron resistencias comerciales estándar de <strong>220 Ω</strong>.
              </p>
              <p class="text-neo-blue opacity-90 font-semibold">
                Esto conecta directamente con la Ley de Nodos (LCK) vista arriba, demostrando cómo logramos reducir la corriente real a seguros 5.9mA por vida.
              </p>
            </div>
            
            <div class="bg-black/40 border border-neo-grid rounded-lg p-4 flex flex-col items-center justify-center min-h-[200px]">
              <div class="text-xs text-center text-white/50 mb-4 font-mono uppercase tracking-widest">Diagrama Físico (3.3V)</div>
              <!-- Diagrama SVG Simplificado -->
              <svg width="250" height="100" viewBox="0 0 250 100" class="max-w-full h-auto">
                <!-- VCC 3.3V -->
                <text x="30" y="54" fill="#ef4444" font-size="12" font-family="monospace" text-anchor="middle" font-weight="bold">3.3V</text>
                <!-- Cable al Resistor -->
                <path d="M 45 50 L 90 50" stroke="#ef4444" stroke-width="2" fill="none" />
                <!-- Resistor (Zig-Zag) -->
                <path d="M 90 50 L 95 45 L 105 55 L 115 45 L 125 55 L 135 45 L 140 50 L 150 50" stroke="#facc15" stroke-width="2" fill="none" stroke-linejoin="round" />
                <text x="115" y="30" fill="#facc15" font-size="10" font-family="monospace" text-anchor="middle">220 Ω</text>
                <!-- Cable al LED -->
                <path d="M 150 50 L 180 50" stroke="#ef4444" stroke-width="2" fill="none" />
                <!-- LED Diodo -->
                <path d="M 180 40 L 180 60 L 200 50 Z" fill="#ef4444" />
                <path d="M 200 40 L 200 60" stroke="#ef4444" stroke-width="2" />
                <!-- Cable a GND -->
                <path d="M 200 50 L 230 50" stroke="#64748b" stroke-width="2" fill="none" />
                <!-- Tierra Symbol -->
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
              <svg width="250" height="160" viewBox="0 0 250 160" class="max-w-full h-auto">
                <!-- 3V3 Line -->
                <text x="30" y="20" fill="#ef4444" font-size="12" font-family="monospace" text-anchor="middle" font-weight="bold">3.3V</text>
                <path d="M 30 25 L 30 50" stroke="#ef4444" stroke-width="2" fill="none" />
                <!-- Resistor (Vertical) -->
                <path d="M 30 50 L 25 55 L 35 65 L 25 75 L 35 85 L 25 95 L 30 100 L 30 110" stroke="#34d399" stroke-width="2" fill="none" stroke-linejoin="round" />
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
                
                <!-- A Tierra -->
                <path d="M 15 150 L 15 155" stroke="#64748b" stroke-width="2" fill="none" />
                <path d="M 5 155 L 25 155 M 10 158 L 20 158" stroke="#64748b" stroke-width="2" fill="none" />
                <text x="50" y="145" fill="#a1a1aa" font-size="10" font-family="monospace">Pared Aluminio</text>
              </svg>
            </div>
          </div>
        </section>

        <hr class="border-neo-grid" />

        <!-- SECTION 3: CONCLUSIÓN TÉCNICA -->
        <section class="bg-neo-purple/10 border border-neo-purple/30 rounded-lg p-5 mt-4">
          <h3 class="text-neo-purple font-bold font-mono mb-2 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Conclusión Técnica
          </h3>
          <p class="text-sm text-neo-gray leading-relaxed">
            Los resultados obtenidos demuestran que el prototipo opera dentro de parámetros seguros de corriente y voltaje para el microcontrolador ESP32. La implementación de resistencias limitadoras (220Ω) y de Pull-up (10kΩ) permitió estabilizar las señales eléctricas, reducir severamente las interferencias electromagnéticas y garantizar una detección precisa de los contactos físicos en el laberinto de aluminio.
          </p>
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