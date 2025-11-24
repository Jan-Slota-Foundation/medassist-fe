<script setup lang="ts">
const user = useSupabaseUser();
console.log(user);

const navigationItems = [
  {
    label: "Chat",
    icon: "i-heroicons-chat-bubble-left-right",
    to: "/chat",
  },
  {
    label: "Documents",
    icon: "i-heroicons-document-text",
    to: "/documents",
  },
  {
    label: "Settings",
    icon: "i-heroicons-cog-6-tooth",
    to: "/settings",
  },
];
</script>

<template>
  <UDashboardGroup display="grid" grid-template-columns="250px 1fr">
    <UDashboardSidebar>
      <template #header>
        <UUser :name="user?.email ?? 'Anonymous'" description="Doctor" />
      </template>
      <template #default>
        <USeparator />
        <UNavigationMenu :items="navigationItems" orientation="vertical" />
      </template>
    </UDashboardSidebar>

    <slot />
  </UDashboardGroup>
</template>
