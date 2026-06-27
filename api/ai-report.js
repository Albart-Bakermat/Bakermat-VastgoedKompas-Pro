export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(200).json({
      report: "AI-rapportage is nog niet geactiveerd. Voeg OPENAI_API_KEY toe aan Vercel om automatisch een uitgebreid adviesrapport te genereren."
    });
  }

  const data = req.body || {};
  const prompt = `
Schrijf een diepgaand Nederlands adviesrapport voor Bakermat Vastgoedmanagement op basis van deze VastgoedKompas-resultaten.
Gebruik een zakelijke, deskundige stijl. Structuur:
1. Managementsamenvatting
2. Interpretatie gezondheidsniveau
3. Risicoanalyse
4. Analyse per thema
5. Prioriteiten voor de komende 3 maanden
6. Routekaart voor 12 maanden
7. Aanbevolen rol van Bakermat Vastgoedmanagement

Data:
${JSON.stringify(data, null, 2)}
`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4
    })
  });

  if (!response.ok) {
    return res.status(500).json({ error: await response.text() });
  }

  const json = await response.json();
  return res.status(200).json({ report: json.choices?.[0]?.message?.content || "" });
}
