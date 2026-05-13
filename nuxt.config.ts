// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false, // SPA mode for WebGL/Monaco/SVG performance and to prevent hydration mismatches
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],
  app: {
    head: {
      title: 'Física Magnética | ESP32',
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ],
      bodyAttrs: {
        class: 'bg-slate-900 text-white overflow-hidden'
      }
    }
  }
})
