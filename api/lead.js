import { escapeHtml, sendEmail, saveSubmission } from "./_utils.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const data = req.body || {};
    const naam = String(data.naam || "").trim();
    const email = String(data.email || "").trim();
    const organisatie = String(data.organisatie || "").trim();

    if (!naam || !email) return res.status(400).json({ error: "Naam en e-mail zijn verplicht." });

    await sendEmail({
      to: process.env.LEAD_TO_EMAIL || "info@bakermatvm.nl",
      subject: "Nieuwe start Bakermat VastgoedKompas",
      html: `
        <div style="font-family:Arial,sans-serif;color:#12213a;line-height:1.55;">
          <h2 style="color:#071f3f;">Nieuwe start Bakermat VastgoedKompas</h2>
          <p><strong>Naam:</strong> ${escapeHtml(naam)}</p>
          <p><strong>Organisatie:</strong> ${escapeHtml(organisatie)}</p>
          <p><strong>E-mail:</strong> ${escapeHtml(email)}</p>
          <p><strong>Pagina:</strong> ${escapeHtml(data.pagina || "")}</p>
          <p><strong>Datum:</strong> ${escapeHtml(data.datum || new Date().toISOString())}</p>
        </div>`
    });

    await saveSubmission({ type: "lead", ...data, created_at: new Date().toISOString() });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Lead kon niet worden verwerkt." });
  }
}
