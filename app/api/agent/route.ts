import { NextRequest, NextResponse } from 'next/server';
import { getLeads } from '../../../lib/storage';
import { nextBusinessDayLabel } from '../../../lib/outreach';

export async function POST(req: NextRequest) {
  const { message } = await req.json();
  const text: string = String(message || '').toLowerCase();
  if (!text) return NextResponse.json({ reply: "Please enter a message." });

  if (text.includes('status') || text.includes('how many')) {
    const leads = await getLeads();
    const pending = leads.filter((l) => !l.lastResponseAt).length;
    return NextResponse.json({ reply: `I have ${leads.length} leads tracked, ${pending} awaiting response.` });
  }

  if (text.includes('draft') || text.includes('email')) {
    const example = `Subject: Quick intro\n\nHi {{name}},\n\nWanted to share a quick overview of our solution. If helpful, I can give you a brief call tomorrow (${nextBusinessDayLabel(Date.now())}).\n\nBest,\nAgent`;
    return NextResponse.json({ reply: example });
  }

  return NextResponse.json({ reply: "Got it. Save a lead with email/phone above, and I’ll handle outreach + auto-call after 24h if no reply." });
}
