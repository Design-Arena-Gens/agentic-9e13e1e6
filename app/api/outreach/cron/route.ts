import { NextResponse } from 'next/server';
import { getLeads, saveLeads } from '../../../../lib/storage';
import { placeFollowupCall } from '../../../../lib/outreach';

export const dynamic = 'force-dynamic';

export async function GET() {
  const leads = await getLeads();
  const now = Date.now();
  const updated = await Promise.all(leads.map(async (lead) => {
    if (lead.lastResponseAt) return lead; // already responded
    const shouldCall = Boolean(lead.phone) && Boolean(lead.lastEmailAt) && now - (lead.lastEmailAt || 0) > 24 * 60 * 60 * 1000 && !lead.lastCallAt;
    if (shouldCall && lead.phone) {
      const resp = await placeFollowupCall({ to: lead.phone });
      if ('sid' in resp) {
        lead.lastCallAt = now;
      }
    }
    return lead;
  }));
  await saveLeads(updated);
  return NextResponse.json({ ok: true, total: updated.length });
}
