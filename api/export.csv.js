import { listSubmissions, requireAdmin } from "./_utils.js";

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;

  const items = await listSubmissions();
  const rows = [["Datum","Type","Naam","Organisatie","E-mail","Score","Gezondheidsniveau","Stoplicht"]];

  for (const item of items) {
    const p = item.payload || {};
    rows.push([
      item.created_at || p.created_at || p.datum || "",
      p.type || "",
      p.naam || "",
      p.organisatie || "",
      p.email || "",
      p.score || "",
      p.gezondheidsniveau || "",
      p.stoplicht || ""
    ]);
  }

  const csv = rows.map(r => r.map(cell => `"${String(cell ?? "").replace(/"/g,'""')}"`).join(",")).join("\n");
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", "attachment; filename=bakermat-vastgoedkompas-export.csv");
  return res.status(200).send(csv);
}
