# Agentic Outreach (Email + Voice Follow-up)

- Next.js app to collect leads, send cold email, and auto-call after 24h if no reply.
- Optional integrations: Resend for email, Twilio for telephony, Vercel KV for storage.

## Env
See `.env.example` and set `PUBLIC_BASE_URL` to your deployment URL.

## Dev
- `npm install`
- `npm run dev`

## Deploy
- Configured Vercel cron at 14:00 UTC daily: `/api/outreach/cron`.
