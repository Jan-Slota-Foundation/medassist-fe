import type { FileObject } from "@supabase/storage-js";

export const useRemoteDocuments = () => async () => {
  const supabase = useSupabaseClient();

  const { data: cachedDocuments } =
    useNuxtData<FileObject[]>(`remoteDocuments`);

  if (cachedDocuments.value) {
    return cachedDocuments.value;
  }

  const { data, error } = await useAsyncData(`remoteDocuments`, async () => {
    const { data, error: supabaseError } = await supabase.storage
      .from("documents")
      .list();
  });
  return cachedDocuments;
};
