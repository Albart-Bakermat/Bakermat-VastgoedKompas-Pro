import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

function wrapText(text, maxChars = 92) {
  const words = String(text || "").split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    if ((line + " " + word).trim().length > maxChars) {
      if (line) lines.push(line);
      line = word;
    } else {
      line = (line + " " + word).trim();
    }
  }
  if (line) lines.push(line);
  return lines;
}

export async function createResultPdf(data) {
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const navy = rgb(7/255,31/255,63/255);
  const green = rgb(47/255,125/255,50/255);
  const light = rgb(245/255,248/255,246/255);
  const dark = rgb(18/255,33/255,58/255);

  let page = pdf.addPage([595.28, 841.89]);
  let y = 790;
  const margin = 52;
  const width = page.getWidth();

  function header() {
    page.drawText("BAKERMAT", { x: margin, y: 800, size: 18, font: bold, color: navy });
    page.drawText("VASTGOEDMANAGEMENT", { x: margin, y: 785, size: 8, font: bold, color: navy });
    page.drawLine({ start: { x: margin, y: 770 }, end: { x: width - margin, y: 770 }, thickness: 1.2, color: green });
    y = 740;
  }

  function footer() {
    page.drawRectangle({ x: 0, y: 0, width: page.getWidth(), height: 34, color: navy });
    page.drawText("Bakermat Vastgoedmanagement | www.bakermatvm.nl | info@bakermatvm.nl | 0643013327", {
      x: margin, y: 13, size: 8, font: regular, color: rgb(1,1,1)
    });
  }

  function newPage() {
    footer();
    page = pdf.addPage([595.28, 841.89]);
    header();
  }

  function text(value, opts = {}) {
    const size = opts.size || 10;
    const font = opts.bold ? bold : regular;
    const color = opts.color || dark;
    const maxChars = opts.maxChars || 92;
    const lineHeight = opts.lineHeight || 14;
    for (const line of wrapText(value, maxChars)) {
      if (y < 70) newPage();
      page.drawText(line, { x: opts.x || margin, y, size, font, color });
      y -= lineHeight;
    }
  }

  function heading(value) {
    if (y < 95) newPage();
    page.drawText(value, { x: margin, y, size: 15, font: bold, color: navy });
    y -= 22;
  }

  header();

  page.drawText("Rapport Het Bakermat VastgoedKompas", { x: margin, y, size: 22, font: bold, color: navy });
  y -= 25;
  page.drawText("Gezondheidsanalyse vastgoedorganisatie", { x: margin, y, size: 12, font: bold, color: green });
  y -= 24;

  page.drawRectangle({ x: margin, y: y - 58, width: width - (margin*2), height: 58, color: navy });
  page.drawText(`${data.score}%`, { x: margin + 16, y: y - 36, size: 25, font: bold, color: rgb(1,1,1) });
  page.drawText(String(data.gezondheidsniveau || ""), { x: margin + 110, y: y - 24, size: 12, font: bold, color: rgb(1,1,1) });
  page.drawText(`Stoplichtniveau: ${data.stoplicht || ""}`, { x: margin + 110, y: y - 42, size: 9, font: regular, color: rgb(1,1,1) });
  y -= 82;

  text(`Naam: ${data.naam || ""}`, { bold: true });
  text(`Organisatie: ${data.organisatie || ""}`, { bold: true });
  text(`E-mail: ${data.email || ""}`, { bold: true });
  y -= 10;

  heading("Managementsamenvatting");
  text(data.analyse?.samenvatting || "");
  y -= 8;

  heading("Duiding van het gezondheidsniveau");
  text(data.analyse?.duiding || "");
  y -= 8;

  heading("Belangrijkste risico's");
  text(data.analyse?.risico || "");
  y -= 8;

  heading("Strategische aanbeveling");
  text(data.analyse?.advies || "");

  newPage();
  heading("Scores per thema");

  for (const t of data.themas || []) {
    if (y < 80) newPage();
    page.drawText(String(t.thema || ""), { x: margin, y, size: 10, font: bold, color: navy });
    const barY = y - 14;
    page.drawRectangle({ x: margin, y: barY, width: 340, height: 7, color: light });
    page.drawRectangle({ x: margin, y: barY, width: 340 * ((Number(t.score) || 0) / 100), height: 7, color: green });
    page.drawText(`${t.score}%`, { x: margin + 355, y: barY - 1, size: 10, font: bold, color: navy });
    y -= 28;
  }

  y -= 8;
  heading("Aanbevolen vervolgstap");
  text(data.analyse?.vervolgstap || "");

  if ((data.antwoorden || []).length) {
    newPage();
    heading("Antwoordenoverzicht");
    for (const a of data.antwoorden || []) {
      if (y < 95) newPage();
      text(`${a.nummer}. ${a.thema}`, { bold: true, maxChars: 86, lineHeight: 12 });
      text(`${a.vraag}`, { maxChars: 95, lineHeight: 11, size: 8 });
      text(`Antwoord: ${a.antwoord || ""}`, { maxChars: 95, lineHeight: 11, size: 8 });
      y -= 6;
    }
  }

  footer();
  const bytes = await pdf.save();
  return Buffer.from(bytes);
}
