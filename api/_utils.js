export function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, s => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[s]);
}

export async function sendEmail({ to, subject, html, attachments = [] }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY ontbreekt. E-mail is niet verzonden.");
    return { skipped: true };
  }

  const from = process.env.MAIL_FROM || "Bakermat VastgoedKompas <noreply@bakermatvm.nl>";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ from, to, subject, html, attachments })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Resend fout: ${text}`);
  }

  return response.json();
}

export async function saveSubmission(payload) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return { skipped: true };

  const response = await fetch(`${url}/rest/v1/vastgoedkompas_submissions`, {
    method: "POST",
    headers: {
      "apikey": key,
      "Authorization": `Bearer ${key}`,
      "Content-Type": "application/json",
      "Prefer": "return=representation"
    },
    body: JSON.stringify({ payload })
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

export async function listSubmissions() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return [];

  const response = await fetch(`${url}/rest/v1/vastgoedkompas_submissions?select=*&order=created_at.desc&limit=500`, {
    headers: {
      "apikey": key,
      "Authorization": `Bearer ${key}`
    }
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

export function requireAdmin(req, res) {
  const token = String(req.query.token || req.headers["x-admin-token"] || "");
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    res.status(401).json({ error: "Geen toegang." });
    return false;
  }
  return true;
}
