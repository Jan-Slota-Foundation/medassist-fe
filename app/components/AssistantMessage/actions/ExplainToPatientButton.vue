<script setup lang="ts">
import { getTextFromMessage } from "@nuxt/ui/utils/ai";

type ChatMessage = Parameters<typeof getTextFromMessage>[0];

defineProps<{
  message: ChatMessage;
}>();
</script>

<template>
  <UButton class="flex" label="Explain to patient" size="xs" variant="soft" />
</template>
