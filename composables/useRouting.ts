import { useCircuitStore } from '~/stores/circuit'

export const useRouting = () => {
  const store = useCircuitStore()

  const getPinGlobalCoords = (nodeId: string) => {
    // 1. ESP32
    let pin = store.esp32.pins.find(p => p.id === nodeId)
    if (pin) {
      const vx = pin.x < 60 ? -1 : 1
      return { x: store.esp32.x + pin.x, y: store.esp32.y + pin.y, vx, vy: 0 }
    }

    // 2. Breadboard
    if (nodeId.startsWith('bb_')) {
      const bbX = store.breadboard.x
      const bbY = store.breadboard.y

      if (nodeId.startsWith('bb_vcc_')) {
        const idx = parseInt(nodeId.replace('bb_vcc_', ''))
        return { x: bbX + 20, y: bbY + 10 + (idx * 19), vx: -1, vy: 0 }
      }
      if (nodeId.startsWith('bb_gnd_')) {
        const idx = parseInt(nodeId.replace('bb_gnd_', ''))
        return { x: bbX + 45, y: bbY + 10 + (idx * 19), vx: -1, vy: 0 }
      }
      
      if (nodeId === 'bb_vcc') return { x: bbX + 20, y: bbY + 10 + (10 * 19), vx: -1, vy: 0 }
      if (nodeId === 'bb_gnd') return { x: bbX + 45, y: bbY + 10 + (10 * 19), vx: -1, vy: 0 }

      const rowMatchFull = nodeId.match(/bb_r(\d+)_(\d+)/)
      if (rowMatchFull) {
         const rowIdx = parseInt(rowMatchFull[1])
         const colIdx = parseInt(rowMatchFull[2])
         let xOffset = 70
         let vx = -1
         if (colIdx === 1) xOffset = 70
         else if (colIdx === 2) xOffset = 80
         else if (colIdx === 3) xOffset = 90
         else if (colIdx === 4) { xOffset = 110; vx = 1 }
         else if (colIdx === 5) { xOffset = 120; vx = 1 }
         else if (colIdx === 6) { xOffset = 130; vx = 1 }
         
         return { x: bbX + xOffset, y: bbY + 10 + rowIdx*19, vx, vy: 0 }
      }

      const rowMatch = nodeId.match(/bb_r(\d+)/)
      if (rowMatch) {
         const rowIdx = parseInt(rowMatch[1])
         return { x: bbX + 80, y: bbY + 10 + rowIdx*19, vx: -1, vy: 0 }
      }
    }

    // 3. LCD
    pin = store.lcd.pins.find(p => p.id === nodeId)
    if (pin) return { x: store.lcd.x + pin.x, y: store.lcd.y - 8, vx: 0, vy: -1 }

    // 4. LEDs
    for (const led of store.leds) {
      if (nodeId === led.anode.id) return { x: led.x + led.anode.x, y: led.y + led.anode.y, vx: -1, vy: 0 }
      if (nodeId === led.cathode.id) return { x: led.x + led.cathode.x, y: led.y + led.cathode.y, vx: 1, vy: 0 }
    }

    // 4.5. LED Resistors
    for (const res of store.ledResistors) {
      if (nodeId === res.p1.id) return { x: res.x + res.p1.x, y: res.y + res.p1.y, vx: -1, vy: 0 }
      if (nodeId === res.p2.id) return { x: res.x + res.p2.x, y: res.y + res.p2.y, vx: 1, vy: 0 }
    }

    // 5. Buttons
    if (nodeId === store.btnStart.p1.id) return { x: store.btnStart.x + store.btnStart.p1.x, y: store.btnStart.y + store.btnStart.p1.y, vx: -1, vy: 0 }
    if (nodeId === store.btnStart.p2.id) return { x: store.btnStart.x + store.btnStart.p2.x, y: store.btnStart.y + store.btnStart.p2.y, vx: 1, vy: 0 }

    if (store.btnFinish) {
      if (nodeId === store.btnFinish.p1.id) return { x: store.btnFinish.x + store.btnFinish.p1.x, y: store.btnFinish.y + store.btnFinish.p1.y, vx: -1, vy: 0 }
      if (nodeId === store.btnFinish.p2.id) return { x: store.btnFinish.x + store.btnFinish.p2.x, y: store.btnFinish.y + store.btnFinish.p2.y, vx: 1, vy: 0 }
    }

    // 6. Wall Sensor
    if (nodeId === store.wallSensor.pin.id) return { x: store.wallSensor.x + store.wallSensor.pin.x, y: store.wallSensor.y + store.wallSensor.pin.y, vx: 1, vy: 0 }

    // 7. Resistor
    if (nodeId === store.resistor.p1.id) return { x: store.resistor.x + store.resistor.p1.x, y: store.resistor.y + store.resistor.p1.y, vx: -1, vy: 0 }
    if (nodeId === store.resistor.p2.id) return { x: store.resistor.x + store.resistor.p2.x, y: store.resistor.y + store.resistor.p2.y, vx: 1, vy: 0 }

    console.warn(`Pin no encontrado: ${nodeId}`)
    return { x: 0, y: 0, vx: 0, vy: 1 }
  }

  const getBezierPath = (wire: any) => {
    const p1 = getPinGlobalCoords(wire.fromNode)
    const p2 = getPinGlobalCoords(wire.toNode)
    
    const dx = Math.abs(p2.x - p1.x)
    const dy = Math.abs(p2.y - p1.y)
    
    const dist = Math.sqrt(dx*dx + dy*dy)
    const offset1 = Math.max(40, dist * 0.4)
    const offset2 = Math.max(40, dist * 0.4)
    
    const cp1x = p1.x + (p1.vx * offset1)
    const cp1y = p1.y + (p1.vy * offset1)
    
    const cp2x = p2.x + (p2.vx * offset2)
    const cp2y = p2.y + (p2.vy * offset2)
    
    return `M ${p1.x} ${p1.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
  }

  return {
    getPinGlobalCoords,
    getBezierPath
  }
}
