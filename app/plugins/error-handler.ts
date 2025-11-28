export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("vue:error", (err) => {
    console.log("A Vue error occurred");
    console.error(err);
  });
});
