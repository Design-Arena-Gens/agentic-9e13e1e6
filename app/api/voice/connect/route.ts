import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const digits = (form.get('Digits') || '').toString();
  // For demo, simply thank and hang up.
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>\n<Response>\n  <Say voice=\"Polly.Joanna\">Thanks. A teammate will reach out shortly.</Say>\n  <Hangup/>\n</Response>`;
  return new Response(twiml, { headers: { 'Content-Type': 'text/xml' } });
}
