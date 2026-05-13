import { ref } from 'vue'

export const useSerialConnection = () => {
  const isSupported = ref(false)
  const isConnected = ref(false)
  const isReading = ref(false)
  const serialError = ref('')
  
  let port: any = null
  let reader: any = null
  let keepReading = true

  // Check support on client side
  if (typeof window !== 'undefined' && 'serial' in navigator) {
    isSupported.value = true
  }

  // Define a callback type for incoming JSON
  type OnDataCallback = (data: any) => void
  let onDataCallback: OnDataCallback | null = null

  const setOnData = (callback: OnDataCallback) => {
    onDataCallback = callback
  }

  const connect = async () => {
    if (!isSupported.value) {
      serialError.value = "Web Serial API not supported in this browser."
      return false
    }

    try {
      // Filtrar los puertos para mostrar SOLO chips compatibles con ESP32 / Arduino
      const espFilters = [
        { usbVendorId: 0x10c4 }, // Silicon Labs (CP210x - Devkit V1)
        { usbVendorId: 0x1a86 }, // QinHeng (CH340 - Placas chinas)
        { usbVendorId: 0x303a }, // Espressif Native
        { usbVendorId: 0x0403 }  // FTDI
      ]
      
      // Request a port and open a connection at 115200 baud
      port = await (navigator as any).serial.requestPort({ filters: espFilters })
      await port.open({ baudRate: 115200 })
      
      isConnected.value = true
      serialError.value = ''
      keepReading = true
      
      // Start reading loop in background
      readLoop()
      return true
    } catch (e: any) {
      console.error(e)
      serialError.value = `Connection failed: ${e.message}`
      isConnected.value = false
      return false
    }
  }

  const disconnect = async () => {
    keepReading = false
    if (reader) {
      await reader.cancel() // Forces the read loop to resolve
    }
    if (port) {
      await port.close()
    }
    isConnected.value = false
    port = null
  }

  const readLoop = async () => {
    isReading.value = true
    const textDecoder = new TextDecoderStream()
    const readableStreamClosed = port.readable.pipeTo(textDecoder.writable)
    reader = textDecoder.readable.getReader()

    let buffer = ''

    try {
      while (keepReading) {
        const { value, done } = await reader.read()
        if (done) {
          // Allow the serial port to be closed later
          reader.releaseLock()
          break
        }
        if (value) {
          buffer += value
          // Split by newline to parse JSON lines
          const lines = buffer.split('\n')
          buffer = lines.pop() || '' // Keep the incomplete line in buffer

          for (const line of lines) {
            const cleanLine = line.trim()
            if (cleanLine.startsWith('{') && cleanLine.endsWith('}')) {
              try {
                const data = JSON.parse(cleanLine)
                if (onDataCallback) onDataCallback(data)
              } catch (err) {
                console.warn('Failed to parse Serial JSON:', cleanLine)
              }
            }
          }
        }
      }
    } catch (error: any) {
      console.error("Serial Read Error: ", error)
      serialError.value = "Hardware disconnected unexpectedly."
      isConnected.value = false
    } finally {
      // Cleanup
      try {
        reader.releaseLock()
      } catch (e) {}
      isReading.value = false
    }
  }

  return {
    isSupported,
    isConnected,
    isReading,
    serialError,
    connect,
    disconnect,
    setOnData
  }
}
