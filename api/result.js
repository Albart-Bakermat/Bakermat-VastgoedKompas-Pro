import { escapeHtml, sendEmail, saveSubmission } from "./_utils.js";
import { createResultPdf } from "./_pdf.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const data = req.body || {};
    const naam = String(data.naam || "").trim();
    const email = String(data.email || "").trim();
    if (!naam || !email || typeof data.score === "undefined") {
      return res.status(400).json({ error: "Onvolledige resultaatgegevens." });
    }

    let attachment = null;
    try {
      const pdf = await createResultPdf(data);
      attachment = {
        filename: `Rapport-Bakermat-VastgoedKompas-${safeFile(naam)}.pdf`,
        content: pdf.toString("base64")
      };
    } catch (pdfError) {
      console.warn("PDF kon niet worden gemaakt:", pdfError);
    }

    await sendEmail({
      to: process.env.LEAD_TO_EMAIL || "info@bakermatvm.nl",
      subject: `Resultaat Bakermat VastgoedKompas - ${naam}`,
      html: renderResultEmail(data),
      attachments: attachment ? [attachment] : []
    });

    if (process.env.SEND_VISITOR_COPY === "true") {
      await sendEmail({
        to: email,
        subject: "Uw resultaat van het Bakermat VastgoedKompas",
        html: renderVisitorEmail(data),
        attachments: attachment ? [attachment] : []
      });
    }

    await saveSubmission({ type: "result", ...data, created_at: new Date().toISOString() });

    return res.status(200).json({ ok: true, pdfAttached: Boolean(attachment) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Resultaat kon niet worden verwerkt." });
  }
}

function renderResultEmail(data) {
  const themaRows = (data.themas || []).map(t => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #dfe8e3;">${escapeHtml(t.thema)}</td>
      <td style="padding:8px;border-bottom:1px solid #dfe8e3;"><strong>${escapeHtml(t.score)}%</strong></td>
    </tr>`).join("");

  const antwoorden = (data.antwoorden || []).map(a => `
    <tr>
      <td style="padding:6px;border-bottom:1px solid #eee;">${escapeHtml(a.nummer)}</td>
      <td style="padding:6px;border-bottom:1px solid #eee;">${escapeHtml(a.thema)}</td>
      <td style="padding:6px;border-bottom:1px solid #eee;">${escapeHtml(a.vraag)}</td>
      <td style="padding:6px;border-bottom:1px solid #eee;">${escapeHtml(a.antwoord || "")}</td>
      <td style="padding:6px;border-bottom:1px solid #eee;">${escapeHtml(a.score ?? "")}</td>
    </tr>`).join("");

  return `
    <div style="font-family:Arial,sans-serif;color:#12213a;line-height:1.55;">
      <h1 style="color:#071f3f;">Nieuw resultaat Bakermat VastgoedKompas</h1>
      <p><strong>Naam:</strong> ${escapeHtml(data.naam)}</p>
      <p><strong>Organisatie:</strong> ${escapeHtml(data.organisatie)}</p>
      <p><strong>E-mail:</strong> ${escapeHtml(data.email)}</p>
      <p><strong>Score:</strong> ${escapeHtml(data.score)}%</p>
      <p><strong>Gezondheidsniveau:</strong> ${escapeHtml(data.gezondheidsniveau)}</p>
      <p><strong>Stoplicht:</strong> ${escapeHtml(data.stoplicht)}</p>
      <p><strong>Ingevulde vragen:</strong> ${escapeHtml(data.ingevuld)} van ${escapeHtml(data.totaalVragen)}</p>

      <h2 style="color:#071f3f;">Analyse</h2>
      <p><strong>Samenvatting:</strong><br>${escapeHtml(data.analyse?.samenvatting || "")}</p>
      <p><strong>Duiding:</strong><br>${escapeHtml(data.analyse?.duiding || "")}</p>
      <p><strong>Risico's:</strong><br>${escapeHtml(data.analyse?.risico || "")}</p>
      <p><strong>Advies:</strong><br>${escapeHtml(data.analyse?.advies || "")}</p>
      <p><strong>Vervolgstap:</strong><br>${escapeHtml(data.analyse?.vervolgstap || "")}</p>

      <h2 style="color:#071f3f;">Themascores</h2>
      <table style="border-collapse:collapse;width:100%;max-width:720px;">${themaRows}</table>

      <h2 style="color:#071f3f;">Antwoorden</h2>
      <table style="border-collapse:collapse;width:100%;font-size:12px;">
        <tr><th align="left">Nr.</th><th align="left">Thema</th><th align="left">Vraag</th><th align="left">Antwoord</th><th align="left">Score</th></tr>
        ${antwoorden}
      </table>
    </div>`;
}

function renderVisitorEmail(data) {
  return `
    <div style="font-family:Arial,sans-serif;color:#12213a;line-height:1.55;">
      <h1 style="color:#071f3f;">Uw resultaat van het Bakermat VastgoedKompas</h1>
      <p>Beste ${escapeHtml(data.naam)},</p>
      <p>Dank voor het invullen van het Bakermat VastgoedKompas.</p>
      <p><strong>Uw score:</strong> ${escapeHtml(data.score)}%</p>
      <p><strong>Gezondheidsniveau:</strong> ${escapeHtml(data.gezondheidsniveau)}</p>
      <p>${escapeHtml(data.analyse?.samenvatting || "")}</p>
      <p>Bakermat Vastgoedmanagement kan de uitkomst vertalen naar concrete verbeterpunten, prioriteiten en een praktische routekaart.</p>
      <p>Met vriendelijke groet,<br>Bakermat Vastgoedmanagement</p>
    </div>`;
}

function safeFile(value) {
  return String(value || "rapport").replace(/[^a-z0-9-_]+/gi, "-").replace(/-+/g, "-");
}
