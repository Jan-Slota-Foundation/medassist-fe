<script setup lang="ts">
const { setMessageInput } = useChat();

defineProps<{
  examplePromptText: string;
}>();
</script>
<template>
  <UCard
    class="hover:bg-blue-200 cursor-pointer"
    @click="setMessageInput(examplePromptText)"
  >
    <p>{{ examplePromptText }}</p>
  </UCard>
</template>
