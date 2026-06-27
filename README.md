# Bakermat VastgoedKompas Pro

Professionele webapp voor het Bakermat VastgoedKompas.

## Wat is toegevoegd

- automatische leadmail bij start
- automatische resultaatmail naar info@bakermatvm.nl
- PDF-rapport als e-mailbijlage
- optionele kopie naar bezoeker
- opslag in Supabase
- dashboard via `/admin`
- CSV-export
- gemiddelde themascores in dashboard
- optionele AI-rapportage via OpenAI API

## Deploy naar Vercel

1. Upload deze map naar GitHub.
2. Koppel de repository aan Vercel.
3. Voeg environment variables toe.

## Verplichte environment variables

```text
RESEND_API_KEY=...
MAIL_FROM=Bakermat VastgoedKompas <noreply@bakermatvm.nl>
LEAD_TO_EMAIL=info@bakermatvm.nl
```

## Resend instellen

1. Maak een account op Resend.
2. Verifieer het domein `bakermatvm.nl`.
3. Maak een API key.
4. Voeg deze toe als `RESEND_API_KEY` in Vercel.

## Bezoeker ook een kopie sturen

```text
SEND_VISITOR_COPY=true
```

## Supabase opslag en dashboard

1. Maak een Supabase project.
2. Open SQL Editor.
3. Voer `supabase.sql` uit.
4. Voeg toe aan Vercel:

```text
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_TOKEN=sterk-wachtwoord
```

Dashboard:

```text
/admin
```

## CSV export

Via het dashboard of direct:

```text
/api/export.csv?token=JOUW_ADMIN_TOKEN
```

## AI-rapportage

Voeg toe:

```text
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-4o-mini
```

Endpoint:

```text
/api/ai-report
```

De hoofdapp gebruikt dit endpoint nog niet automatisch, zodat kosten beheersbaar blijven. Het is voorbereid voor uitbreiding naar automatische 10-15 pagina's adviesrapportage.

## Contact

Bakermat Vastgoedmanagement  
info@bakermatvm.nl  
www.bakermatvm.nl
