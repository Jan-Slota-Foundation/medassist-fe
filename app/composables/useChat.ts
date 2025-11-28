interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  parts: { type: "text"; text: string }[];
}

const useChat = () => {
  const messages = useState<ChatMessage[]>("chatMessages", () => []);

  const messageInput = useState<string>("chatMessageInput", () => "");

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

  const setMessageInput = (message: string) => {
    messageInput.value = message;
  };

  return {
    messages,
    messageInput,
    setMessageInput,
    handleSubmit,
  };
};

export default useChat;
