type TtsPlayer = {
  audio: HTMLAudioElement;
  objectUrl: string | null;
  mediaSource: MediaSource | null;
  abortController: AbortController;
};

export const useTextToSpeech = () => {
  // A ref is used here to allow for components having different statuses (see @components/AssistantMessage/actions/TextToVoiceButton.vue)
  const status = ref<"idle" | "speaking" | "paused">("idle");
  const player = shallowRef<TtsPlayer | null>(null);
  const isClient = import.meta.client;

  const cleanupPlayer = () => {
    if (!isClient) {
      return;
    }

    if (!player.value) {
      return;
    }

    player.value.abortController.abort();
    player.value.audio.pause();
    player.value.audio.src = "";

    if (player.value.objectUrl) {
      URL.revokeObjectURL(player.value.objectUrl);
    }

    player.value = null;
  };

  const attachAudioStatusListeners = (audio: HTMLAudioElement) => {
    audio.addEventListener("play", () => {
      status.value = "speaking";
    });

    audio.addEventListener("pause", () => {
      if (!audio.ended) {
        status.value = "paused";
      }
    });

    audio.addEventListener("ended", () => {
      status.value = "idle";
      cleanupPlayer();
    });

    audio.addEventListener("error", () => {
      status.value = "idle";
      cleanupPlayer();
    });
  };

  const startStreamingPlayback = (
    stream: ReadableStream<Uint8Array>,
    currentPlayer: TtsPlayer,
    mimeType: string
  ) => {
    const mediaSource = new MediaSource();
    const sourceType = mimeType.includes("mpeg") ? "audio/mpeg" : mimeType;
    const objectUrl = URL.createObjectURL(mediaSource);

    currentPlayer.mediaSource = mediaSource;
    currentPlayer.objectUrl = objectUrl;
    currentPlayer.audio.src = objectUrl;
    currentPlayer.audio.load();

    mediaSource.addEventListener("sourceopen", () => {
      let sourceBuffer: SourceBuffer;

      try {
        sourceBuffer = mediaSource.addSourceBuffer(sourceType);
      } catch {
        mediaSource.endOfStream();
        return;
      }

      const reader = stream.getReader();
      const queue: Uint8Array[] = [];
      let isDone = false;
      let hasStarted = false;

      const tryPlay = () => {
        if (!hasStarted) {
          hasStarted = true;
          currentPlayer.audio.play().catch(() => {
            // Autoplay restrictions may block playback; ignore and allow manual play.
          });
        }
      };

      const appendNextChunk = () => {
        if (sourceBuffer.updating || queue.length === 0) {
          if (!sourceBuffer.updating && queue.length === 0 && isDone) {
            mediaSource.endOfStream();
          }
          return;
        }

        const chunk = queue.shift()!;
        const bufferSlice = chunk.buffer.slice(
          chunk.byteOffset,
          chunk.byteOffset + chunk.byteLength
        );

        try {
          sourceBuffer.appendBuffer(bufferSlice);
          tryPlay();
        } catch {
          mediaSource.endOfStream();
        }
      };

      const pump = () => {
        reader
          .read()
          .then(({ done, value }) => {
            if (done) {
              isDone = true;
              if (!sourceBuffer.updating && queue.length === 0) {
                mediaSource.endOfStream();
              }
              return;
            }

            if (value) {
              queue.push(value);
              if (!sourceBuffer.updating) {
                appendNextChunk();
              }
            }

            pump();
          })
          .catch(() => {
            mediaSource.endOfStream();
          });
      };

      sourceBuffer.addEventListener("updateend", () => {
        if (queue.length > 0) {
          appendNextChunk();
        } else if (isDone) {
          mediaSource.endOfStream();
        }
      });

      pump();
    });
  };

  const bufferAndPlay = async (
    response: Response,
    currentPlayer: TtsPlayer,
    mimeType: string
  ) => {
    const arrayBuffer = await response.arrayBuffer();
    const objectUrl = URL.createObjectURL(
      new Blob([arrayBuffer], { type: mimeType })
    );

    currentPlayer.objectUrl = objectUrl;
    currentPlayer.audio.src = objectUrl;
    currentPlayer.audio.load();

    await currentPlayer.audio.play().catch(() => {
      // Autoplay restrictions will require a user gesture; nothing to do here.
    });
  };

  const convertTextToSpeech = async (text: string) => {
    if (!isClient || !text.trim()) {
      return;
    }

    cleanupPlayer();

    const abortController = new AbortController();
    const audio = new Audio();
    audio.preload = "auto";

    const currentPlayer: TtsPlayer = {
      audio,
      abortController,
      objectUrl: null,
      mediaSource: null,
    };

    player.value = currentPlayer;
    attachAudioStatusListeners(audio);

    status.value = "speaking";

    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
        signal: abortController.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error(await response.text());
      }

      const mimeType = response.headers.get("content-type") ?? "audio/mpeg";
      const canUseMediaSource =
        "MediaSource" in window &&
        typeof MediaSource.isTypeSupported === "function" &&
        MediaSource.isTypeSupported(
          mimeType.includes("mpeg") ? "audio/mpeg" : mimeType
        );

      if (canUseMediaSource) {
        startStreamingPlayback(response.body, currentPlayer, mimeType);
      } else {
        await bufferAndPlay(response, currentPlayer, mimeType);
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      console.error("Text-to-speech streaming failed", error);
      status.value = "idle";
      cleanupPlayer();
    }
  };

  return {
    convertTextToSpeech,
    status: readonly(status),
  };
};
