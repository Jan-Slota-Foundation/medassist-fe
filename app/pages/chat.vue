<script setup lang="ts">
import { getTextFromMessage } from "@nuxt/ui/utils/ai";
import CopyToClipboard from "~/components/AssistantMessage/actions/CopyToClipboard.vue";
import ExplainToPatientButton from "~/components/AssistantMessage/actions/ExplainToPatientButton.vue";
import TextToVoiceButton from "~/components/AssistantMessage/actions/TextToVoiceButton.vue";
import useChat from "~/composables/useChat";

const { messages, messageInput, handleSubmit } = useChat();
</script>

<template>
  <UDashboardPanel class="h-full p-8">
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
        >
          <template #content="{ message }">
            <AssistantMessage :message="message">
              <template #actions>
                <ExplainToPatientButton
                  :message-text="getTextFromMessage(message)"
                />
                <CopyToClipboard :message-text="getTextFromMessage(message)" />
                <TextToVoiceButton
                  :message-text="getTextFromMessage(message)"
                />
              </template>
            </AssistantMessage>
          </template>
        </UChatMessages>

        <div v-else class="flex flex-col gap-14 mt-28">
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
          <UChatPromptSubmit />
        </div>
      </UChatPrompt>
    </template>
  </UDashboardPanel>
</template>
