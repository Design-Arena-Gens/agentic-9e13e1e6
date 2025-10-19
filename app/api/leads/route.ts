import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { v4 as uuid } from 'uuid';
import { Lead, getLeads, saveLeads, upsertLead } from '../../../lib/storage';
import { sendColdEmail } from '../../../lib/outreach';

const LeadSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(7).optional()
}).refine((d) => Boolean(d.email || d.phone), { message: 'email_or_phone_required' });

export async function GET() {
  const leads = await getLeads();
  return NextResponse.json({ ok: true, leads });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parse = LeadSchema.safeParse(body);
  if (!parse.success) return NextResponse.json({ ok: false, error: parse.error.issues[0]?.message || 'invalid' }, { status: 400 });
  const { name, email, phone } = parse.data;
  const lead: Lead = {
    id: uuid(),
    name,
    email,
    phone,
    createdAt: Date.now(),
    lastEmailAt: undefined,
    lastCallAt: undefined,
    lastResponseAt: undefined
  };

  await upsertLead(lead);

  if (email) {
    const sent = await sendColdEmail({ to: email });
    if ('id' in sent) {
      lead.lastEmailAt = Date.now();
      await upsertLead(lead);
    }
  }

  return NextResponse.json({ ok: true, lead });
}
