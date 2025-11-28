<script setup lang="ts">
defineProps<{
  messageText: string;
}>();
</script>

<template>
  <UButton class="flex" label="Explain to patient" size="xs" variant="soft" />
</template>
