<script setup lang="ts">
const supabase = useSupabaseClient();
const user = useSupabaseUser();

const logUserOut = async () => {
  await supabase.auth.signOut();
  navigateTo("/login");
};

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
  {
    label: $t("navigation.settings"),
    icon: "i-heroicons-cog-6-tooth",
    to: "/settings",
  },
];
</script>

<template>
  <UDashboardGroup display="grid" grid-template-columns="250px 1fr">
    <UDashboardSidebar>
      <template v-if="user" #header>
        <UUser
          size="lg"
          :avatar="{
            icon: 'i-maki-doctor',
          }"
          :name="user?.email ?? 'Anonymous'"
          :description="user.user_role"
          :chip="{
            color: 'primary',
            position: 'top-left',
          }"
        />
      </template>
      <template #default>
        <USeparator />
        <UNavigationMenu :items="navigationItems" orientation="vertical" />
      </template>
      <template #footer>
        <UButton color="primary" variant="outline" @click="logUserOut">
          Log out
        </UButton>
      </template>
    </UDashboardSidebar>

    <slot />
  </UDashboardGroup>
</template>
