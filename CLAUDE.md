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
  - Tool-stack knowledge graph (`.stack`). Full-bleed, frameless: the canvas
    and node layer (`.stack__canvas-wrap`) are `position: absolute; inset: 0`
    directly on the `.stack` section (a sibling of `.container`, not nested
    inside it), so the graph spans the entire section behind the heading/copy,
    not a bordered card. `.stack` is capped at `min-height: 720px` with
    `padding-block: var(--space-lg)` (not the default `--space-xl`) so the
    whole graph fits in one viewport without scrolling on common laptop
    heights (verified at 1366x768 and up); do not let this section grow much
    taller than that budget.
    JS builds the nodes from a cluster spec of 8 explicit, non-overlapping
    rectangular cells (`{label, x0, x1, y0, y1, cols, tools}` in percent of
    the panel) that tile the space below the headline in two rows of four,
    sized roughly to each cluster's tool count so the grid reads as
    deliberate rather than scattered. Cluster cells start at `y0: 34`
    (row 1) / `y0: 66` (row 2), reserving the top ~30% for the headline/copy.
    Each cluster's own tools are laid out in a small sub-grid inside its own
    cell (`cols` columns, wrapping to more rows as needed, last row
    centered), and the cluster label sits directly above that sub-grid using
    the SAME cell geometry, so label-to-cluster proximity is guaranteed by
    construction, not by hand-tuned offsets. `resolveQuietZone()` in
    `constellation()` is a runtime safety net that nudges any node whose
    fixed position still lands on the measured `.section__head` bounding
    box, but the primary fix is the cell layout itself, not the nudge. Do
    not go back to circular/radial per-cluster placement (angle + radius
    fan-out); it looked organic but produced uneven gaps and nodes drifting
    into neighboring clusters or the headline as the cell sizes changed.
    Group labels (`.stack__group-label`) are terracotta (`#d68e77`, a
    lightened terracotta for contrast against the dark green field), not the
    original sage-tint, since sage-tint on sage was getting lost.
    Nodes with a mapped logo render as a circular `.stack__node-chip` (60px,
    `border-radius: 50%`, image `object-fit: contain` inside an inset square
    so wide wordmark logos are not clipped by the circle, `mix-blend-mode:
    multiply` to erase any opaque light background) with a small caption
    below; tools with no logo file fall back to the original text pill
    (`.stack__node--text`), so partial logo sets degrade gracefully. The
    `.no-blend` chip modifier exists for a self-contained dark-tile logo
    (skips the multiply blend rather than muddying a dark logo against a
    white card) but nothing currently uses it, since Bolt's current logo is
    a plain wordmark; keep the escape hatch in CSS for the next dark-tile
    upload.
    A dense ambient mesh (`mesh.points`/`mesh.edges` in `constellation()`,
    rebuilt on every `resize()`) is drawn first, behind the meaningful cluster
    graph: 70-170 points scattered across the full panel (scaled to area,
    avoiding the measured text zone), each connected to its 2 nearest
    neighbors, very low opacity, with a handful of small ambient pulses
    traveling the mesh edges. This is pure background texture echoing a dense
    knowledge-graph look; the warmer gold cluster/node lines stay the visually
    dominant, meaningful layer on top of it.
    Interaction: the panel tracks the pointer (`pointermove`/`pointerleave`
    scoped to the panel, not `window`) and lerps a mouse position; each node's
    `hoverInfluence` eases toward a proximity value derived from that position,
    which (a) nudges the node a few px toward the cursor, (b) brightens/thickens
    its connector line, and (c) draws a soft canvas glow behind it. Direct
    `:hover`/`:focus-visible` on a node also scales it up via CSS
    (`transform: scale(1.14)`), independent of the proximity field, so the
    "logos grow a little" effect is guaranteed even without the ambient canvas
    layer. Ambient pulses travel along each node-to-cluster-center line
    (`pulses` array) for continuous life. Under `prefers-reduced-motion`,
    drift/pull/pulses (both cluster and mesh) are disabled but the pointer
    still triggers an instant (non-eased) redraw on move, since that is
    discrete user-driven feedback, not automatic motion.
    A grouped `.stack__fallback` list is the accessible/no-JS view and also
    replaces the whole graph on narrow screens (`max-width: 720px`), where
    `.stack__canvas-wrap` reverts to `position: relative` (normal flow) so the
    list contributes real height instead of sitting inside an absolutely
    positioned, zero-height wrapper.

