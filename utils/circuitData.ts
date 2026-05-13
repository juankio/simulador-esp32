export const ESP32_LEFT_LABELS = ['EN', 'VP', 'VN', 'D34', 'D35', 'D32', 'D33', 'D25', 'D26', 'D27', 'D14', 'D12', 'D13', 'GND_L', 'VIN']
export const ESP32_RIGHT_LABELS = ['D23', 'D22', 'TX', 'RX', 'D21', 'D19', 'D18', 'D5', 'TX2', 'RX2', 'D4', 'D2', 'D15', 'GND_R', '3V3']

export const generateESP32Pins = () => {
  const pins: any[] = []
  ESP32_LEFT_LABELS.forEach((lbl, i) => {
    let t = 'io'; if (lbl === 'VIN') t = '5v'; if (lbl === 'GND_L') t = 'gnd';
    pins.push({ id: `esp_${lbl.toLowerCase()}`, label: lbl, x: 10, y: 35 + i * 16, type: t as any, state: 0 })
  })
  ESP32_RIGHT_LABELS.forEach((lbl, i) => {
    let t = 'io'; if (lbl === '3V3') t = '3v3'; if (lbl === 'GND_R') t = 'gnd';
    if (lbl === 'D21') t = 'sda'; if (lbl === 'D22') t = 'scl';
    pins.push({ id: `esp_${lbl.toLowerCase()}`, label: lbl, x: 110, y: 35 + i * 16, type: t as any, state: 0 })
  })
  return pins
}
