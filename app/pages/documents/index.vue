<script setup lang="ts">
import { watch } from "vue";
import type { FileObject } from "@supabase/storage-js";

const documentsKey = "remoteDocuments";

const supabase = useSupabaseClient();
const toast = useToast();
const inputFiles = ref<File[]>([]);
const { data: cachedDocuments } = useNuxtData<FileObject[]>(documentsKey);

const fetchRemoteDocuments = async () => {
  const results = await Promise.allSettled([
    supabase.storage.from("pracovni_cesty").list("", { limit: 25 }),
    supabase.storage.from("zhodnoceni_procesu").list("", { limit: 25 }),
    supabase.storage.from("organizacni_rady").list("", { limit: 25 }),
  ]);

  const errors: string[] = [];
  const allDocuments: FileObject[] = [];

  results.forEach((result, index) => {
    let bucketName;
    switch (index) {
      case 0:
        bucketName = "pracovni_cesty";
        break;
      case 1:
        bucketName = "zhodnoceni_procesu";
        break;
      default:
        bucketName = "organizacni_rady";
        break;
    }

    if (result.status === "fulfilled") {
      if (result.value.error) {
        errors.push(`${bucketName}: ${result.value.error.message}`);
      } else {
        const documents = (result.value.data ?? []).map((doc) => ({
          ...doc,
          bucket: bucketName,
        }));
        allDocuments.push(...documents);
      }
    } else {
      errors.push(`${bucketName}: ${result.reason.message}`);
    }
  });

  if (errors.length > 0) {
    toast.add({
      title: "Some documents failed to load",
      description: "There has been an error fetching some documents.",
    });
  }

  return allDocuments;
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
  <UDashboardPanel class="h-full px-8 pt-8">
    <UFileUpload
      v-model="inputFiles"
      label="Upload documents"
      multiple
      position="inside"
      color="neutral"
      class="h-48"
      layout="list"
      :highlight="true"
      :interactive="false"
      description="PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX (max. 50MB)"
      accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation"
    >
      <template #actions="{ open }">
        <UButton
          label="Select files"
          icon="i-lucide-upload"
          color="neutral"
          variant="outline"
          @click="open()"
        />
      </template>

      <template #files-top="{ open, files }">
        <div
          v-if="files?.length"
          class="mb-2 flex items-center justify-between"
        >
          <p class="font-bold">Files ({{ files?.length }})</p>

          <div class="flex gap-2">
            <UButton
              trailing-icon="i-lucide-plus"
              label="Add more"
              color="neutral"
              variant="outline"
              @click="open()"
            />
            <UButton
              label="Upload"
              color="primary"
              trailing-icon="i-lucide-upload"
            />
          </div>
        </div>
      </template>
    </UFileUpload>

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
