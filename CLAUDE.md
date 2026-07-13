# CLAUDE.md — Tim LaBarge Career Portfolio

Context for future sessions so this does not need re-explaining.

## Who this is for

Tim LaBarge, a B2B SaaS marketing leader (15+ years) targeting VP of Marketing,
Head of Marketing, and CMO roles at growth-stage SaaS companies (Series A to C).
This is a career portfolio, not a lead-gen or consulting site. It is also open to
select fractional and advisory work.

## Voice and style rules

Follow these on every piece of copy written for this site.

- No em-dashes anywhere. Use a period or a comma and restructure the sentence.
- No colons or semicolons in body copy. Break the thought into separate sentences.
- No "not X but Y" constructions. State the positive claim directly.
- Confident, never arrogant. No adjectives about Tim himself ("the best at X",
  "world-class", "guru"). Let evidence carry the persuasion.
- Lead with evidence: real numbers, named companies, and other people's quotes.
- Write in clear, complete sentences, not fragmented keyword lists. LLM-based
  search rewards well-formed, extractable statements.
- Specific over generic. "$5.5MM+ in ARR from conversion optimization" beats
  "drove significant revenue growth".

## Color palette

| Token | Hex | Use |
| --- | --- | --- |
| Background | `#FAF9F6` | Warm off-white, primary background |
| Body text | `#2B2B2B` | Charcoal |
| Accent 1 (sage) | `#4A6B52` | Primary accent, links, primary buttons |
| Sage tint | `#DCE5DA` | Light section backgrounds, borders |
| Accent 2 (terracotta) | `#A8654F` | Key CTA / highlight, used sparingly |
| Accent 3 (gold) | `#C9A051` | Small details only: underlines, hover, icon fills |
| Accent 4 (lavender) | `#E4E0EA` | Optional background wash, very sparingly |

Design direction: minimalist, generous white space, flat (no gradients, no
skeuomorphic shadows/gloss). Typography and color carry the visual interest, no
stock-photo clutter. Font is Inter (Google Fonts).

CSS tokens live as custom properties in `/css/style.css` under `:root`. Reuse
them, do not hardcode hex values in new pages.

## Tech and conventions

- Plain HTML/CSS/JS. No framework, no build step.
- Clean URLs via folder + `index.html` (e.g. `/about/index.html` serves at
  `/about`). `vercel.json` sets `cleanUrls` and `trailingSlash: false`.
- Deployed on Vercel.
- Mobile-first and responsive. Minimal JS (`/js/main.js` handles only the mobile
  nav toggle).
- Semantic HTML5 (header, nav, main, section, article, footer). One H1 per page.
- Accessibility: skip link, alt text, ARIA where needed, keyboard navigable,
  sufficient contrast.

### Per-page requirements (every new page must have)

- Unique `<title>` and meta description.
- Open Graph and Twitter Card tags.
- Canonical `<link>`.
- Shared header nav, footer, and `/css/style.css` link.
- Set `aria-current="page"` on the active nav link.
- JSON-LD structured data: `Person` on homepage/about, `Article` on case studies.
- Add the new URL to `sitemap.xml`.

The canonical production origin used throughout is `https://timlabarge.com`.
Update it everywhere (meta tags, JSON-LD, sitemap, robots) if the real domain
differs.

## Site architecture

- `/` — Homepage (fully built).
- `/about` — About Me (placeholder scaffold).
- `/the-work` — Case study index (built, links to four case studies).
- `/the-work/constructconnect-conversion-optimization` — placeholder.
- `/the-work/seo-content-marketing-growth` — placeholder.
- `/the-work/ai-productization-gtm` — placeholder.
- `/the-work/cei-brand-refresh` — placeholder.
- `/fractional-cmo` — placeholder scaffold.
- `/contact` — email, LinkedIn, resume download.

Global nav on all pages: About Me, The Work, Fractional CMO, Contact.
Resume download button appears on About, The Work index, Fractional CMO, Contact.
Resume file is a placeholder at `/assets/resume.pdf` until the real one lands.

## Known placeholders to replace later

- `/assets/resume.pdf` — placeholder PDF, swap for the real resume.
- `/assets/og-image.png` — referenced in meta tags but not yet created.
- LinkedIn URL `linkedin.com/in/timlabarge` — confirm the real handle.
- Proof-strip brand logos are text labels. Real logo files to come.
- Case study bodies are stubs. Copy still to be written.
