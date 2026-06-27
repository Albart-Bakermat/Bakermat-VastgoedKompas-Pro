import { listSubmissions, requireAdmin } from "./_utils.js";

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;

  try {
    const items = await listSubmissions();
    return res.status(200).json({ items });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Inzendingen konden niet worden opgehaald." });
  }
}
