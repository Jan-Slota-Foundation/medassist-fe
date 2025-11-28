<script setup lang="ts">
defineProps<{
  messageText: string;
}>();

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};
</script>

<template>
  <UButton
    class="flex"
    icon="ri-clipboard-line"
    size="xs"
    variant="soft"
    @click="copyToClipboard(messageText)"
  />
</template>
