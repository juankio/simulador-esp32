import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface PinDef {
  id: string
  label: string
  x: number
  y: number
  type: 'io' | 'gnd' | 'vcc' | '5v' | '3v3' | 'sda' | 'scl'
  state: number // 0 = LOW, 1 = HIGH
}

export interface WireDef {
  id: string
  fromNode: string
  toNode: string
  color: string
  net: string
  name: string
}

export const useCircuitStore = defineStore('circuit', () => {
  const isSimulating = ref(false)
  
  // ============================
  // GENERAR PINES DEL ESP32 (30 PINES)
  // ============================
  const leftLabels = ['EN', 'VP', 'VN', 'D34', 'D35', 'D32', 'D33', 'D25', 'D26', 'D27', 'D14', 'D12', 'D13', 'GND_L', 'VIN']
  const rightLabels = ['D23', 'D22', 'TX', 'RX', 'D21', 'D19', 'D18', 'D5', 'TX2', 'RX2', 'D4', 'D2', 'D15', 'GND_R', '3V3']
  
  const generatePins = () => {
    const pins: PinDef[] = []
    leftLabels.forEach((lbl, i) => {
      let t = 'io'; if (lbl === 'VIN') t = '5v'; if (lbl === 'GND_L') t = 'gnd';
      pins.push({ id: `esp_${lbl.toLowerCase()}`, label: lbl, x: 10, y: 35 + i * 16, type: t as any, state: 0 })
    })
    rightLabels.forEach((lbl, i) => {
      let t = 'io'; if (lbl === '3V3') t = '3v3'; if (lbl === 'GND_R') t = 'gnd';
      if (lbl === 'D21') t = 'sda'; if (lbl === 'D22') t = 'scl';
      pins.push({ id: `esp_${lbl.toLowerCase()}`, label: lbl, x: 110, y: 35 + i * 16, type: t as any, state: 0 })
    })
    return pins
  }

  // ============================
  // ESTADO DE HARDWARE
  // ============================
  
  const esp32 = ref({
    x: 50,
    y: 100,
    pins: generatePins()
  })

  const breadboard = ref({
    x: 250,
    y: 85
  })

  const lcd = ref({
    id: 'lcd1',
    x: 550,
    y: 0,
    pins: [
      { id: 'lcd_gnd', label: 'GND', x: 20, y: 10, type: 'gnd', state: 0 },
      { id: 'lcd_vcc', label: 'VCC', x: 40, y: 10, type: 'vcc', state: 0 },
      { id: 'lcd_sda', label: 'SDA', x: 60, y: 10, type: 'sda', state: 0 },
      { id: 'lcd_scl', label: 'SCL', x: 80, y: 10, type: 'scl', state: 0 }
    ],
    backlightOn: false,
    text: '',
    errorLowVoltage: false
  })

  const wallSensor = ref({
    id: 'wall1',
    x: 550,
    y: 150,
    pin: { id: 'wall_out', label: 'METAL', x: 80, y: 40, type: 'io', state: 0 },
    isTouched: false,
    glitching: false
  })

  const resistor = ref({
    id: 'res1',
    x: 550,
    y: 280,
    p1: { id: 'res1_p1', label: '', x: 0, y: 10, type: 'io', state: 0 },
    p2: { id: 'res1_p2', label: '', x: 60, y: 10, type: 'io', state: 0 }
  })

  // Nuevos componentes del juego del Laberinto
  const leds = ref([
    { id: 'led_r1', x: 750, y: 150, anode: { id: 'led_r1_a', x: 20, y: 20, type: 'io' }, cathode: { id: 'led_r1_c', x: 60, y: 20, type: 'gnd' }, isOn: false, color: 'red' },
    { id: 'led_r2', x: 750, y: 220, anode: { id: 'led_r2_a', x: 20, y: 20, type: 'io' }, cathode: { id: 'led_r2_c', x: 60, y: 20, type: 'gnd' }, isOn: false, color: 'red' },
    { id: 'led_r3', x: 750, y: 290, anode: { id: 'led_r3_a', x: 20, y: 20, type: 'io' }, cathode: { id: 'led_r3_c', x: 60, y: 20, type: 'gnd' }, isOn: false, color: 'red' },
    { id: 'led_g1', x: 750, y: 360, anode: { id: 'led_g1_a', x: 20, y: 20, type: 'io' }, cathode: { id: 'led_g1_c', x: 60, y: 20, type: 'gnd' }, isOn: false, color: 'green' }
  ])

  const btnStart = ref({
    id: 'btn1',
    x: 750,
    y: 430,
    p1: { id: 'btn1_p1', x: 0, y: 20, type: 'io' },
    p2: { id: 'btn1_p2', x: 40, y: 20, type: 'gnd' },
    isPressed: false
  })

  const btnFinish = ref({
    id: 'btn2',
    x: 750,
    y: 520,
    p1: { id: 'btn2_p1', x: 0, y: 20, type: 'io' },
    p2: { id: 'btn2_p2', x: 40, y: 20, type: 'gnd' },
    isPressed: false
  })

  const ledResistors = ref([
    { id: 'res_r1', x: 700, y: 150, p1: { id: 'res_r1_p1', label: '', x: 0, y: 10, type: 'io', state: 0 }, p2: { id: 'res_r1_p2', label: '', x: 40, y: 10, type: 'io', state: 0 } },
    { id: 'res_r2', x: 700, y: 220, p1: { id: 'res_r2_p1', label: '', x: 0, y: 10, type: 'io', state: 0 }, p2: { id: 'res_r2_p2', label: '', x: 40, y: 10, type: 'io', state: 0 } },
    { id: 'res_r3', x: 700, y: 290, p1: { id: 'res_r3_p1', label: '', x: 0, y: 10, type: 'io', state: 0 }, p2: { id: 'res_r3_p2', label: '', x: 40, y: 10, type: 'io', state: 0 } },
    { id: 'res_g1', x: 700, y: 360, p1: { id: 'res_g1_p1', label: '', x: 0, y: 10, type: 'io', state: 0 }, p2: { id: 'res_g1_p2', label: '', x: 40, y: 10, type: 'io', state: 0 } }
  ])

  // Eliminar led obsoleto
  const led = ref({
    id: 'led1',
    x: -9999, y: -9999, // hide old led
    anode: { id: 'led1_anode', label: 'A', x: 20, y: 20, type: 'io', state: 0 },
    cathode: { id: 'led1_cathode', label: 'C', x: 60, y: 20, type: 'gnd', state: 0 },
    isOn: false
  })

  const wires = ref<WireDef[]>([])

  const fixLcdVoltage = ref(true)
  const fixSensorPullup = ref(true)

  // ============================
  // HOVER / TOOLTIP STATE
  // ============================
  const hoveredNet = ref<string | null>(null)
  const hoveredName = ref<string>('')
  const hoverPos = ref({ x: 0, y: 0 })

  const setHoveredNet = (net: string, name: string, event: MouseEvent) => {
    hoveredNet.value = net
    hoveredName.value = name
    hoverPos.value = { x: event.clientX, y: event.clientY }
  }

  const updateHoverPos = (event: MouseEvent) => {
    if (hoveredNet.value) {
      hoverPos.value = { x: event.clientX, y: event.clientY }
    }
  }

  const clearHoveredNet = () => {
    hoveredNet.value = null
  }

  const updateWires = () => {
    wires.value = [
      // PODER ESP32 -> Protoboard
      { id: 'w_pwr_5v', fromNode: 'esp_vin', toNode: 'bb_vcc_2', color: '#ef4444', net: 'VCC_5V', name: 'Alimentación 5V Principal (VIN)' },
      { id: 'w_pwr_3v3', fromNode: 'esp_3v3', toNode: 'bb_r1_1', color: '#ef4444', net: 'VCC_3V3', name: 'Alimentación Lógica 3.3V' }, 
      { id: 'w_pwr_gnd', fromNode: 'esp_gnd_r', toNode: 'bb_gnd_2', color: '#64748b', net: 'GND', name: 'Tierra Común (GND)' },

      // BOTON DE INICIO (Conectado a D19)
      { id: 'w_d19_bb', fromNode: 'esp_d19', toNode: 'bb_r2_1', color: '#f97316', net: 'SIG_BTN_START', name: 'Señal Botón START (Pin 19)' },
      { id: 'w_bb_btn_p1', fromNode: 'bb_r2_2', toNode: 'btn1_p1', color: '#f97316', net: 'SIG_BTN_START', name: 'Señal Botón START (Pin 19)' },
      { id: 'w_bb_btn_p2', fromNode: 'bb_gnd_3', toNode: 'btn1_p2', color: '#64748b', net: 'GND', name: 'Tierra Común (GND)' },

      // BOTON DE META/FINISH (Conectado a D15)
      { id: 'w_d15_bb', fromNode: 'esp_d15', toNode: 'bb_r6_1', color: '#38bdf8', net: 'SIG_BTN_FINISH', name: 'Señal Botón FINISH (Pin 15)' },
      { id: 'w_bb_btn2_p1', fromNode: 'bb_r6_2', toNode: 'btn2_p1', color: '#38bdf8', net: 'SIG_BTN_FINISH', name: 'Señal Botón FINISH (Pin 15)' },
      { id: 'w_bb_btn2_p2', fromNode: 'bb_gnd_4', toNode: 'btn2_p2', color: '#64748b', net: 'GND', name: 'Tierra Común (GND)' },

      // LEDS DE VIDAS (Rojos a D2, D4, D5)
      { id: 'w_d2_bb', fromNode: 'esp_d2', toNode: 'bb_r10_1', color: '#ef4444', net: 'SIG_LED_1', name: 'Energía Vida 1 (Pin 2)' },
      { id: 'w_bb_res_r1', fromNode: 'bb_r10_2', toNode: 'res_r1_p1', color: '#ef4444', net: 'SIG_LED_1', name: 'Energía Vida 1 (Pin 2)' },
      { id: 'w_res_r1_l1', fromNode: 'res_r1_p2', toNode: 'led_r1_a', color: '#ef4444', net: 'SIG_LED_1', name: 'Energía Vida 1 (Pin 2)' },
      { id: 'w_bb_l1_c', fromNode: 'bb_gnd_5', toNode: 'led_r1_c', color: '#64748b', net: 'GND', name: 'Tierra Común (GND)' },

      { id: 'w_d4_bb', fromNode: 'esp_d4', toNode: 'bb_r11_1', color: '#ef4444', net: 'SIG_LED_2', name: 'Energía Vida 2 (Pin 4)' },
      { id: 'w_bb_res_r2', fromNode: 'bb_r11_2', toNode: 'res_r2_p1', color: '#ef4444', net: 'SIG_LED_2', name: 'Energía Vida 2 (Pin 4)' },
      { id: 'w_res_r2_l2', fromNode: 'res_r2_p2', toNode: 'led_r2_a', color: '#ef4444', net: 'SIG_LED_2', name: 'Energía Vida 2 (Pin 4)' },
      { id: 'w_bb_l2_c', fromNode: 'bb_gnd_6', toNode: 'led_r2_c', color: '#64748b', net: 'GND', name: 'Tierra Común (GND)' },

      { id: 'w_d5_bb', fromNode: 'esp_d5', toNode: 'bb_r12_1', color: '#ef4444', net: 'SIG_LED_3', name: 'Energía Vida 3 (Pin 5)' },
      { id: 'w_bb_res_r3', fromNode: 'bb_r12_2', toNode: 'res_r3_p1', color: '#ef4444', net: 'SIG_LED_3', name: 'Energía Vida 3 (Pin 5)' },
      { id: 'w_res_r3_l3', fromNode: 'res_r3_p2', toNode: 'led_r3_a', color: '#ef4444', net: 'SIG_LED_3', name: 'Energía Vida 3 (Pin 5)' },
      { id: 'w_bb_l3_c', fromNode: 'bb_gnd_7', toNode: 'led_r3_c', color: '#64748b', net: 'GND', name: 'Tierra Común (GND)' },

      // LED DE EXITO (Verde a D18)
      { id: 'w_d18_bb', fromNode: 'esp_d18', toNode: 'bb_r14_1', color: '#22c55e', net: 'SIG_LED_G', name: 'Energía Éxito (Pin 18)' },
      { id: 'w_bb_res_g1', fromNode: 'bb_r14_2', toNode: 'res_g1_p1', color: '#22c55e', net: 'SIG_LED_G', name: 'Energía Éxito (Pin 18)' },
      { id: 'w_res_g1_lg', fromNode: 'res_g1_p2', toNode: 'led_g1_a', color: '#22c55e', net: 'SIG_LED_G', name: 'Energía Éxito (Pin 18)' },
      { id: 'w_bb_lg_c', fromNode: 'bb_gnd_8', toNode: 'led_g1_c', color: '#64748b', net: 'GND', name: 'Tierra Común (GND)' },

      // LCD
      { id: 'w_d21_bb', fromNode: 'esp_d21', toNode: 'bb_r3_1', color: '#38bdf8', net: 'I2C_SDA', name: 'Bus I2C (Datos SDA)' },
      { id: 'w_bb_lcd_sda', fromNode: 'bb_r3_2', toNode: 'lcd_sda', color: '#38bdf8', net: 'I2C_SDA', name: 'Bus I2C (Datos SDA)' },
      { id: 'w_d22_bb', fromNode: 'esp_d22', toNode: 'bb_r4_1', color: '#facc15', net: 'I2C_SCL', name: 'Bus I2C (Reloj SCL)' },
      { id: 'w_bb_lcd_scl', fromNode: 'bb_r4_2', toNode: 'lcd_scl', color: '#facc15', net: 'I2C_SCL', name: 'Bus I2C (Reloj SCL)' },
      { id: 'w_lcd_gnd', fromNode: 'bb_gnd_9', toNode: 'lcd_gnd', color: '#64748b', net: 'GND', name: 'Tierra Común (GND)' },

      // SENSOR ALUMINIO + RESISTENCIA
      { id: 'w_d13_bb', fromNode: 'esp_d13', toNode: 'bb_r7_1', color: '#34d399', net: 'SIG_ALUMINIO', name: 'Sensor de Choque (Pin 13)' },
      { id: 'w_bb_wall', fromNode: 'bb_r7_2', toNode: 'wall_out', color: '#34d399', net: 'SIG_ALUMINIO', name: 'Sensor de Choque (Pin 13)' }
    ]

    if (fixLcdVoltage.value) {
      wires.value.push({ id: 'w_vin_bb', fromNode: 'esp_vin', toNode: 'bb_r5_1', color: '#ef4444', net: 'VCC_5V', name: 'Alimentación 5V Principal (VIN)' })
      wires.value.push({ id: 'w_bb_lcd_vcc', fromNode: 'bb_r5_2', toNode: 'lcd_vcc', color: '#ef4444', net: 'VCC_5V', name: 'Alimentación 5V Principal (VIN)' })
    } else {
      wires.value.push({ id: 'w_bb_lcd_vcc', fromNode: 'bb_vcc_10', toNode: 'lcd_vcc', color: '#ef4444', net: 'VCC_3V3', name: 'ERROR: Pantalla subalimentada (3.3V)' })
    }

    if (fixSensorPullup.value) {
      wires.value.push({ id: 'w_bb_res1', fromNode: 'bb_r1_3', toNode: 'res1_p1', color: '#ef4444', net: 'VCC_3V3', name: 'Alimentación Lógica 3.3V' })
      wires.value.push({ id: 'w_res2_bb', fromNode: 'res1_p2', toNode: 'bb_r7_3', color: '#34d399', net: 'SIG_ALUMINIO', name: 'Pull-up de Estabilidad' })
    }

    if(isSimulating.value) {
      stopSimulation()
      setTimeout(() => startSimulation({ lcdTo3V3: !fixLcdVoltage.value, lcdTo5V: fixLcdVoltage.value, hasHardPullup: fixSensorPullup.value }), 50)
    }
  }

  // ============================
  // MOTOR LÓGICO
  // ============================
  const motorInterval = ref<any>(null)
  const noiseInterval = ref<any>(null)
  const mazeSimInterval = ref<any>(null)
  
  // ============================
  // GEMELO DIGITAL (Web Serial API)
  // ============================
  const isDigitalTwinActive = ref(false)
  const mazeData = ref({
    time: 0,
    errors: 0,
    crash: false,
    state: 'IDLE', // IDLE, RUNNING, GAMEOVER, WIN
    lives: 3
  })

  // Watchdog temporal (Si no llegan heartbeats de la placa, asumimos desconexión o fallo)
  const lastHeartbeat = ref(0)
  const twinStatus = ref<'OK' | 'DISCONNECTED' | 'ERROR'>('DISCONNECTED')

  const updateLEDsVisual = () => {
    // Apagar todos por defecto
    leds.value.forEach(l => l.isOn = false)
    
    if (mazeData.value.state === 'GAMEOVER') {
      // Todo apagado, o podríamos hacer parpadear algo. Lo dejamos apagado.
      return
    }
    
    if (mazeData.value.state === 'WIN') {
      leds.value[3].isOn = true // Solo Verde encendido
      return
    }

    // Modo IDLE o RUNNING, mostrar vidas actuales
    if (mazeData.value.lives >= 1) leds.value[0].isOn = true
    if (mazeData.value.lives >= 2) leds.value[1].isOn = true
    if (mazeData.value.lives >= 3) leds.value[2].isOn = true
  }

  const handleSerialData = (data: any) => {
    lastHeartbeat.value = Date.now()
    twinStatus.value = 'OK'
    
    // Si viene heartbeat básico
    if (data.heartbeat) return

    // Datos del laberinto (Serial JSON)
    if (data.t !== undefined) mazeData.value.time = data.t
    if (data.e !== undefined) mazeData.value.errors = data.e
    if (data.l !== undefined) mazeData.value.lives = data.l
    if (data.s !== undefined) mazeData.value.state = data.s

    if (data.c !== undefined) {
      mazeData.value.crash = data.c
      wallSensor.value.isTouched = data.c
      
      if (data.c) {
        wallSensor.value.glitching = true 
        lcd.value.text = '>> CHOQUE REAL <<'
      } else {
        wallSensor.value.glitching = false
        lcd.value.text = data.m || `T:${(mazeData.value.time/1000).toFixed(1)}s L:${mazeData.value.lives}`
      }
    }
    
    updateLEDsVisual()
  }

  const startDigitalTwin = () => {
    isDigitalTwinActive.value = true
    isSimulating.value = true // Activa los pulsos láser de SVG
    lcd.value.backlightOn = true
    lcd.value.errorLowVoltage = false
    lcd.value.text = 'ESPERANDO USB...'
    twinStatus.value = 'OK'
    
    // Watchdog
    noiseInterval.value = setInterval(() => {
      if (Date.now() - lastHeartbeat.value > 2000) {
        twinStatus.value = 'ERROR'
        lcd.value.text = 'NO SERIAL DATA'
        wallSensor.value.glitching = false
      }
    }, 1000)
  }

  const stopDigitalTwin = () => {
    isDigitalTwinActive.value = false
    twinStatus.value = 'DISCONNECTED'
    if (noiseInterval.value) clearInterval(noiseInterval.value)
    stopSimulation()
  }
  
  const isConnected = (nodeA: string, nodeB: string) => {
    // Para simplificar el prototipo, asumimos conexiones directas en pinia 
    // (aunque visualmente pasen por la protoboard, el motor las busca si están enrutadas)
    // Para ser precisos, en este update comprobamos si A y B están de alguna forma unidos.
    return true // Reemplazaremos la validación en updateWires para simplificar
  }

  const startSimulation = (mockState: any) => {
    isSimulating.value = true
    
    // Evaluamos estado desde app.vue que conoce las reglas
    if (mockState.lcdTo3V3 || mockState.lcdTo5V) lcd.value.backlightOn = true
    
    // Resetear datos simulados del laberinto
    mazeData.value.time = 0
    mazeData.value.errors = 0
    mazeData.value.lives = 3
    mazeData.value.crash = false
    mazeData.value.state = 'IDLE'

    updateLEDsVisual()

    if (mockState.lcdTo3V3) {
      lcd.value.errorLowVoltage = true
      lcd.value.text = '' 
    } else if (mockState.lcdTo5V) {
      lcd.value.errorLowVoltage = false
      lcd.value.text = `PRESS START`
    }

    if (!mockState.hasHardPullup) {
      wallSensor.value.glitching = true
      noiseInterval.value = setInterval(() => {
         if (!wallSensor.value.isTouched && Math.random() > 0.7) {
            lcd.value.text = lcd.value.errorLowVoltage ? '' : '⚠ RUIDO FANTASMA'
         } else if (!wallSensor.value.isTouched && !lcd.value.errorLowVoltage && mockState.lcdTo5V) {
            lcd.value.text = mazeData.value.state === 'RUNNING' ? `T:${(mazeData.value.time/1000).toFixed(1)}s L:${mazeData.value.lives}` : 'PRESS START'
         }
      }, 800)
    }

    // Cronómetro Virtual (Simulando millis() del ESP32)
    mazeSimInterval.value = setInterval(() => {
      if (mazeData.value.state === 'RUNNING') {
         mazeData.value.time += 100 // Incrementa 100ms
         // Actualizar LCD si no hay errores eléctricos
         if (!lcd.value.errorLowVoltage && mockState.lcdTo5V && !wallSensor.value.isTouched && !wallSensor.value.glitching) {
            lcd.value.text = `T:${(mazeData.value.time/1000).toFixed(1)}s L:${mazeData.value.lives}`
         }
      }
    }, 100)
  }

  const stopSimulation = () => {
    isSimulating.value = false
    if (motorInterval.value) clearInterval(motorInterval.value)
    if (noiseInterval.value) clearInterval(noiseInterval.value)
    if (mazeSimInterval.value) clearInterval(mazeSimInterval.value)
    
    motorInterval.value = null
    noiseInterval.value = null
    mazeSimInterval.value = null
    
    leds.value.forEach(l => l.isOn = false)
    lcd.value.backlightOn = false
    lcd.value.text = ''
    lcd.value.errorLowVoltage = false
    wallSensor.value.glitching = false
    mazeData.value.time = 0
    mazeData.value.errors = 0
    mazeData.value.lives = 3
    mazeData.value.state = 'IDLE'
  }

  const triggerWallTouch = (state: boolean) => {
    if (!isSimulating.value) return
    wallSensor.value.isTouched = state
    
    if (!isDigitalTwinActive.value) {
      if (mazeData.value.state !== 'RUNNING') return

      mazeData.value.crash = state
      
      if (state) { // Chocó
        mazeData.value.errors += 1
        mazeData.value.lives -= 1
        updateLEDsVisual()
        
        if (mazeData.value.lives <= 0) {
           mazeData.value.state = 'GAMEOVER'
           if (!lcd.value.errorLowVoltage) lcd.value.text = 'GAME OVER'
        } else {
           if (!lcd.value.errorLowVoltage) lcd.value.text = '>> CHOQUE <<'
        }
      } else { // Soltó
        if (mazeData.value.state === 'RUNNING') {
          if (!lcd.value.errorLowVoltage) lcd.value.text = `T:${(mazeData.value.time/1000).toFixed(1)}s L:${mazeData.value.lives}`
        }
      }
    }
  }

  const triggerButton = (state: boolean, isFinish: boolean = false) => {
    if (!isSimulating.value) return
    
    if (isFinish) {
      btnFinish.value.isPressed = state
      if (state && !isDigitalTwinActive.value && mazeData.value.state === 'RUNNING') {
        mazeData.value.state = 'WIN'
        updateLEDsVisual()
        if (!lcd.value.errorLowVoltage) lcd.value.text = `WIN! T:${(mazeData.value.time/1000).toFixed(1)}s`
      }
      return
    }

    // Default: Start Button
    btnStart.value.isPressed = state
    
    if (state && !isDigitalTwinActive.value) {
      // Toggle logic: If game is running or win/gameover, reset to idle
      if (mazeData.value.state !== 'IDLE') {
        mazeData.value.state = 'IDLE'
        mazeData.value.time = 0
        updateLEDsVisual()
        if (!lcd.value.errorLowVoltage) lcd.value.text = `PRESS START`
      } else {
        // Start the game
        mazeData.value.state = 'RUNNING'
        mazeData.value.time = 0
        mazeData.value.errors = 0
        mazeData.value.lives = 3
        updateLEDsVisual()
        if (!lcd.value.errorLowVoltage) lcd.value.text = `T:0.0s L:3`
      }
    }
  }

  return {
    isSimulating,
    esp32,
    breadboard,
    lcd,
    wallSensor,
    resistor,
    ledResistors,
    leds,
    btnStart,
    btnFinish,
    wires,
    fixLcdVoltage,
    fixSensorPullup,
    updateWires,
    startSimulation,
    stopSimulation,
    isDigitalTwinActive,
    mazeData,
    twinStatus,
    hoveredNet,
    hoveredName,
    hoverPos,
    setHoveredNet,
    updateHoverPos,
    clearHoveredNet,
    startDigitalTwin,
    stopDigitalTwin,
    handleSerialData,
    triggerWallTouch,
    triggerButton
  }
})
