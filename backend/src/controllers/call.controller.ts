import { Request, Response } from 'express';
import * as CallService from '../services/call.service';
import * as PhoneVerify from '../services/phone-verify.service';
import { StartCallSchema, StopCallSchema } from '../validators/call.schema';
import { ok, created, bad, fail } from '../utils/response';

export async function startCall(req: Request, res: Response) {
  const parsed = StartCallSchema.safeParse(req.body);
  if (!parsed.success) return bad(res, 400, parsed.error.errors.map(e => e.message).join(', '));

  try {
    const { phone } = parsed.data;
    const phoneCheck = await PhoneVerify.verifyPhoneNumber(phone);
    if (!phoneCheck.valid) {
      return bad(res, 400, `Phone verification failed: ${phoneCheck.message}`);
    }

    const blacklistCheck = await PhoneVerify.checkPhoneBlacklist(phone);
    if (blacklistCheck.blocked) {
      return bad(res, 403, `Phone number blocked: ${blacklistCheck.reason || 'Unknown'}`);
    }

    const result = await CallService.startCall(parsed.data);
    return created(res, { callId: result.callId, message: 'Outbound call initiated to customer' });
  } catch (err) {
    console.error('startCall error:', err);
    return fail(res, 500, 'Failed to start call');
  }
}

export async function streamUser(req: Request, res: Response) {
  try {
    const { callId } = req.body || req.query;
    if (!callId) return bad(res, 400, 'callId is required');
    await CallService.streamUserAudio(callId, Buffer.from(''));
    return ok(res, { message: 'Audio chunk processed' });
  } catch (err) {
    console.error('streamUser error:', err);
    return fail(res, 500, 'Failed to process audio');
  }
}

export async function getStatus(req: Request, res: Response) {
  try {
    const { callId } = req.params;
    const status = await CallService.getCallStatus(callId);
    if (!status) return bad(res, 404, 'Call not found');
    return ok(res, status);
  } catch (err) {
    console.error('getStatus error:', err);
    return fail(res, 500, 'Failed to get status');
  }
}

export async function stop(req: Request, res: Response) {
  const parsed = StopCallSchema.safeParse(req.body);
  if (!parsed.success) return bad(res, 400, parsed.error.errors.map(e => e.message).join(', '));
  try {
    const okStop = await CallService.stopCall(parsed.data.callId);
    if (!okStop) return bad(res, 404, 'Call not found');
    return ok(res, { message: 'Call stopped' });
  } catch (err) {
    console.error('stop error:', err);
    return fail(res, 500, 'Failed to stop call');
  }
}

/**
 * TwiML endpoint: Twilio calls this to get instructions for the call.
 * We return XML that tells Twilio to play the AI voice message and record user response.
 */
export async function getTwiML(req: Request, res: Response) {
  try {
    const { callId, audioPath } = req.query;
    if (!callId) return bad(res, 400, 'callId required');

    // Build TwiML response (XML)
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">Connected to AI Sales Agent. Please listen to our offer.</Say>
  <Play>${audioPath || ''}</Play>
  <Record maxLength="30" playBeep="false" />
  <Say>Thank you for listening. Goodbye.</Say>
  <Hangup/>
</Response>`;

    res.type('application/xml').send(twiml);
  } catch (err) {
    console.error('getTwiML error:', err);
    return fail(res, 500, 'Failed to generate TwiML');
  }
}

/**
 * Status callback: Twilio calls this to report call events.
 */
export async function callStatusCallback(req: Request, res: Response) {
  try {
    const { CallSid, CallStatus } = req.body;
    console.log(`Twilio call ${CallSid} status: ${CallStatus}`);
    res.status(200).send('OK');
  } catch (err) {
    console.error('callStatusCallback error:', err);
    res.status(200).send('OK');
  }
}
