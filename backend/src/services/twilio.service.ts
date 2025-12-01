import twilio from 'twilio';
import { TWILIO_CONFIG } from '../config/openai';

const client = twilio(TWILIO_CONFIG.ACCOUNT_SID, TWILIO_CONFIG.AUTH_TOKEN);

export async function initiateOutboundCall(phoneNumber: string, twimlUrl: string): Promise<{ callSid: string }> {
  try {
    const call = await client.calls.create({
      to: phoneNumber,
      from: TWILIO_CONFIG.PHONE_NUMBER,
      url: twimlUrl,
      statusCallback: `${TWILIO_CONFIG.TWIML_URL}/status`,
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
    });
    return { callSid: call.sid };
  } catch (err) {
    console.error('Twilio call initiation error:', err);
    throw err;
  }
}

export async function getCallStatus(callSid: string): Promise<any> {
  try {
    const call = await client.calls(callSid).fetch();
    return {
      sid: call.sid,
      status: call.status,
      duration: call.duration || 0,
      startTime: call.startTime,
      endTime: call.endTime,
    };
  } catch (err) {
    console.error('Twilio fetch error:', err);
    throw err;
  }
}
