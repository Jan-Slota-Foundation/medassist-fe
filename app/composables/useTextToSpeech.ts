export const useTextToSpeech = () => {
  // A ref is used here to allow for components having different statuses (see @components/AssistantMessage/actions/TextToVoiceButton.vue)
  const status = ref<"idle" | "speaking" | "paused">("idle");

  const speakThroughVoice = (voice: SpeechSynthesisUtterance) => {
    voice.lang = "cs-CZ";
    voice.onend = () => {
      status.value = "idle";
    };

    voice.onpause = () => {
      status.value = "paused";
    };
    voice.onresume = () => {
      status.value = "speaking";
    };

    voice.onerror = () => {
      status.value = "idle";
    };

    speechSynthesis.speak(voice);
    status.value = "speaking";
  };

  const convertTextToSpeech = (text: string) => {
    if (!text.trim()) {
      return;
    }

    if (speechSynthesis.speaking || speechSynthesis.pending) {
      speechSynthesis.cancel();
      status.value = "idle";
    }

    speakThroughVoice(new SpeechSynthesisUtterance(text));
  };

  return {
    convertTextToSpeech,
    status: readonly(status),
  };
};
