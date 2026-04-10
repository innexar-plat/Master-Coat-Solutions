import type { LeadRecord } from "@/modules/leads/dtos/create-lead.dto";

type ResendPayload = {
  from: string;
  to: string[];
  subject: string;
  html: string;
};

export async function notifyNewLead(record: LeadRecord): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const destination = process.env.LEADS_NOTIFICATION_EMAIL;

  if (!apiKey || !destination) {
    console.info("[LeadNotification] Notification skipped (missing RESEND_API_KEY or LEADS_NOTIFICATION_EMAIL)", {
      leadId: record.id
    });
    return;
  }

  const payload: ResendPayload = {
    from: "leads@vinipainting.com",
    to: [destination],
    subject: `New lead: ${record.name}`,
    html: `<p><strong>Name:</strong> ${record.name}</p>
      <p><strong>Phone:</strong> ${record.phone}</p>
      <p><strong>Email:</strong> ${record.email ?? "-"}</p>
      <p><strong>Service:</strong> ${record.service}</p>
      <p><strong>Message:</strong> ${record.message ?? "-"}</p>
      <p><strong>Source:</strong> ${record.source}</p>
      <p><strong>Locale:</strong> ${record.locale}</p>`
  };

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    console.error("[LeadNotification] Resend API request failed", {
      status: response.status,
      leadId: record.id
    });
  }
}
