// The browser NEVER talks to the WhatsApp Cloud API directly — that would
// require shipping your access token to every visitor's browser. Instead we
// call our own serverless function (/api/notify-whatsapp), which holds the
// token server-side and forwards the message to Meta.

export async function notifyAdminWhatsApp(payload) {
  try {
    const res = await fetch('/api/notify-whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error('WhatsApp notify failed:', text);
      return { ok: false };
    }
    return { ok: true };
  } catch (err) {
    console.error('WhatsApp notify error:', err);
    return { ok: false };
  }
}

// Builds a readable order summary message for the admin's WhatsApp.
export function formatOrderMessage(order) {
  const lines = [
    `🍼 *New Order — Sweet Angels*`,
    `Order ID: ${order.id}`,
    `Customer: ${order.shipping.fullName}`,
    `Phone: ${order.shipping.phone}`,
    `Address: ${order.shipping.address}, ${order.shipping.city}, ${order.shipping.state} - ${order.shipping.pincode}`,
    ``,
    `Items:`,
    ...order.items.map((it) => `• ${it.name} (${it.size || 'One size'}) x${it.qty} — ₹${it.price * it.qty}`),
    ``,
    `Total: ₹${order.total}`,
    `Payment: ${order.paymentMethod || 'COD'}`,
  ];
  return lines.join('\n');
}
