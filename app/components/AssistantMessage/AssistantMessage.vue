<script setup lang="ts">
import { getTextFromMessage } from "@nuxt/ui/utils/ai";

type ChatMessage = Parameters<typeof getTextFromMessage>[0];

defineProps<{
  message: ChatMessage;
}>();

const getMessageSegments = (message: ChatMessage) => {
  const text = getTextFromMessage(message) || "";
  return text.split(/(beautiful)/g).filter((segment) => segment.length);
};
</script>

<template>
  <span class="whitespace-pre-wrap leading-relaxed">
    <template
      v-for="(segment, index) in getMessageSegments(message)"
      :key="`${message.id}-${index}`"
    >
      <UBadge
        v-if="segment === 'beautiful'"
        variant="solid"
        color="primary"
        class="mx-0.5 align-middle"
      >
        {{ segment }}
      </UBadge>
      <span v-else>{{ segment }}</span>
    </template>
    <div class="flex gap-2 mt-2" v-if="message.role === 'assistant'">
      <slot name="actions" />
    </div>
  </span>
</template>
