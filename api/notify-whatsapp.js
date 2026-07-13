// Vercel Serverless Function — runs on the server only.
// This is the ONLY place the WhatsApp access token is ever read or used.
// Set these in Vercel Project Settings → Environment Variables
// (plain names, NOT prefixed with VITE_, so they never reach the browser):
//   WHATSAPP_TOKEN
//   WHATSAPP_PHONE_NUMBER_ID
//   WHATSAPP_ADMIN_NUMBER

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body || {};
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Missing "message" string in request body' });
  }

  const TOKEN = process.env.WHATSAPP_TOKEN;
  const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const ADMIN_NUMBER = process.env.WHATSAPP_ADMIN_NUMBER;

  if (!TOKEN || !PHONE_NUMBER_ID || !ADMIN_NUMBER) {
    console.error('WhatsApp env vars not configured on the server');
    return res.status(500).json({ error: 'Server not configured' });
  }

  try {
    const metaRes = await fetch(
      `https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: ADMIN_NUMBER,
          type: 'text',
          text: { body: message },
        }),
      }
    );

    const data = await metaRes.json();

    if (!metaRes.ok) {
      console.error('Meta API error:', data);
      return res.status(502).json({ error: 'WhatsApp API error', details: data });
    }

    return res.status(200).json({ ok: true, data });
  } catch (err) {
    console.error('notify-whatsapp handler error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
