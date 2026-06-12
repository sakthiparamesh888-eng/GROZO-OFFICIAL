// =============================================================
//  GROZO — WhatsApp checkout message builder
// =============================================================

import { rupee, effectivePrice } from './format.js';

// Build the human-readable order text sent over WhatsApp.
// Each line carries the chosen variant/unit so the shop knows
// exactly what to pack.
export function buildOrderMessage({ orderId, customer, items, total, settings }) {
  const lines = [];
  lines.push(`*New Order — ${settings.site_name || 'GROZO'}* 🌿`);
  if (orderId) lines.push(`*Order #${orderId}*`);
  lines.push('');
  lines.push('*Customer*');
  lines.push(`Name: ${customer.name}`);
  lines.push(`Phone: ${customer.phone}`);
  lines.push(`Address: ${customer.address}`);
  if (customer.landmark) lines.push(`Landmark: ${customer.landmark}`);
  if (customer.notes) lines.push(`Notes: ${customer.notes}`);
  lines.push('');
  lines.push('*Items*');
  items.forEach((it) => {
    const tag = it.variant ? ` (${it.variant})` : '';
    lines.push(
      `• ${it.name}${tag} x ${it.qty} = ${rupee(effectivePrice(it) * it.qty)}`
    );
  });
  lines.push('');
  lines.push(`*Grand Total = ${rupee(total)}*`);
  lines.push(`_${settings.delivery_message || 'No Delivery Charges'}_`);
  return lines.join('\n');
}

// Compose the wa.me link. whatsapp number should be full intl form,
// e.g. 919876543210.
export function whatsappLink(number, message) {
  const clean = String(number || '').replace(/[^0-9]/g, '');
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}
