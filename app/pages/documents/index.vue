<script setup lang="ts">
import { watch } from "vue";
import type { FileObject } from "@supabase/storage-js";

const documentsKey = "remoteDocuments";

const supabase = useSupabaseClient();
const toast = useToast();
const inputFiles = ref<File[]>([]);
const { data: cachedDocuments } = useNuxtData<FileObject[]>(documentsKey);

const fetchRemoteDocuments = async () => {
  const { data, error: supabaseError } = await supabase.storage
    .from("documents")
    .list("", { limit: 25 });

  if (supabaseError) {
    throw new Error(supabaseError.message);
  }

  return data ?? [];
};

const {
  data: remoteDocuments,
  error,
  refresh: refreshRemoteDocuments,
} = await useAsyncData<FileObject[]>(documentsKey, fetchRemoteDocuments, {
  default: () => cachedDocuments.value ?? [],
});

if (cachedDocuments.value) {
  onNuxtReady(() => {
    refreshRemoteDocuments();
  });
}

watch(
  error,
  (fetchError) => {
    if (!fetchError) {
      return;
    }

    console.error(fetchError);
    toast.add({
      title: "Error",
      description: "Error fetching documents",
    });
  },
  { immediate: true }
);
</script>

<template>
  <UDashboardPanel class="h-full p-8">
    <UFileUpload
      label="Upload documents"
      multiple
      class="w-96 min-h-48"
      v-model="inputFiles"
      layout="list"
      description="PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX (max. 50MB)"
      accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation"
    />
    <div class="overflow-y-scroll p-4">
      <UPageGrid v-if="remoteDocuments.length > 0">
        <DocumentsDocumentCard
          v-for="document in remoteDocuments"
          :key="document.id"
          :document="document"
        />
      </UPageGrid>
    </div>
  </UDashboardPanel>
</template>
