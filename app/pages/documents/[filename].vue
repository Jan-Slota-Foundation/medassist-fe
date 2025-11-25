<script setup lang="ts">
import type { FileObject } from "@supabase/storage-js";

const { filename } = useRoute().params;
const supabase = useSupabaseClient();

const { data: cachedDocuments } = useNuxtData<FileObject[]>(`remoteDocuments`);

const cachedDocument = computed(() => {
  return cachedDocuments.value?.find(
    (document: FileObject) => document.name === filename
  );
});

const { data: documentInfo, pending: documentInfoPending } = useLazyAsyncData(
  `remoteDocument-${filename}`,
  async () => {
    const { data, error: SupabaseStorageError } = await supabase.storage
      .from("documents")
      .list("", { search: filename as string });
    if (SupabaseStorageError) {
      throw new Error(SupabaseStorageError.message);
    }
    return data?.[0];
  }
);

const displayDocument = computed(() => {
  if (documentInfo.value) {
    return documentInfo.value;
  }
  if (cachedDocument.value) {
    return cachedDocument.value;
  }
  return null;
});
</script>

<template>
  <UPage class="h-full p-8">
    <div v-if="!displayDocument && !documentInfoPending">
      <UProgress indeterminate />
    </div>
    <div v-else-if="displayDocument">
      <h1 class="text-3xl font-bold">{{ displayDocument.name }}</h1>
      <p class="text-sm text-gray-500">
        Updated: {{ new Date(displayDocument.updated_at).toLocaleDateString() }}
      </p>
      <p class="text-sm text-gray-500">
        Created: {{ new Date(displayDocument.created_at).toLocaleDateString() }}
      </p>
      <p class="text-sm text-gray-500">
        Size: {{ (displayDocument.metadata.size / 1024 / 1024).toFixed(2) }} MB
      </p>
    </div>
  </UPage>
</template>
