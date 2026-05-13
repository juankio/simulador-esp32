// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true, // SPA mode for WebGL/Monaco/SVG performance
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],
  app: {
    head: {
      title: 'ESP32 Neon Node Simulator',
      bodyAttrs: {
        class: 'bg-slate-900 text-white overflow-hidden'
      }
    }
  }
})
