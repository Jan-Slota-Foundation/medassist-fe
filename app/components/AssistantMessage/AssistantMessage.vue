<script setup lang="ts">
import { getTextFromMessage } from "@nuxt/ui/utils/ai";
import { marked } from "marked";

type ChatMessage = Parameters<typeof getTextFromMessage>[0];

const props = defineProps<{
  message: ChatMessage;
}>();

const raw = getTextFromMessage(props.message);
const html = marked.parse(raw);
</script>

<template>
  <span class="whitespace-pre-wrap leading-relaxed">
    <div class="whitespace-normal list-disc" v-html="html" />
    <div v-if="message.role === 'assistant'" class="flex gap-2 mt-2">
      <slot name="actions" />
    </div>
  </span>
</template>

<style scoped>
:deep(ul) {
  list-style-type: disc;
  padding-left: 1.5rem;
}

:deep(ul > li) {
  display: list-item;
  list-style-type: disc;
  margin-left: 0;
  padding-left: 0.25rem;
}

:deep(ol) {
  list-style-type: decimal;
  padding-left: 1.5rem;
}

:deep(ol > li) {
  display: list-item;
  list-style-type: decimal;
  margin-left: 0;
  padding-left: 0.25rem;
}
</style>
