<script setup lang="ts">
import { getTextFromMessage } from "@nuxt/ui/utils/ai";
import CopyToClipboard from "~/components/AssistantMessage/actions/CopyToClipboard.vue";
import TextToVoiceButton from "~/components/AssistantMessage/actions/TextToVoiceButton.vue";
import ExamplePromptCard from "~/components/ExamplePromptCard.vue";
import { getExamplePrompts } from "~/utils/examplePrompts";
import useChat from "~/composables/useChat";

const { messages, messageInput, handleSubmit, isLoading } = useChat();

const isMobile = ref(false);

const updateScreenSize = () => {
  isMobile.value = window.innerWidth < 1024; // lg breakpoint
};

onMounted(() => {
  updateScreenSize();
  window.addEventListener("resize", updateScreenSize);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateScreenSize);
});
</script>

<template>
  <UDashboardPanel class="h-full max-h-screen p-2 md:p-8">
    <template #header>
      <UDashboardNavbar v-if="isMobile" />
    </template>

    <template #body>
      <UContainer>
        <UChatMessages
          v-if="messages.length > 0"
          status="streaming"
          :messages="messages"
          :auto-scroll="{
            color: 'neutral',
            variant: 'outline',
          }"
          should-auto-scroll
          :user="{
            variant: 'soft',
            side: 'right',
          }"
          :assistant="{
            avatar: {
              icon: 'i-lucide-bot',
              size: 'md',
              color: 'neutral',
              variant: 'soft',
            },
            variant: 'naked',
            side: 'left',
          }"
        >
          <template #content="{ message }">
            <AssistantMessage :message="message">
              <template #actions>
                <CopyToClipboard :message-text="getTextFromMessage(message)" />
                <TextToVoiceButton
                  :message-text="getTextFromMessage(message)"
                />
              </template>
            </AssistantMessage>
          </template>
        </UChatMessages>

        <div v-else class="flex flex-col gap-18 mt-14 md:mt-28">
          <h1 class="text-4xl font-semibold text-center">
            {{ $t("chat.title") }}
          </h1>
          <UPageGrid>
            <ExamplePromptCard
              v-for="prompt in getExamplePrompts()"
              :key="prompt"
              :example-prompt-text="prompt"
            />
          </UPageGrid>
        </div>
      </UContainer>
    </template>

    <template #footer>
      <UChatPrompt
        v-model="messageInput"
        :placeholder="$t('chat.placeholder')"
        variant="outline"
        @submit="handleSubmit(messageInput)"
      >
        <div class="flex items-center gap-2">
          <UTooltip :text="$t('chat.speechToText')" position="top">
            <UButton
              icon="i-heroicons-microphone"
              variant="ghost"
              color="neutral"
            />
          </UTooltip>
          <UChatPromptSubmit :loading="isLoading" />
        </div>
      </UChatPrompt>
    </template>
  </UDashboardPanel>
</template>
