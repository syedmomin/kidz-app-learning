export const OPENAI_CONFIG = {
  API_KEY: process.env.OPENAI_API_KEY || '',
  TTS_MODEL: 'tts-1-hd',
  VOICE: 'nova', // Options: alloy, echo, fable, onyx, nova, shimmer
  WHISPER_MODEL: 'whisper-1',
};

export const OPENAI = {
  API_KEY: process.env.OPENAI_API_KEY || '',
  REALTIME_ENDPOINT: process.env.OPENAI_REALTIME_ENDPOINT || 'https://api.openai.com/v1/realtime',
  AVAILABLE_VOICES: ['female_calm', 'male_deep', 'female_energetic'] as const,
};

export const TWILIO_CONFIG = {
  ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || '',
  AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || '',
  PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER || '', // Your Twilio number
  TWIML_URL: process.env.TWIML_URL || 'http://localhost:4000/api/call/twiml', // Webhook for call handling
};
