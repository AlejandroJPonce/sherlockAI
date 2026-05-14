import OpenAI from "openai";
import { toFile } from "openai";

export const transcribeAudio = async (audioBuffer, filename) => {
  // inicializacion del clinete OpenAI
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const file = await toFile(audioBuffer, filename, {
      type: "audio/mpeg",
    });

    const transcription = await openai.audio.transcriptions.create({
      file,
      model: "whisper-1",
      language: "es",
    });

    return transcription.text;
  } catch (error) {
    throw new Error(`Whisper error: ${error.message}`);
  }
};
