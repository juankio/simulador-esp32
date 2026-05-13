import { useCircuitStore } from '~/stores/circuit'

export const useRouting = () => {
  const store = useCircuitStore()

  const getPinGlobalCoords = (nodeId: string) => {
    // 1. ESP32
    let pin = store.esp32.pins.find(p => p.id === nodeId)
    if (pin) return { x: store.esp32.x + pin.x, y: store.esp32.y + pin.y }

    // 2. Breadboard
    if (nodeId.startsWith('bb_')) {
      const bbX = store.breadboard.x
      const bbY = store.breadboard.y

      if (nodeId.startsWith('bb_vcc_')) {
        const idx = parseInt(nodeId.replace('bb_vcc_', ''))
        return { x: bbX + 15, y: bbY + 15 + (idx * 15) }
      }
      if (nodeId.startsWith('bb_gnd_')) {
        const idx = parseInt(nodeId.replace('bb_gnd_', ''))
        return { x: bbX + 40, y: bbY + 15 + (idx * 15) }
      }
      
      if (nodeId === 'bb_vcc') return { x: bbX + 15, y: bbY + 150 }
      if (nodeId === 'bb_gnd') return { x: bbX + 40, y: bbY + 150 }

      const rowMatchFull = nodeId.match(/bb_r(\d+)_(\d+)/)
      if (rowMatchFull) {
         const rowIdx = parseInt(rowMatchFull[1])
         const colIdx = parseInt(rowMatchFull[2])
         return { x: bbX + 65 + (colIdx * 7), y: bbY + 10 + rowIdx*19 }
      }

      const rowMatch = nodeId.match(/bb_r(\d+)/)
      if (rowMatch) {
         const rowIdx = parseInt(rowMatch[1])
         return { x: bbX + 80, y: bbY + 10 + rowIdx*19 }
      }
    }

    // 3. LCD
    pin = store.lcd.pins.find(p => p.id === nodeId)
    if (pin) return { x: store.lcd.x + pin.x, y: store.lcd.y - 8 }

    // 4. LEDs
    for (const led of store.leds) {
      if (nodeId === led.anode.id) return { x: led.x + led.anode.x, y: led.y + led.anode.y }
      if (nodeId === led.cathode.id) return { x: led.x + led.cathode.x, y: led.y + led.cathode.y }
    }

    // 4.5. LED Resistors
    for (const res of store.ledResistors) {
      if (nodeId === res.p1.id) return { x: res.x + res.p1.x, y: res.y + res.p1.y }
      if (nodeId === res.p2.id) return { x: res.x + res.p2.x, y: res.y + res.p2.y }
    }

    // 5. Buttons
    if (nodeId === store.btnStart.p1.id) return { x: store.btnStart.x + store.btnStart.p1.x, y: store.btnStart.y + store.btnStart.p1.y }
    if (nodeId === store.btnStart.p2.id) return { x: store.btnStart.x + store.btnStart.p2.x, y: store.btnStart.y + store.btnStart.p2.y }

    if (store.btnFinish) {
      if (nodeId === store.btnFinish.p1.id) return { x: store.btnFinish.x + store.btnFinish.p1.x, y: store.btnFinish.y + store.btnFinish.p1.y }
      if (nodeId === store.btnFinish.p2.id) return { x: store.btnFinish.x + store.btnFinish.p2.x, y: store.btnFinish.y + store.btnFinish.p2.y }
    }

    // 6. Wall Sensor
    if (nodeId === store.wallSensor.pin.id) return { x: store.wallSensor.x + store.wallSensor.pin.x, y: store.wallSensor.y + store.wallSensor.pin.y }

    // 7. Resistor
    if (nodeId === store.resistor.p1.id) return { x: store.resistor.x + store.resistor.p1.x, y: store.resistor.y + store.resistor.p1.y }
    if (nodeId === store.resistor.p2.id) return { x: store.resistor.x + store.resistor.p2.x, y: store.resistor.y + store.resistor.p2.y }

    console.warn(`Pin no encontrado: ${nodeId}`)
    return { x: 0, y: 0 }
  }

  const getBezierPath = (wire: any) => {
    const p1 = getPinGlobalCoords(wire.fromNode)
    const p2 = getPinGlobalCoords(wire.toNode)
    
    const dx = Math.abs(p2.x - p1.x)
    const dy = Math.abs(p2.y - p1.y)
    
    // Distancia euclidiana para escalar la curva
    const dist = Math.sqrt(dx*dx + dy*dy)
    
    // Suavidad de la curva
    const offset = Math.max(40, dist * 0.4)
    
    // Si p1 está más a la izquierda, flujo natural de Izquierda a Derecha
    if (p1.x < p2.x) {
      return `M ${p1.x} ${p1.y} C ${p1.x + offset} ${p1.y}, ${p2.x - offset} ${p2.y}, ${p2.x} ${p2.y}`
    } else {
      // Si están invertidos, simular gravedad/caída para que el cable cuelgue y no se enrolle sobre los pines
      return `M ${p1.x} ${p1.y} C ${p1.x} ${p1.y + offset + 50}, ${p2.x} ${p2.y + offset + 50}, ${p2.x} ${p2.y}`
    }
  }

  return {
    getPinGlobalCoords,
    getBezierPath
  }
}
