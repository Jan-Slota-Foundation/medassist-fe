<script setup lang="ts">
defineProps<{
  messageText: string;
}>();

const { convertTextToSpeech, status } = useTextToSpeech();

const handleClick = (messageText: string) => {
  convertTextToSpeech(messageText);
};
</script>

<template>
  <UTooltip text="Text to voice">
    <UButton
      class="flex"
      icon="i-heroicons-speaker-wave"
      size="xs"
      variant="soft"
      :loading="status === 'speaking'"
      @click="handleClick(messageText)"
    />
  </UTooltip>
</template>
