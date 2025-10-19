import { NextRequest, NextResponse } from 'next/server';
import { getLeads, saveLeads } from '../../../../lib/storage';

// Minimal webhook to mark a lead as responded.
// You can wire this to your email provider's webhook or call manually.
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email = body.email as string | undefined;
  if (!email) return NextResponse.json({ ok: false, error: 'email_required' }, { status: 400 });

  const leads = await getLeads();
  let updated = false;
  for (const l of leads) {
    if (l.email?.toLowerCase() === email.toLowerCase()) {
      l.lastResponseAt = Date.now();
      updated = true;
    }
  }
  if (updated) await saveLeads(leads);
  return NextResponse.json({ ok: true, updated });
}
