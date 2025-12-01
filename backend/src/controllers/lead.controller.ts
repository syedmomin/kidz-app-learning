import { Request, Response } from 'express';
import * as LeadService from '../services/lead.service';
import * as PhoneVerify from '../services/phone-verify.service';
import { LeadCreateSchema, ScheduleSchema } from '../validators/lead.schema';
import { ok, created, bad, fail } from '../utils/response';

export async function getContacts(req: Request, res: Response) {
  try {
    const leads = await LeadService.getLeads();
    return ok(res, { leads });
  } catch (err) {
    console.error('getContacts error:', err);
    return fail(res, 500, 'Failed to load leads');
  }
}

export async function addLead(req: Request, res: Response) {
  const parsed = LeadCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return bad(res, 400, parsed.error.errors.map(e => e.message).join(', '));
  }
  try {
    const lead = await LeadService.addLead(parsed.data);
    return created(res, { lead });
  } catch (err) {
    console.error('addLead error:', err);
    return fail(res, 500, 'Failed to add lead');
  }
}

export async function startCall(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const updated = await LeadService.updateLead(id, { status: 'ongoing', scheduledAt: null });
    if (!updated) return bad(res, 404, 'Lead not found');
    return ok(res, { lead: updated });
  } catch (err) {
    console.error('startCall error:', err);
    return fail(res, 500, 'Failed to start call');
  }
}

export async function scheduleCall(req: Request, res: Response) {
  const parsed = ScheduleSchema.safeParse(req.body);
  if (!parsed.success) {
    return bad(res, 400, parsed.error.errors.map(e => e.message).join(', '));
  }
  try {
    const id = req.params.id;
    const updated = await LeadService.updateLead(id, { status: 'scheduled', scheduledAt: parsed.data.scheduledAt });
    if (!updated) return bad(res, 404, 'Lead not found');
    return ok(res, { lead: updated });
  } catch (err) {
    console.error('scheduleCall error:', err);
    return fail(res, 500, 'Failed to schedule call');
  }
}

export async function deleteLead(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const deleted = await LeadService.deleteLead(id);
    if (!deleted) return bad(res, 404, 'Lead not found');
    return ok(res, {});
  } catch (err) {
    console.error('deleteLead error:', err);
    return fail(res, 500, 'Failed to delete lead');
  }
}
