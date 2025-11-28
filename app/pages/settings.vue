<template>
  <UDashboardPanel class="h-full space-y-8 p-8">
    <div>
      <h1 class="text-3xl font-bold">Settings</h1>
      <p class="text-muted-foreground mt-1 text-sm">
        Adjust voice controls and tune the system prompt used for chat
        responses.
      </p>
    </div>

    <div class="grid gap-8 grid-cols-1 md:grid-cols-2">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between gap-4">
            <div>
              <h2 class="text-xl font-semibold">Voice</h2>
            </div>
            <UButton
              color="primary"
              icon="i-heroicons-speaker-wave"
              variant="outline"
            >
              Test voice
            </UButton>
          </div>
        </template>

        <div class="flex flex-col items-center gap-8">
          <UFormField label="Pitch" class="w-full">
            <USlider class="mt-2" :min="0.5" :max="2" :step="0.1" />
          </UFormField>

          <UFormField label="Speed" class="w-full">
            <USlider class="mt-2" :min="0.5" :max="2" :step="0.1" />
          </UFormField>
        </div>

        <template #footer>
          <UButton color="primary" variant="solid">Save</UButton>
        </template>
      </UCard>

      <UCard>
        <template #header>
          <div>
            <h2 class="text-xl font-semibold">Assistant Configuration</h2>
          </div>
        </template>

        <UFormField label="System Prompt">
          <UTextarea
            :rows="4"
            :max-rows="4"
            autoresize
            class="w-full"
            placeholder="You are a professional medical assistant that helps users with their medical questions."
          />
        </UFormField>

        <template #footer>
          <UButton color="primary" variant="solid">Save</UButton>
        </template>
      </UCard>
    </div>
  </UDashboardPanel>
</template>
