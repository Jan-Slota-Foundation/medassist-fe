<script setup lang="ts">
import AskAboutDocumentButton from "./actions/AskAboutDocumentButton.vue";
import DeleteDocumentButton from "./actions/DeleteDocumentButton.vue";
import DownloadDocumentButton from "./actions/DownloadDocumentButton.vue";

interface DocumentItem {
  id: string;
  name: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: Record<string, unknown>;
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
        Updated: {{ new Date(document.updated_at).toLocaleDateString() }}
      </p>
    </template>
    <div class="text-sm text-gray-600">
      <p>File ID: {{ document.id }}</p>
      <p v-if="document.metadata?.size">
        Size:
        {{ ((document.metadata.size as number) / 1024 / 1024).toFixed(2) }} MB
      </p>
    </div>

    <template #footer>
      <div class="flex gap-2">
        <DownloadDocumentButton />
        <DeleteDocumentButton />
        <AskAboutDocumentButton />
      </div>
    </template>
  </UCard>
</template>
