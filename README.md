# Bakermat VastgoedKompas Pro

Complete GitHub/Vercel implementatie voor het Bakermat VastgoedKompas.

## Inbegrepen

- Landingspagina en scan in Bakermat-huisstijl
- 9 hoofdthema's
- 135 vragen
- Scoreberekening
- Stoplichtniveau
- Themascores en visualisaties
- Automatische leadmail bij start
- Automatische resultaatmail naar Bakermat
- PDF-rapport als bijlage via Resend
- Optionele kopie naar bezoeker
- Optionele Supabase opslag
- Dashboard via `/admin`
- CSV-export
- Voorbereiding voor AI-rapportage

## Bestanden

```text
index.html
api/_utils.js
api/_pdf.js
api/lead.js
api/result.js
api/submissions.js
api/stats.js
api/export.csv.js
api/ai-report.js
admin/index.html
package.json
vercel.json
supabase.sql
.env.example
README.md
```

## Vercel environment variables

Zet minimaal deze variabelen in Vercel:

```text
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx
MAIL_FROM=Bakermat VastgoedKompas <noreply@mailer.bakermatvm.nl>
LEAD_TO_EMAIL=info@bakermatvm.nl
```

Optioneel:

```text
SEND_VISITOR_COPY=true
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxxxx
ADMIN_TOKEN=kies-een-sterk-wachtwoord
OPENAI_API_KEY=sk-xxxxx
OPENAI_MODEL=gpt-4o-mini
```

## Deploy

1. Pak deze ZIP uit.
2. Upload alle bestanden naar GitHub in de root van de repository.
3. Koppel de repository opnieuw aan Vercel, of push naar je bestaande repository.
4. Voeg de environment variables toe in Vercel.
5. Klik in Vercel op Redeploy.

## Belangrijk

Na het toevoegen of wijzigen van environment variables in Vercel moet je opnieuw deployen.

## Dashboard

Na Supabase-configuratie:

```text
/admin
```

CSV-export:

```text
/api/export.csv?token=JOUW_ADMIN_TOKEN
```

## Supabase

Voer de inhoud van `supabase.sql` uit in Supabase SQL Editor.

## Resend

Zorg dat `mailer.bakermatvm.nl` verified is in Resend.
