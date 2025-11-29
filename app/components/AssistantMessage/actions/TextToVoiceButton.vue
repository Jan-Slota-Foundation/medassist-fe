<script setup lang="ts">
const props = defineProps<{
  messageText: string;
}>();

const { convertTextToSpeech, status } = useTextToSpeech();

const handleClick = () => {
  convertTextToSpeech(props.messageText);
};
</script>

<template>
  <UTooltip text="Text to voice">
    <UButton
      class="flex"
      icon="i-heroicons-speaker-wave"
      size="xs"
      variant="ghost"
      color="neutral"
      :loading="status === 'speaking'"
      @click="handleClick"
    />
  </UTooltip>
</template>
