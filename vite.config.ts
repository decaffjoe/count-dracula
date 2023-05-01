import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { VitePWA } from 'vite-plugin-pwa'

// GENERAL -> https://vitejs.dev/config/
// PWA -> https://vite-pwa-org.netlify.app/guide/pwa-minimal-requirements.html
export default defineConfig({
  plugins: [
    svelte(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      includeAssets: [
        'calculator64.png',
        'gear.png',
        'home.png',
      ],
      manifest: {
        name: 'count dracula',
        short_name: 'count dracula',
        description: 'Count your calories & protein',
        theme_color: '#6e6b99',
        icons: [
          {
            src: 'calculator192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'calculator512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      }
    }),
  ]
})
