<script setup lang="ts">
const toast = useToast();
const handleDelete = () => {
  toast.add({
    title: "Coming soon!",
    description: "This feature is not yet available.",
  });
};
</script>

<template>
  <UTooltip text="Zmaž dokument">
    <UButton
      icon="i-heroicons-trash"
      variant="ghost"
      color="neutral"
      @click="
        (e) => {
          e.stopPropagation();
          handleDelete();
        }
      "
    />
  </UTooltip>
</template>
