<script setup lang="ts">
import { getTextFromMessage } from "@nuxt/ui/utils/ai";
import CopyToClipboard from "~/components/AssistantMessage/actions/CopyToClipboard.vue";
import ExplainToPatientButton from "~/components/AssistantMessage/actions/ExplainToPatientButton.vue";

const messages = ref();

const messageInput = ref("");

const clearInput = () => {
  messageInput.value = "";
};

const handleSubmit = (message: string) => {
  messages.value.push({
    id: crypto.randomUUID(),
    role: "assistant",
    parts: [{ type: "text", text: message }],
  });
  clearInput();
};
</script>

<template>
  <UDashboardPanel class="h-full p-8">
    <template #body>
      <UContainer>
        <UChatMessages
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
                <ExplainToPatientButton :message="message" />
                <CopyToClipboard :messageText="getTextFromMessage(message)" />
              </template>
            </AssistantMessage>
          </template>
        </UChatMessages>
      </UContainer>
    </template>

    <template #footer>
      <UChatPrompt
        variant="outline"
        v-model="messageInput"
        @submit="handleSubmit(messageInput)"
      >
        <UChatPromptSubmit />
      </UChatPrompt>
    </template>
  </UDashboardPanel>
</template>
