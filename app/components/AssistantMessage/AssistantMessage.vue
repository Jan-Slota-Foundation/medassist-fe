<script setup lang="ts">
import { getTextFromMessage } from "@nuxt/ui/utils/ai";
import { inTextShortCuts } from "~/utils/inTextShortCuts";

type ChatMessage = Parameters<typeof getTextFromMessage>[0];
type ShortcutKey = Extract<keyof typeof inTextShortCuts, string>;

defineProps<{
  message: ChatMessage;
}>();

const shortcutKeys = Object.keys(inTextShortCuts) as ShortcutKey[];
const shortcutKeySet = new Set(shortcutKeys);
const escapeForRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const shortcutPattern =
  shortcutKeys.length > 0
    ? new RegExp(`(${shortcutKeys.map(escapeForRegex).join("|")})`, "g")
    : null;

const getMessageSegments = (message: ChatMessage) => {
  const text = getTextFromMessage(message) || "";
  if (!shortcutPattern) {
    return [text];
  }
  return text.split(shortcutPattern).filter((segment) => segment.length);
};

const hasShortcut = (segment: string): segment is ShortcutKey =>
  shortcutKeySet.has(segment);
const getShortcutValue = (segment: ShortcutKey) => inTextShortCuts[segment];
</script>

<template>
  <span class="whitespace-pre-wrap leading-relaxed">
    <template
      v-for="(segment, index) in getMessageSegments(message)"
      :key="`${message.id}-${index}`"
    >
      <UTooltip
        v-if="hasShortcut(segment)"
        :text="getShortcutValue(segment)"
        class="inline"
      >
        <UBadge color="primary" variant="soft" class="cursor-help">
          {{ segment }}
        </UBadge>
      </UTooltip>
      <span v-else>{{ segment }}</span>
    </template>
    <div v-if="message.role === 'assistant'" class="flex gap-2 mt-2">
      <slot name="actions" />
    </div>
  </span>
</template>
