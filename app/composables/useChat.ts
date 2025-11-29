interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  parts: { type: "text"; text: string }[];
}

const n8nWebhookUrl =
  "https://hadedvade.app.n8n.cloud/webhook/73d397dd-7f61-4f67-aae8-860bd7606d49";

const useChat = () => {
  const messages = useState<ChatMessage[]>("chatMessages", () => []);
  const messageInput = useState<string>("chatMessageInput", () => "");
  const isLoading = useState<boolean>("chatIsLoading", () => false);

  const setIsLoading = (value: boolean) => {
    isLoading.value = value;
  };

  const clearInput = () => {
    messageInput.value = "";
  };

  const addUserMessage = (message: string) => {
    messages.value.push({
      id: crypto.randomUUID(),
      role: "user",
      parts: [{ type: "text", text: message }],
    });
  };

  const addAssistantMessage = (message: string) => {
    messages.value.push({
      id: crypto.randomUUID(),
      role: "assistant",
      parts: [{ type: "text", text: message }],
    });
  };

  const handleSubmit = async (message: string) => {
    addUserMessage(message);
    clearInput();
    setIsLoading(true);
    try {
      const data = await $fetch(n8nWebhookUrl, {
        method: "POST",
        body: JSON.stringify({ prompt: message }),
      });
      addAssistantMessage((data as { output: string }).output);
    } catch (error) {
      console.error(error);
      addAssistantMessage("Omlouvám se, ale došlo k chybě. Zkuste to znovu.");
    } finally {
      setIsLoading(false);
    }
  };

  const setMessageInput = (message: string) => {
    messageInput.value = message;
  };

  return {
    messages,
    messageInput,
    setMessageInput,
    handleSubmit,
    isLoading,
  };
};

export default useChat;
