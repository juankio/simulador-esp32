<template>
  <aside class="w-full md:w-[400px] lg:w-[500px] h-[45vh] md:h-full border-b md:border-r md:border-b-0 border-neo-grid bg-[#0b1121] flex flex-col z-20 shadow-2xl flex-shrink-0">
    <div class="p-4 border-b border-neo-grid flex flex-col gap-3">
      <div class="flex justify-between items-center">
        <h1 class="text-neo-blue font-mono font-bold tracking-widest text-sm flex items-center gap-2">
          <img src="/favicon.svg" alt="Logo" class="w-5 h-5 drop-shadow-[0_0_5px_#a855f7]" />
          <span><span class="text-white">FÍSICA MAGNÉTICA</span> | NEON</span>
        </h1>
        
        <div class="flex gap-2">
          <!-- Mock Simulation Button -->
          <button 
            @click="store.isSimulating && !store.isDigitalTwinActive ? store.stopSimulation() : store.startSimulation({ lcdTo3V3: !store.fixLcdVoltage, lcdTo5V: store.fixLcdVoltage, hasHardPullup: store.fixSensorPullup })"
            class="px-4 py-1.5 rounded text-xs font-bold tracking-wider transition-all duration-300 uppercase"
            :class="store.isSimulating && !store.isDigitalTwinActive ? 'bg-neo-red/20 text-neo-red border border-neo-red hover:bg-neo-red/30' : 'bg-neo-gray/20 text-neo-gray border border-neo-gray hover:bg-neo-gray/30 hover:text-white'"
            :disabled="store.isDigitalTwinActive"
          >
            {{ store.isSimulating && !store.isDigitalTwinActive ? 'Stop' : 'Run Code' }}
          </button>

          <!-- USB Connect Button -->
          <ClientOnly>
            <button 
              v-if="serial.isSupported.value"
              @click="toggleSerialConnection"
              class="px-4 py-1.5 rounded text-xs font-bold tracking-wider transition-all duration-300 uppercase flex items-center gap-2"
              :class="serial.isConnected.value ? 'bg-neo-purple/20 text-neo-purple border border-neo-purple' : 'bg-neo-blue/20 text-neo-blue border border-neo-blue hover:bg-neo-blue/30'"
            >
              <span v-if="serial.isConnected.value" class="w-2 h-2 rounded-full bg-neo-purple animate-pulse"></span>
              {{ serial.isConnected.value ? 'Disconnect USB' : '🔌 Connect Hardware' }}
            </button>
            <div v-else class="text-neo-red text-xs mt-2">Web Serial Not Supported</div>
          </ClientOnly>
        </div>
      </div>
      
      <!-- Simulation / Digital Twin Status Panel -->
      <div v-if="store.isSimulating" class="p-3 bg-[#141d2f] border rounded text-xs font-mono text-white flex flex-col gap-2 transition-colors duration-300"
           :class="store.isDigitalTwinActive ? 'border-neo-purple/50' : 'border-neo-blue/50'">
        <div class="flex justify-between">
          <span :class="store.isDigitalTwinActive ? 'text-neo-purple' : 'text-neo-blue'" class="font-bold">
            {{ store.isDigitalTwinActive ? 'DIGITAL TWIN STATUS:' : 'MOCK SIMULATION:' }}
          </span>
          <span v-if="store.isDigitalTwinActive" :class="{'text-neo-red': store.twinStatus === 'ERROR', 'text-green-400': store.twinStatus === 'OK'}">
            {{ store.twinStatus }}
          </span>
          <span v-else class="text-neo-blue animate-pulse">RUNNING</span>
        </div>
        <div class="grid grid-cols-2 gap-2 mt-1">
          <div class="bg-black/30 p-2 rounded border border-neo-grid">
            <span class="text-neo-gray text-[10px] block">CRONÓMETRO</span>
            <span class="text-neo-blue text-lg">{{ (store.mazeData.time / 1000).toFixed(1) }}s</span>
          </div>
          <div class="bg-black/30 p-2 rounded border border-neo-grid">
            <span class="text-neo-gray text-[10px] block">ERRORES (GAUSS)</span>
            <span class="text-neo-red text-lg">{{ store.mazeData.errors }}</span>
          </div>
        </div>
        <p class="text-[9px] text-neo-gray mt-1">
          {{ store.isDigitalTwinActive ? '*La web reacciona en tiempo real a los eventos electromagnéticos de la placa USB.' : '*Modo Simulación Virtual. Clic en el ALUMINIO para simular un choque.' }}
        </p>
      </div>
      
      <div v-else class="p-2 bg-neo-bg border border-neo-grid rounded text-[10px] text-neo-gray">
        Conecta el ESP32 por USB o usa el botón "Run Code" para simulación virtual.
      </div>
      
      <!-- Interactive Controls for solving the bugs -->
      <div class="p-3 bg-[#0f172a] border border-neo-grid rounded text-xs font-mono text-neo-gray space-y-2">
        <div class="flex justify-between items-center mb-1">
          <p class="text-white font-bold">🛠 Hardware Fixer Panel</p>
          <button @click="$emit('open-diagrams')" class="text-[10px] bg-neo-purple/20 text-neo-purple px-2 py-0.5 rounded border border-neo-purple hover:bg-neo-purple/40 transition-colors">
            Ver Diagramas y Leyes
          </button>
        </div>
        <label class="flex items-center gap-2 cursor-pointer hover:text-neo-blue transition-colors">
          <input type="checkbox" v-model="store.fixLcdVoltage" @change="store.updateWires" class="accent-neo-blue">
          <span>Fix LCD: Move VCC wire from 3.3V to 5V (VIN)</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer hover:text-neo-blue transition-colors">
          <input type="checkbox" v-model="store.fixSensorPullup" @change="store.updateWires" class="accent-neo-blue">
          <span>Fix Sensor: Add 10k Resistor between 3.3V and D13</span>
        </label>
      </div>
    </div>
    
    <!-- C++ Code Template -->
    <div class="flex-1 p-4 relative">
      <div class="absolute top-2 right-6 text-xs text-neo-gray font-mono">maze_digital_twin.ino</div>
      <textarea 
        :value="code"
        class="w-full h-full bg-transparent text-gray-300 font-mono text-[12px] resize-none outline-none leading-relaxed"
        spellcheck="false"
        readonly
      ></textarea>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useCircuitStore } from '~/stores/circuit'
