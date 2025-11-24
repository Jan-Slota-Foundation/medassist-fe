<script setup lang="ts">
const files = ref<File[]>([]);
const previewUrl = ref<string | null>(null);

const isPreviewableFile = (file: File | null) => {
  if (!file) {
    return false;
  }

  const previewableMimeTypes = ["application/pdf"];
  const isKnownType = previewableMimeTypes.includes(file.type);
  const isPdfByName = file.name.toLowerCase().endsWith(".pdf");

  return isKnownType || isPdfByName;
};

const selectedFile = computed(() => files.value[0] ?? null);

const isPreviewable = computed(() => isPreviewableFile(selectedFile.value));

watch(
  files,
  (newFiles) => {
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value);
      previewUrl.value = null;
    }

    const [firstFile] = newFiles;

    if (firstFile && isPreviewableFile(firstFile)) {
      previewUrl.value = URL.createObjectURL(firstFile);
    }
  },
  { deep: true }
);

onBeforeUnmount(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
});
</script>

<template>
  <UDashboardPanel class="h-full p-8">
    <UFileUpload
      label="Upload documents"
      multiple
      class="w-96 min-h-48"
      v-model="files"
      layout="list"
      description="PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX (max. 50MB)"
      accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation"
    />

    <div
      v-if="selectedFile"
      class="mt-8 flex flex-col gap-4 rounded-lg border border-gray-200 bg-white/50 p-6 dark:border-gray-800 dark:bg-gray-900/40"
    >
      <div class="flex flex-wrap items-center gap-4">
        <div>
          <p class="text-sm text-gray-500">Selected file</p>
          <p class="text-lg font-semibold">{{ selectedFile.name }}</p>
        </div>
        <UBadge variant="subtle">
          {{ (selectedFile.size / 1024 / 1024).toFixed(2) }} MB
        </UBadge>
        <UBadge color="neutral" variant="subtle">
          {{ selectedFile.type || "Unknown type" }}
        </UBadge>
      </div>

      <div
        class="min-h-64 rounded-md border border-dashed border-gray-300 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900"
      >
        <template v-if="isPreviewable && previewUrl">
          <iframe
            :src="previewUrl"
            class="h-96 w-full rounded-md bg-white"
            title="Document preview"
          />
        </template>
        <template v-else>
          <div
            class="flex h-full flex-col items-center justify-center text-center text-sm text-gray-500"
          >
            <UIcon
              name="i-heroicons-eye-slash"
              class="mb-2 h-8 w-8 text-gray-400"
            />
            <p>Preview not available for this file type.</p>
            <p class="text-xs text-gray-400">
              Download the file to view its contents.
            </p>
          </div>
        </template>
      </div>
    </div>
  </UDashboardPanel>
</template>
