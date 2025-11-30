<script setup lang="ts">
import type { DocumentItem } from "~/components/documents/DocumentCard.vue";

const { setMessageInput } = useChat();
const props = defineProps<{
  document: DocumentItem;
}>();

const handleAskAboutDocument = () => {
  setMessageInput(
    `Víš něco o dokumentu aneb, skratce/organizaci: ${props.document.name}.`
  );

  navigateTo("/chat");
};
</script>

<template>
  <UTooltip text="Zeptej se na dokument">
    <UButton
      icon="i-heroicons-chat-bubble-bottom-center-text"
      variant="ghost"
      color="neutral"
      @click="
        (e) => {
          e.stopPropagation();
          handleAskAboutDocument();
        }
      "
    />
  </UTooltip>
</template>
