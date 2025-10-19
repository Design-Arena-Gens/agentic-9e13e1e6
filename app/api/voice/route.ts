import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const msg = searchParams.get('msg') || 'Hello, following up on my email from yesterday.';
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>\n<Response>\n  <Say voice="Polly.Joanna">${msg}</Say>\n  <Pause length="1"/>\n  <Say voice="Polly.Joanna">If you would like to connect now, press 1.</Say>\n  <Gather numDigits="1" timeout="5" action="/api/voice/connect" method="POST"/>\n  <Say>Goodbye!</Say>\n</Response>`;
  return new Response(twiml, { headers: { 'Content-Type': 'text/xml' } });
}
