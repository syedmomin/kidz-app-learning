import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import { CallRecord, TranscriptItem } from '../models/call.model';
import * as TwilioService from './twilio.service';
import * as TTSService from './openai-tts.service';

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'calls.json');

async function ensureDataFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, '[]', 'utf-8');
  }
}

async function readAll(): Promise<CallRecord[]> {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, 'utf-8');
  try {
    return JSON.parse(raw) as CallRecord[];
  } catch {
    return [];
  }
}

async function writeAll(calls: CallRecord[]) {
  await ensureDataFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(calls, null, 2), 'utf-8');
}

function generateId(): string {
  const anyCrypto = crypto as any;
  if (typeof anyCrypto.randomUUID === 'function') return anyCrypto.randomUUID();
  const bytes = crypto.randomBytes(16);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.toString('hex');
  return `${hex.substr(0,8)}-${hex.substr(8,4)}-${hex.substr(12,4)}-${hex.substr(16,4)}-${hex.substr(20,12)}`;
}

/**
 * Start a real outbound call using Twilio and AI voice.
 */
export async function startCall(payload: {
  name: string;
  phone: string;
  script: string;
  voice: string;
}): Promise<{ callId: string; twilioSid?: string }> {
  const callId = generateId();
  const now = Date.now();
  
  const record: CallRecord = {
    callId,
    name: payload.name,
    phone: payload.phone,
    script: payload.script,
    voice: payload.voice,
    status: 'ongoing',
    startedAt: now,
    transcript: [],
  };

  const calls = await readAll();
  calls.unshift(record);
  await writeAll(calls);

  // Kick off real Twilio call asynchronously
  (async () => {
    try {
      // Generate AI voice from script using OpenAI TTS
      const audioPath = await TTSService.generateSpeech(payload.script, callId);
      console.log(`Generated AI speech: ${audioPath}`);

      // Initiate Twilio call
      const twilioResult = await TwilioService.initiateOutboundCall(
        payload.phone,
        `http://your-domain.com/api/call/twiml?callId=${callId}&audioPath=${encodeURIComponent(audioPath)}`
      );

      // Update call record with Twilio SID
      const allCalls = await readAll();
      const idx = allCalls.findIndex(c => c.callId === callId);
      if (idx !== -1) {
        allCalls[idx].meta = { twilioSid: twilioResult.callSid };
        await writeAll(allCalls);
      }

      // Add initial AI message to transcript
      const allCallsAgain = await readAll();
      const idx2 = allCallsAgain.findIndex(c => c.callId === callId);
      if (idx2 !== -1) {
        allCallsAgain[idx2].transcript.push({
          speaker: 'ai',
          text: payload.script,
          timestamp: new Date().toISOString(),
        });
        await writeAll(allCallsAgain);
      }
    } catch (err) {
      console.error('Call initiation error:', err);
      const allCalls = await readAll();
      const idx = allCalls.findIndex(c => c.callId === callId);
      if (idx !== -1) {
        allCalls[idx].status = 'failed';
        await writeAll(allCalls);
      }
    }
  })();

  return { callId, twilioSid: undefined };
}

export async function streamUserAudio(callId: string, audioChunk: Buffer): Promise<void> {
  const calls = await readAll();
  const idx = calls.findIndex(c => c.callId === callId);
  if (idx === -1) throw new Error('Call not found');

  try {
    // Transcribe audio using Whisper
    // (In production, accumulate chunks and batch transcribe)
    calls[idx].transcript.push({
      speaker: 'user',
      text: '[user-audio-received]',
      timestamp: new Date().toISOString(),
    });
    await writeAll(calls);
  } catch (err) {
    console.error('Stream audio error:', err);
  }
}

export async function stopCall(callId: string): Promise<boolean> {
  const calls = await readAll();
  const idx = calls.findIndex(c => c.callId === callId);
  if (idx === -1) return false;
  calls[idx].status = 'completed';
  calls[idx].endedAt = Date.now();
  calls[idx].duration = Math.max(1, Math.round((calls[idx].endedAt - calls[idx].startedAt) / 1000));
  await writeAll(calls);
  return true;
}

export async function getCallStatus(callId: string): Promise<{
  status: CallRecord['status'];
  duration: number;
  transcript: TranscriptItem[];
} | null> {
  const calls = await readAll();
  const rec = calls.find(c => c.callId === callId);
  if (!rec) return null;
  return {
    status: rec.status,
    duration: rec.duration ?? Math.max(0, Math.round((Date.now() - rec.startedAt) / 1000)),
    transcript: rec.transcript,
  };
}
