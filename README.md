# career-portfolio

Personal career portfolio for Tim LaBarge, a B2B SaaS marketing leader.

Static HTML/CSS/JS. No framework, no build step. Deployed on Vercel with clean
URLs (folder + `index.html`, `cleanUrls` in `vercel.json`).

## Structure

- `/` — Homepage (fully built).
- `/about` — About Me (scaffold).
- `/the-work` — Case study index, links to four case studies (scaffolds).
- `/fractional-cmo` — Fractional and advisory (scaffold).
- `/contact` — Email, LinkedIn, resume download.
- `css/style.css` — Shared design system, inherited by every page.
- `js/main.js` — Mobile nav toggle (only JS on the site).
- `robots.txt`, `sitemap.xml` — Crawler directives, welcoming LLM crawlers.

## Local preview

Serve the folder over HTTP so absolute paths and clean URLs resolve, for example:

```
python3 -m http.server 8000
```

Then open http://localhost:8000.

See `CLAUDE.md` for voice/style rules, the color palette, and conventions.
