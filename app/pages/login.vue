<script setup lang="ts">
import * as z from "zod";
import type { AuthFormField } from "@nuxt/ui";

definePageMeta({
  layout: "login",
});

const toast = useToast();

const schema = z.object({
  email: z.email(),
});

const fields: AuthFormField[] = [
  {
    name: "email",
    type: "email",
    label: "Email",
    placeholder: "Enter your email",
    required: true,
  },
];

const signIn = async () => {
  navigateTo("/chat");
  toast.add({
    title: "Přihlášení přes SSO",
    description: "Podařilo se přihlásit přes SSO",
  });
};

function onSubmit() {
  console.log("onSubmit");
  signIn();
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4 h-full">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        :schema="schema"
        title="Log in through SSO"
        icon="i-lucide-key"
        :fields="fields"
        @submit="onSubmit"
      />
    </UPageCard>
  </div>
</template>
