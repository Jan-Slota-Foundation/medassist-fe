<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent, AuthFormField } from "@nuxt/ui";

definePageMeta({
  layout: "login",
});

const supabase = useSupabaseClient();
const toast = useToast();

const schema = z.object({
  email: z.email(),
  password: z.string().min(8),
  remember: z.boolean().optional(),
});

const fields: AuthFormField[] = [
  {
    name: "email",
    type: "email",
    label: "Email",
    placeholder: "Enter your email",
    required: true,
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
    required: true,
  },
  {
    name: "remember",
    label: "Remember me",
    type: "checkbox",
  },
];

type Schema = z.output<typeof schema>;

const signInWithEmailAndPassword = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error)
    toast.add({
      title: "Error",
      description: error.message,
    });

  if (data) {
    navigateTo("/chat");
    toast.add({
      title: "Success",
      description: "You are logged in",
    });
  }
};

function onSubmit(payload: FormSubmitEvent<Schema>) {
  signInWithEmailAndPassword(payload.data.email, payload.data.password);
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4 h-full">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        :schema="schema"
        title="Login"
        description="Enter your credentials to access your account."
        icon="i-lucide-user"
        :fields="fields"
        @submit="onSubmit"
      />
    </UPageCard>
  </div>
</template>
