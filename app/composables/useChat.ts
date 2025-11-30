interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  parts: { type: "text"; text: string }[];
  source_file?: string;
}

const n8nWebhookUrlProd =
  "https://mnau.app.n8n.cloud/webhook/75d8685b-a80d-4624-8c80-311c271db8cb";
const n8nWebhookUrlDev =
  "https://mnau.app.n8n.cloud/webhook-test/75d8685b-a80d-4624-8c80-311c271db8cb";

const isProd = true;
const n8nWebhookUrl = isProd ? n8nWebhookUrlProd : n8nWebhookUrlDev;

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

  const addAssistantMessage = (message: string, sourceFile?: string) => {
    messages.value.push({
      id: crypto.randomUUID(),
      role: "assistant",
      parts: [{ type: "text", text: message }],
      source_file: sourceFile,
    });
  };

  const handleSubmit = async (message: string) => {
    addUserMessage(message);
    clearInput();
    setIsLoading(true);
    try {
      const data = await $fetch(n8nWebhookUrl, {
        method: "POST",
        body: JSON.stringify({
          prompt: message,
          // TODO: rework to keep in session
          session_id: "ahoj123",
        }),
      });
      console.log(data);
      const response = data as { output: string; source_file?: string };
      addAssistantMessage(response.output, response.source_file);
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
