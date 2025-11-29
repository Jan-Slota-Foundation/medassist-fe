<script setup lang="ts">
import { marked } from "marked";

interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  parts: { type: "text"; text: string }[];
  source_file?: string;
}
const props = defineProps<{
  message: ChatMessage;
}>();

console.log(props.message);

const isHovered = ref(false);

const sourceFiles = computed(() => {
  return props.message.source_file
    ? [
        {
          name: props.message.source_file,
          documentName: props.message.source_file,
        },
      ]
    : [];
});

const raw = props.message.parts[0]?.text || "";
const html = marked.parse(raw);
</script>

<template>
  <span class="whitespace-pre-wrap leading-relaxed">
    <div class="whitespace-normal list-disc" v-html="html" />
    <div v-if="message.role === 'assistant'" class="flex gap-2 mt-2">
      <slot name="actions" />
      <div
        class="flex"
        @mouseenter="isHovered = true"
        @mouseleave="isHovered = false"
      >
        <UBadge
          v-for="sourceFile in sourceFiles"
          :key="sourceFile.name"
          size="sm"
          variant="solid"
          :class="[
            'cursor-pointer font-bold px-2 rounded-full border-2 transition-all duration-300 ease-in-out',
            isHovered ? 'mr-0' : '-ml-6 first:ml-0 last:mr-0',
          ]"
          @click="navigateTo(`/documents/${sourceFile.documentName}`)"
          >{{ sourceFile.name }}</UBadge
        >
      </div>
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
