// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxt/eslint",
    "@nuxt/hints",
    "@nuxt/ui",
    "@nuxtjs/supabase",
    "@nuxt/content",
    "@nuxtjs/i18n",
  ],
  ui: {
    colorMode: false,
  },
  i18n: {
    strategy: "no_prefix",
    defaultLocale: "cs",
    restructureDir: "app",
    langDir: "locales",
    detectBrowserLanguage: false,
    locales: [
      {
        code: "cs",
        name: "Čeština",
        file: "cs.json",
      },
      {
        code: "en",
        name: "English",
        file: "en.json",
      },
    ],
    vueI18n: "./i18n.config.ts",
  },
  runtimeConfig: {
    elevenlabsApiKey: process.env.ELEVENLABS_API_KEY,
  },
  css: ["~/assets/main.css"],
  supabase: {
    redirect: false,
    redirectOptions: {
      login: "/login",
      callback: "/confirm",
      exclude: ["/**"],
    },
  },
});
