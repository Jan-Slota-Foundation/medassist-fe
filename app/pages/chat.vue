<script setup lang="ts">
import { getTextFromMessage } from "@nuxt/ui/utils/ai";
import CopyToClipboard from "~/components/AssistantMessage/actions/CopyToClipboard.vue";
import ExplainToPatientButton from "~/components/AssistantMessage/actions/ExplainToPatientButton.vue";
const messages = ref<any[]>([]);

const messageInput = ref("");

const clearInput = () => {
  messageInput.value = "";
};

const handleSubmit = (message: string) => {
  messages.value.push({
    id: crypto.randomUUID(),
    role: "user",
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
                <ExplainToPatientButton :message="message" />
                <CopyToClipboard :messageText="getTextFromMessage(message)" />
              </template>
            </AssistantMessage>
          </template>
        </UChatMessages>

        <div v-else class="flex flex-col gap-14 mt-28">
          <h1 class="text-4xl font-semibold text-center">Ask away!</h1>
          <UPageGrid>
            <UCard>
              <p>
                Pacient na pokoji 312 jde zítra na kolonoskopii. Můžeš mi
                připomenout přesné kroky přípravy podle našich nemocničních
                pokynů?
              </p>
            </UCard>
            <UCard>
              <p>
                Kde najdu aktuální doporučení pro podání nízkomolekulárního
                heparinu u pacienta s renálním selháním?
              </p>
            </UCard>

            <UCard>
              <p>
                Potřebuju rychle najít, jaký je přesný postup při podezření na
                sepsi podle našich interních směrnic. Jaké jsou první kroky a
                jaké odběry se mají udělat do 30 minut?
              </p>
            </UCard>
          </UPageGrid>
        </div>
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
