<script setup lang="ts">
const supabase = useSupabaseClient();

const logUserOut = async () => {
  await supabase.auth.signOut();
  navigateTo("/login");
};

const sidebarMode = ref<"drawer" | "slideover" | "modal">("drawer");

// Reactive screen size detection
const isMobile = ref(false);

const updateScreenSize = () => {
  isMobile.value = window.innerWidth < 1024; // lg breakpoint
};

onMounted(() => {
  updateScreenSize();
  window.addEventListener("resize", updateScreenSize);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateScreenSize);
});

const navigationItems = [
  {
    label: $t("navigation.chat"),
    icon: "i-heroicons-chat-bubble-left-right",
    to: "/chat",
  },
  {
    label: $t("navigation.documents"),
    icon: "i-heroicons-document-text",
    to: "/documents",
  },
];
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar :mode="isMobile ? 'drawer' : sidebarMode">
      <template #header>
        <UUser
          size="lg"
          :avatar="{
            icon: 'i-lucide-user',
          }"
          :name="'Anonymous'"
          :description="'Bez role'"
        />
      </template>
      <template #default>
        <USeparator />
        <UNavigationMenu :items="navigationItems" orientation="vertical" />
      </template>
      <template #footer>
        <div class="w-full">
          <UButton
            class="w-full"
            color="primary"
            variant="solid"
            @click="logUserOut"
          >
            Odhlásit se
          </UButton>
        </div>
      </template>
    </UDashboardSidebar>

    <slot />
  </UDashboardGroup>
</template>
