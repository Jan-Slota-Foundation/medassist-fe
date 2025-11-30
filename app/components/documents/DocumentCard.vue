<script setup lang="ts">
import AskAboutDocumentButton from "./actions/AskAboutDocumentButton.vue";
import DeleteDocumentButton from "./actions/DeleteDocumentButton.vue";
import DownloadDocumentButton from "./actions/DownloadDocumentButton.vue";

export interface DocumentItem {
  id: string;
  name: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: Record<string, unknown>;
  bucket: string;
}

defineProps<{
  document: DocumentItem;
}>();
</script>
<template>
  <UCard
    class="cursor-pointer"
    @click="navigateTo(`/documents/${document.name}`)"
  >
    <template #header>
      <h3 class="font-semibold truncate">
        {{ document.name }}
      </h3>
      <p class="text-sm text-gray-500">
        {{
          $t("documents.updated-at", {
            date: new Date(document.updated_at).toLocaleDateString(),
          })
        }}
      </p>
    </template>
    <!-- <div class="text-sm text-gray-600"> -->
    <!-- <p>File ID: {{ document.id }}</p> -->
    <!-- <p v-if="document.metadata?.size">
        {{
          $t("documents.size", {
            size: ((document.metadata.size as number) / 1024 / 1024).toFixed(2),
          })
        }} -->
    <!-- </p> -->
    <!-- </div> -->

    <template #footer>
      <div class="flex gap-2">
        <DownloadDocumentButton :document="document" />
        <DeleteDocumentButton />
        <AskAboutDocumentButton :document="document" />
      </div>
    </template>
  </UCard>
</template>
