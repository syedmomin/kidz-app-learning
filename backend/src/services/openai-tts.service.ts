import OpenAI from 'openai';
import { OPENAI_CONFIG } from '../config/openai';
import fs from 'fs/promises';
import path from 'path';

const openai = new OpenAI({ apiKey: OPENAI_CONFIG.API_KEY });

const AUDIO_DIR = path.join(__dirname, '..', 'data', 'audio');

async function ensureAudioDir() {
  try {
    await fs.mkdir(AUDIO_DIR, { recursive: true });
  } catch (err) {
    console.error('Error creating audio dir:', err);
  }
}

/**
 * Generate speech from text using OpenAI TTS.
 * Returns path to the generated audio file.
 */
export async function generateSpeech(text: string, callId: string): Promise<string> {
  try {
    await ensureAudioDir();
    
    const mp3 = await openai.audio.speech.create({
      model: OPENAI_CONFIG.TTS_MODEL,
      voice: OPENAI_CONFIG.VOICE as any,
      input: text,
      speed: 1.0,
    });

    const audioPath = path.join(AUDIO_DIR, `${callId}-${Date.now()}.mp3`);
    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.writeFile(audioPath, buffer);

    return audioPath;
  } catch (err) {
    console.error('OpenAI TTS error:', err);
    throw err;
  }
}

/**
 * Transcribe audio using OpenAI Whisper.
 */
export async function transcribeAudio(audioPath: string): Promise<string> {
  try {
    const file = await fs.readFile(audioPath);
    const transcript = await openai.audio.transcriptions.create({
      model: OPENAI_CONFIG.WHISPER_MODEL,
      file: new File([file], 'audio.wav', { type: 'audio/wav' }),
    });
    return transcript.text;
  } catch (err) {
    console.error('Whisper transcription error:', err);
    throw err;
  }
}
