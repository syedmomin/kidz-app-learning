/**
 * Phone verification service.
 * Placeholder for integrating with external services like Twilio, Firebase, etc.
 * For now, basic validation + mock verification.
 */

export async function verifyPhoneNumber(phone: string): Promise<{ valid: boolean; verified: boolean; message: string }> {
  // Basic format check
  const formatValid = /^[0-9+]{10,15}$/.test(phone);
  if (!formatValid) {
    return { valid: false, verified: false, message: 'Invalid phone format' };
  }

  // TODO: Integrate with external verification API (Twilio, Firebase Phone Auth, etc.)
  // For now, consider it verified if format is valid
  return { valid: true, verified: true, message: 'Phone number verified' };
}

export async function checkPhoneBlacklist(phone: string): Promise<{ blocked: boolean; reason?: string }> {
  // TODO: Check against DND (Do Not Disturb) / blacklist
  // Placeholder: return not blocked
  return { blocked: false };
}