### Logo assets

- `/assets/brand-logos/` and `/assets/tools-logos/` hold the raw files Tim
  uploads (original filenames, sizes, and formats, left untouched for
  provenance). `/assets/brand-logos/<kebab-case-name>.{svg,png}` and
  `/assets/tools-logos/<kebab-case-name>.{png,svg}` are the **site-ready,
  processed** versions actually referenced by the site: tightly cropped to
  their content bounding box, downscaled to a max dimension of 440px, and
  normalized to PNG (except true source SVGs, copied as-is). Sources with a
  fully opaque (non-transparent) background additionally get a near-white
  pixel strip pass (`strip_near_white()`, tolerance ~14) so the file itself
  has real alpha transparency, not just an opaque white/near-white fill.
  This matters: the CSS monochrome treatment applies `brightness(0.8)`
  before the multiply blend, which darkens an opaque white background to
  visible gray (this caused the ConstructConnect/Rockport/On Center "gray
  box" bug); real transparency sidesteps it entirely since filters never
  touch alpha-0 pixels. Regenerate a processed file by re-running the same
  trim-to-bbox + white-strip (if opaque) + downscale + PNG-export steps
  against a replacement source; there is no build step wired up for this,
  it was done manually with Pillow during asset intake.
- Brand strip (`.proof`) is a full-bleed, seamlessly looping marquee, not a
  static wrapped row: `.proof__track` (`overflow: hidden`, edge fade via
  `mask-image`) contains one `.proof__logos` flex row holding the full logo
  set TWICE back to back (the second copy is `aria-hidden="true"` on each
  `<li>`, real alt text only on the first copy), animated via
  `@keyframes proof-scroll` from `translateX(0)` to `translateX(-50%)` on a
  `linear infinite` loop, so it repeats seamlessly with no snap. Pausable on
  `:hover`/`:focus-within`. Under `prefers-reduced-motion` the animation is
  removed, the duplicate copy is hidden (`display: none`), and the single
  real copy wraps in a centered flex-wrap grid instead, same as before the
  marquee existed. Each `.proof__logo img` renders in one unified tone via
  `filter: grayscale(1) contrast(0.95) brightness(0.8)` plus
  `mix-blend-mode: multiply`, full color revealed on hover/focus. Do not
  hand-recolor source files, the CSS treatment normalizes tone uniformly
  regardless of source aspect ratio or background (see the white-strip note
  above for why the source file's transparency still matters).
- Tool nodes: see the interaction notes above. The `LOGOS` map inside
  `constellation()` in `/js/main.js` is the single source of truth for which
  tool maps to which processed file; a tool absent from that map automatically
  renders as a text pill, so adding a new logo is just adding one map entry
  plus dropping the processed PNG/SVG in `/assets/tools-logos/`.
- Known gaps as of this writing: several uploaded extras (Conductor, Cursor,
  Zapier, BrightEdge, LinkedIn Ads, Make, PhantomBuster) are not wired into
  any current section, kept in the raw folders for possible future use (e.g.
  case study pages). The brand strip currently includes every uploaded brand
  logo (Puma, Hugo Boss, ConstructConnect, CEI, Rockport, On Center,
  PlanSwift, SmartBid, Implicit, Inkwell, Cole Haan), each linking out to the
  brand's own site (`target="_blank" rel="noopener noreferrer"`, real `<a>`
  only on the first (non-duplicate) copy of each logo so the marquee's
  seamless-loop duplicate isn't a second identical tab stop). Solstice
  Sunglasses was removed from the strip entirely per explicit request
  (source file still in the raw folder
  for provenance, just not referenced). If a future upload shouldn't be a
  public "brands I've helped grow" logo, pull it from the marquee markup in
  `index.html` rather than assuming it's excluded by default.
- Pardot was removed from the CRM & MOPs cluster and the accessible fallback
  list entirely (not kept as a text-pill placeholder) per explicit request.
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
