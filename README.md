# CPDESIGN — Portfolio di Carmelo Provenzani

Portfolio personale bilingue (IT/EN) con area di amministrazione per gestire i progetti.

**Stack:** React 19 · TypeScript · Vite · Tailwind CSS 4 · React Router 7 · i18next · Supabase (database, auth, storage) · EmailJS · Vercel

## Avvio

```bash
npm install
npm run dev
```

Crea `.env.local` con:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_EMAILJS_SERVICE_ID=...
VITE_EMAILJS_TEMPLATE_ID=...
VITE_EMAILJS_PUBLIC_KEY=...
```

Le stesse variabili vanno impostate su Vercel.

## Script

| Comando           | Cosa fa                              |
| ----------------- | ------------------------------------ |
| `npm run dev`     | server di sviluppo                   |
| `npm run build`   | type-check e build di produzione     |
| `npm run lint`    | ESLint                               |
| `npm run preview` | anteprima della build                |

## Struttura

```
src/
  config/      i18n, client Supabase, link e asset personali (site.ts)
  locales/     testi IT ed EN
  lib/         accesso ai dati dei progetti, linee/colori delle competenze
  hooks/       useProjects, useProject, titolo pagina e lingua
  components/
    layout/    header, footer, layout pubblico e admin
    sections/  diagramma delle linee, competenze, contatti
    ui/        bottoni, icone, pannello progetto, campi form
  pages/       home, archivio, dettaglio, chi sono, 404, login
    admin/     dashboard e form progetto (nuovo/modifica)
public/cv/     CV in PDF (IT e EN)
```

## Contenuti

- **Progetti:** si gestiscono da `/admin` (login con l'account Supabase). La prima immagine è la copertina; le immagini caricate vengono ridimensionate e convertite in WebP automaticamente. Il pulsante "Ottimizza immagini" converte quelle caricate in passato.
- **CV:** sostituisci i PDF in `public/cv/`.
- **Testi del sito:** `src/locales/it.ts` e `src/locales/en.ts`.
- **Link personali (email, LinkedIn, GitHub):** `src/config/site.ts`.

## Sicurezza

La chiave anon di Supabase è pubblica per definizione: la protezione dell'area admin dipende dalle policy RLS. Verifica che sulla tabella `projects` e sul bucket `portfolio-assets` lettura sia pubblica e scrittura/eliminazione siano permesse solo agli utenti autenticati.

## Design

Le decisioni visive sono documentate in `DESIGN.md` e `PRODUCT.md`.
