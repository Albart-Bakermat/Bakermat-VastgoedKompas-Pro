import { listSubmissions, requireAdmin } from "./_utils.js";

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;

  const items = await listSubmissions();
  const results = items.map(i => i.payload).filter(p => p?.type === "result" && typeof p.score !== "undefined");

  const stats = {
    aantalLeads: items.filter(i => i.payload?.type === "lead").length,
    aantalResultaten: results.length,
    gemiddeldeScore: results.length ? Math.round(results.reduce((s,p)=>s+Number(p.score||0),0)/results.length) : 0,
    themaGemiddelden: {}
  };

  for (const p of results) {
    for (const t of p.themas || []) {
      if (!stats.themaGemiddelden[t.thema]) stats.themaGemiddelden[t.thema] = { som: 0, aantal: 0 };
      stats.themaGemiddelden[t.thema].som += Number(t.score || 0);
      stats.themaGemiddelden[t.thema].aantal++;
    }
  }

  stats.themaGemiddelden = Object.fromEntries(Object.entries(stats.themaGemiddelden).map(([k,v]) => [k, Math.round(v.som/v.aantal)]));

  return res.status(200).json(stats);
}
