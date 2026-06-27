# Bakermat VastgoedKompas Professional

Volledige GitHub/Vercel implementatie van het Bakermat VastgoedKompas.

## Wat zit erin

- Professionele scanpagina in Bakermat-huisstijl
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
- Health check via `/api/health`
- Voorbereiding voor AI-rapportage

## Upload naar GitHub

1. Pak de ZIP uit.
2. Verwijder bij voorkeur de oude bestanden uit je bestaande repository.
3. Upload alle bestanden en mappen uit deze ZIP naar de root van de repository.
4. Commit de wijzigingen.

Belangrijk: de map `api` en de map `admin` moeten in de root staan.

## Vercel

Na upload naar GitHub zal Vercel automatisch opnieuw deployen. Zo niet, klik in Vercel op `Redeploy`.

## Vercel environment variables

Minimaal nodig:

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

## Controle

Open na deploy:

```text
/api/health
```

Als alles goed staat, zie je:

```json
{
  "ok": true,
  "emailConfigured": true
}
```

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

1. Maak een Supabase-project.
2. Open SQL Editor.
3. Voer de inhoud van `supabase.sql` uit.
4. Voeg `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` en `ADMIN_TOKEN` toe in Vercel.
5. Redeploy.

## Resend

Zorg dat `mailer.bakermatvm.nl` verified is in Resend.

## Testflow

1. Open de Vercel-url.
2. Vul naam, organisatie en e-mailadres in.
3. Start het Kompas.
4. Controleer of Bakermat een leadmail ontvangt.
5. Vul de scan in.
6. Bereken de score.
7. Controleer of Bakermat een resultaatmail met PDF ontvangt.
8. Controleer eventueel of de bezoeker een kopie ontvangt.
