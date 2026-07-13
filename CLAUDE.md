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

CSS tokens live as custom properties in `/css/style.css` under `:root`. Reuse
them, do not hardcode hex values in new pages.

## Visual direction: clean but bold

The v1 build was clean but read as boring. The current direction keeps the
uncluttered foundation and the palette but commits to real visual boldness and
modern motion. Minimalist does not mean timid. Generous white space is
punctuated by confident full-bleed color-field sections.

- Typography. Space Grotesk (display, headings, buttons, nav, eyebrows, metric
  values) paired with Inter (body). Both from Google Fonts. Use dramatic scale
  contrast, huge tightly tracked headlines against calm body text. Headings use
  `--font-display`, body uses `--font-body`.
- Color as field, not accent. Sage and terracotta appear as large full-bleed
  section backgrounds (`.section--sage`, `.section--terracotta`), not just small
  touches. Rhythm is white space, then a bold color block, then white again.
  Headings on solid color fields are set to the off-white for contrast.
- Warm texture. A faint SVG grain overlays the whole page (`body::before`).
  Layered mountain-inspired flat SVG shapes sit behind the hero.
- Motion patterns (all in `/js/main.js`, all gated by `prefers-reduced-motion`):
  - Kinetic hero. Headline words fade and rise in with a stagger on load. The
    final word rotates through variants (execute, ship, lead, grow). The real
    word (execute) ships in the DOM so no-JS and crawlers read the true copy.
    Only `html:not(.js) .rotator__word:first-child` forces a word visible with
    no JS. With JS the rotator owns visibility (is-active / is-leaving), so do
    not add a plain `:first-child` visible rule or the anchor word stacks under
    the rotating one.
  - Layered rolling hills sit behind the hero (`.hero__backdrop` SVG), several
    soft bezier bands in palette tones. No clouds.
  - Reveal on scroll. Any element with class `reveal` fades up when scrolled
    into view. Hiding is gated behind an `html.js` class (set by an inline head
    script) so content is never hidden when JS is off. Stagger via
    `--reveal-delay` inline.
  - Metric counters. `.metric__value[data-count]` counts up when in view. Store
    `data-count`, `data-decimals`, `data-prefix`, `data-suffix`. The final value
    is the initial text so no-JS still shows it.
  - Scroll-progress bar, injected at the top of `<body>` by JS.
- Interactive capabilities section (`.capabilities`, the "Four things I bring"
  block). Left column is a clickable vertical tablist (`.cap-item`, ARIA
  tab/tabpanel, arrow-key navigable). The active item highlights and its
  description expands. The right `.cap-stage` swaps a dynamic demo panel per
  item. The demo panels are branded PLACEHOLDERS for now (channel bars, a
  search/answer mock, a funnel, team nodes) each tagged "Interactive demo
  coming soon"; real animations land later.
- Signature interactive elements (two, both on the homepage):
  - Animated growth curve (`.growth`). An SVG line draws itself (stroke-dashoffset)
    next to the metric counters, reinforcing compounding results.
  - Tool-stack constellation (`.stack`). JS builds the nodes from a cluster spec
    (7 labeled clusters: AI, App builders, CRM & MOPs, SEO & paid, Design,
    Product analytics, Dev & deploy) positioned around cluster centers on a dark
    sage field, drifting slowly with connective lines on a `<canvas>` and hover
    highlight. A grouped `.stack__fallback` list is the accessible/no-JS view and
    also replaces the constellation on narrow screens. Reinforces command of the
    modern stack.
- Keep it flat (no skeuomorphic gloss), fast (CSS animations and lightweight
  vanilla JS, no libraries), and accessible (contrast on color fields, keyboard
  navigable, reduced-motion honored). Motion frames the proof, it never delays
  the numbers, case study links, or testimonial.

## Tech and conventions

- Plain HTML/CSS/JS. No framework, no build step.
- Clean URLs via folder + `index.html` (e.g. `/about/index.html` serves at
  `/about`). `vercel.json` sets `cleanUrls` and `trailingSlash: false`.
- Deployed on Vercel.
- Mobile-first and responsive. Vanilla JS only, no libraries (`/js/main.js`
  handles nav toggle, scroll progress, reveal-on-scroll, metric counters, the
  rotating hero word, the growth-curve draw, and the tool-stack constellation).
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

The social share image `/assets/og-image.png` (1200x630) is generated from
`/assets/og-image.source.html` by rendering it in a 1200x630 headless Chromium
viewport and screenshotting. Edit the source HTML and re-render to update it.

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
- LinkedIn URL `linkedin.com/in/timlabarge` — confirm the real handle.
- Proof-strip brand logos are text labels. Real logo files to come.
- Case study bodies are stubs. Copy still to be written.
