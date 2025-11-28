<script setup lang="ts">
const { setMessageInput } = useChat();

defineProps<{
  examplePromptText: string;
}>();
</script>
<template>
  <UCard
    class="hover:bg-slate-800 cursor-pointer"
    @click="setMessageInput(examplePromptText)"
  >
    <p>{{ examplePromptText }}</p>
  </UCard>
</template>
