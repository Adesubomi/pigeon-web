import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: process.env.NUXT_DEVTOOLS === 'true' },
  modules: ['shadcn-nuxt'],
  css: ['vue-sonner/style.css', '~/assets/css/main.css'],
  shadcn: {
    prefix: '',
    componentDir: '@/components/ui',
  },
  runtimeConfig: {
    public: {
      appName: process.env.NUXT_APP_NAME ?? 'pigeon',
      appEnv: process.env.NUXT_ENV ?? 'dev',
      appBaseUrl: process.env.NUXT_APP_BASE_URL ?? 'http://localhost:3000',
      payment: {
        provider: process.env.NUXT_PAYMENT_PROVIDER ?? 'mock',
        paystackPublicKey: process.env.NUXT_PAYSTACK_PUBLIC_KEY ?? '',
      },
    },
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        '@phosphor-icons/vue',
        'lucide-vue-next',
        'reka-ui',
        'vue-sonner',
      ]
    }
  },
  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Sora:wght@400;500;600&display=swap',
        },
      ],
    },
  },
})