import { useSerialConnection } from '~/composables/useSerialConnection'

const store = useCircuitStore()
const serial = useSerialConnection()

const emit = defineEmits<{
  (e: 'toast', message: string, type: string): void
  (e: 'open-diagrams'): void
}>()

const toggleSerialConnection = async () => {
  if (serial.isConnected.value) {
    await serial.disconnect()
    store.stopDigitalTwin()
  } else {
    const success = await serial.connect()
    if (success) {
      store.startDigitalTwin()
      emit('toast', "Hardware conectado exitosamente", "success")
      serial.setOnData((json) => {
        store.handleSerialData(json)
      })
    } else {
      emit('toast', serial.serialError.value, "error")
    }
  }
}

const code = `// CÓDIGO FÍSICO PARA ESP32 (Gemelo Digital)
// Laberinto de Control Magnético
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

const int BTN_PIN = 19;
const int FINISH_PIN = 15;
const int WALL_PIN = 13;
const int LED_R1 = 2;
const int LED_R2 = 4;
const int LED_R3 = 5;
const int LED_G = 18;

unsigned long startTime = 0;
int errors = 0;
int lives = 3;
bool isCrashing = false;
String gameState = "IDLE"; // IDLE, RUNNING, GAMEOVER, WIN

void setup() {
  Serial.begin(115200); 
  
  pinMode(BTN_PIN, INPUT_PULLUP);
  pinMode(FINISH_PIN, INPUT_PULLUP);
  pinMode(WALL_PIN, INPUT_PULLUP); 
  pinMode(LED_R1, OUTPUT);
  pinMode(LED_R2, OUTPUT);
  pinMode(LED_R3, OUTPUT);
  pinMode(LED_G, OUTPUT);
  
  lcd.init();
  lcd.backlight();
  lcd.print("PRESS START");
}

void updateLEDs() {
  digitalWrite(LED_R1, lives >= 1 && gameState != "WIN" && gameState != "GAMEOVER" ? HIGH : LOW);
  digitalWrite(LED_R2, lives >= 2 && gameState != "WIN" && gameState != "GAMEOVER" ? HIGH : LOW);
  digitalWrite(LED_R3, lives >= 3 && gameState != "WIN" && gameState != "GAMEOVER" ? HIGH : LOW);
  digitalWrite(LED_G, gameState == "WIN" ? HIGH : LOW);
}

void loop() {
  bool btnPressed = (digitalRead(BTN_PIN) == LOW);
  bool finishPressed = (digitalRead(FINISH_PIN) == LOW);
  bool currentCrash = (digitalRead(WALL_PIN) == LOW);
  
  if (gameState == "IDLE" && btnPressed) {
     gameState = "RUNNING";
     startTime = millis();
     errors = 0;
     lives = 3;
     updateLEDs();
     delay(200); // Debounce
  } else if (gameState != "IDLE" && btnPressed) {
     // Reset game
     gameState = "IDLE";
     updateLEDs();
     delay(200);
  }

  unsigned long currentTime = (gameState == "RUNNING") ? (millis() - startTime) : 0;
  
  if (gameState == "RUNNING") {
    if(currentCrash && !isCrashing) {
       errors++;
       lives--;
       updateLEDs();
       if (lives <= 0) {
          gameState = "GAMEOVER";
       }
    } else if (finishPressed) {
       gameState = "WIN";
       updateLEDs();
    }
  }
  
  isCrashing = currentCrash;

  // Lógica Serial (Envío JSON)
  Serial.print("{\\"t\\":"); Serial.print(currentTime);
  Serial.print(",\\"e\\":"); Serial.print(errors);
  Serial.print(",\\"l\\":"); Serial.print(lives);
  Serial.print(",\\"s\\":\\""); Serial.print(gameState); Serial.print("\\"");
  Serial.print(",\\"c\\":"); Serial.print(isCrashing ? "true" : "false");
  Serial.println("}");

  delay(50);
}`
</script>