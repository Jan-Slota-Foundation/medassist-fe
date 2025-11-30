<script setup lang="ts">
import type { DocumentItem } from "~/components/documents/DocumentCard.vue";

const props = defineProps<{
  document: DocumentItem;
}>();

const supabase = useSupabaseClient();

const handleDownload = () => {
  const { data } = supabase.storage
    .from(props.document.bucket)
    .getPublicUrl(props.document.name);

  if (data?.publicUrl) {
    // Create a temporary link element to trigger the download
    const link = document.createElement("a");
    link.href = data.publicUrl;
    link.download = props.document.name;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
</script>

<template>
  <UTooltip text="Stáhnout dokument">
    <UButton
      icon="i-heroicons-arrow-down-tray"
      variant="ghost"
      color="neutral"
      @click="
        (e) => {
          e.stopPropagation();
          handleDownload();
        }
      "
    />
  </UTooltip>
</template>
