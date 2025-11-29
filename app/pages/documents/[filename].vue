<script setup lang="ts">
import type { FileObject } from "@supabase/storage-js";

type DocumentWithBucket = FileObject & { bucket?: string; bucket_id?: string };

const { filename } = useRoute().params;
const supabase = useSupabaseClient();

const { data: cachedDocuments } =
  useNuxtData<DocumentWithBucket[]>(`remoteDocuments`);

const cachedDocument = computed(() => {
  return cachedDocuments.value?.find(
    (document: DocumentWithBucket) => document.name === filename
  );
});

const { data: documentInfo, pending: documentInfoPending } =
  useLazyAsyncData<DocumentWithBucket | null>(
    `remoteDocument-${filename}`,
    async () => {
      if ((cachedDocument.value as FileObject & { bucket?: string })?.bucket) {
        const { data, error: SupabaseStorageError } = await supabase.storage
          .from(
            (cachedDocument.value as FileObject & { bucket: string }).bucket
          )
          .list("", { search: filename as string });
        if (SupabaseStorageError) {
          throw new Error(SupabaseStorageError.message);
        }
        return data?.[0]
          ? ({
              ...data[0],
              bucket: (cachedDocument.value as DocumentWithBucket).bucket,
            } satisfies DocumentWithBucket)
          : null;
      }

      // Fallback: search across all known buckets if not cached
      const buckets = [
        "pracovni_cesty",
        "zhodnoceni_procesu",
        "organizacni_rady",
      ];
      for (const bucket of buckets) {
        const { data, error: SupabaseStorageError } = await supabase.storage
          .from(bucket)
          .list("", { search: filename as string });
        if (SupabaseStorageError) {
          continue; // Try next bucket
        }
        if (data && data.length > 0) {
          return data[0]
            ? ({ ...data[0], bucket } satisfies DocumentWithBucket)
            : null;
        }
      }

      throw new Error(`Document ${filename} not found in any bucket`);
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

const isCsv = computed(() => {
  if (typeof filename !== "string") {
    return false;
  }
  return filename.toLowerCase().endsWith(".csv");
});

const documentBucket = computed(() => {
  if (!displayDocument.value) {
    return null;
  }
  const document = displayDocument.value as DocumentWithBucket;
  return document.bucket ?? document.bucket_id ?? null;
});

const parseCsvText = (raw: string): string[][] => {
  const rows: string[][] = [];
  let currentCell = "";
  let currentRow: string[] = [];
  let insideQuotes = false;

  const pushCell = () => {
    currentRow.push(currentCell);
    currentCell = "";
  };

  const pushRow = () => {
    if (currentRow.length > 0 || currentCell.length > 0) {
      pushCell();
      rows.push(currentRow);
    }
    currentRow = [];
  };

  for (let i = 0; i < raw.length; i++) {
    const char = raw[i];
    const nextChar = raw[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentCell += '"';
        i += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
      continue;
    }

    if (char === "," && !insideQuotes) {
      pushCell();
      continue;
    }

    if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && nextChar === "\n") {
        i += 1;
      }
      pushRow();
      continue;
    }

    currentCell += char;
  }

  pushRow();

  return rows
    .map((row) => row.map((cell) => cell.trim()))
    .filter((row) => row.some((cell) => cell.length > 0));
};

const {
  data: csvRows,
  pending: csvPending,
  error: csvError,
} = useLazyAsyncData<string[][] | null>(
  `remoteDocument-${filename}-csv-data`,
  async () => {
    if (!isCsv.value || !displayDocument.value || !documentBucket.value) {
      return null;
    }

    const { data, error } = await supabase.storage
      .from(documentBucket.value)
      .download(displayDocument.value.name);

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error("CSV file is empty");
    }

    const text = await data.text();
    return parseCsvText(text);
  },
  {
    server: false,
    immediate: true,
    default: () => null,
    watch: [isCsv, documentBucket, () => displayDocument.value?.name],
  }
);

type CsvColumn = { accessorKey: string; header: string };

const csvColumns = computed<CsvColumn[]>(() => {
  const rows = csvRows.value;
  if (!rows || rows.length === 0) {
    return [];
  }
  const headers = rows[0] ?? [];
  return headers.map((header, index) => {
    const label = header || `Column ${index + 1}`;
    return {
      accessorKey: label,
      header: label,
    };
  });
});

const csvTableData = computed<Record<string, string>[]>(() => {
  const rows = csvRows.value;
  if (!rows || rows.length < 2) {
    return [];
  }

  const [headers, ...bodyRows] = rows;
  if (!headers) {
    return [];
  }

  return bodyRows
    .filter((row) => row.some((cell) => cell.length > 0))
    .map((row) =>
      headers.reduce<Record<string, string>>((acc, header, index) => {
        const key = header || `Column ${index + 1}`;
        acc[key] = row[index] || "N/A";
        return acc;
      }, {})
    );
});
</script>

<template>
  <UPage class="h-full p-8">
    <div v-if="!displayDocument && !documentInfoPending">
      <UProgress indeterminate />
    </div>
    <div v-else-if="displayDocument" class="space-y-6">
      <div>
        <div class="flex mb-8 items-center gap-4">
          <UButton
            icon="i-heroicons-arrow-left"
            variant="soft"
            size="lg"
            color="neutral"
            @click="navigateTo('/documents')"
          />
          <h1 class="text-4xl font-bold">
            Detail Dokumentu: {{ displayDocument.name }}
          </h1>
        </div>
        <UPageGrid>
          <UCard>
            {{
              $t("documents.updated-at", {
                date: new Date(displayDocument.updated_at).toLocaleDateString(),
              })
            }}
          </UCard>
          <UCard>
            {{
              $t("documents.created-at", {
                date: new Date(displayDocument.created_at).toLocaleDateString(),
              })
            }}
          </UCard>
          <UCard>
            {{
              $t("documents.size", {
                size: (displayDocument.metadata.size / 1024 / 1024).toFixed(2),
              })
            }}
          </UCard>
        </UPageGrid>
      </div>

      <div v-if="isCsv" class="flex flex-col gap-4">
        <div v-if="csvPending">
          <UProgress indeterminate />
        </div>
        <p v-else-if="csvError" class="text-sm text-red-500">
          Unable to load CSV content: {{ csvError.message }}
        </p>
        <p
          v-else-if="csvTableData.length === 0 || csvColumns.length === 0"
          class="text-sm text-gray-500"
        >
          This CSV file does not contain any tabular data.
        </p>
        <UCard
          v-else
          class="flex-1 overflow-x-auto overflow-y-auto max-h-[800px] p-0"
        >
          <UTable
            sticky
            :columns="csvColumns"
            :data="csvTableData"
            class="max-h-[600px] [&_td]:max-w-[320px] [&_td]:truncate [&_td]:whitespace-nowrap"
          />
        </UCard>
      </div>
    </div>
  </UPage>
</template>
