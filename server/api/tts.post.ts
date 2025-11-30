import { Readable } from "node:stream";
import type { ReadableStream as NodeReadableStream } from "node:stream/web";
import { createError, sendStream, setHeader } from "h3";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody<{
    text?: string;
  }>(event);

  if (!config.elevenlabsApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: "Missing ElevenLabs API key",
    });
  }

  const text = body?.text?.trim();
  if (!text) {
    throw createError({
      statusCode: 400,
      statusMessage: "Text is required",
    });
  }

  const query = new URLSearchParams({ output_format: "mp3_44100_128" });
  const elevenResponse = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/uYFJyGaibp4N2VwYQshk/stream?${query.toString()}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": config.elevenlabsApiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          speed: 1.2,
        },
      }),
    }
  );

  if (!elevenResponse.ok || !elevenResponse.body) {
    const message = await elevenResponse
      .text()
      .catch(() => "Failed to fetch audio stream");
    throw createError({
      statusCode: elevenResponse.status || 502,
      statusMessage: message,
    });
  }

  const mimeType = elevenResponse.headers.get("content-type") ?? "audio/mpeg";
  const nodeStream = Readable.fromWeb(
    elevenResponse.body as unknown as NodeReadableStream<Uint8Array>
  );

  setHeader(event, "Content-Type", mimeType);
  setHeader(event, "Cache-Control", "no-store");

  return sendStream(event, nodeStream);
});
