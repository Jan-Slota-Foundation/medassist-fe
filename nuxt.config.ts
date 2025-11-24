// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint", "@nuxt/hints", "@nuxt/ui", "@nuxtjs/supabase"],
  css: ["~/assets/main.css"],
  supabase: {
    redirectOptions: {
      login: "/login",
      callback: "/chat",
    },
  },
});
