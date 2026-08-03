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
  item. Panels 01 to 03 are real interactive demos, see below. Panel 04 is
  still a branded PLACEHOLDER (team nodes) tagged "Interactive demo coming
  soon"; a real animation lands later. `.cap-demo`
  and `.cap-stage` are both pinned to `min-height: 460px`, sized to the
  tallest panel (currently 02) so switching tabs never jumps the sticky
  stage. Re-measure and update that number if a panel's content grows.
  Panels 02 to 04 carry the `hidden` attribute in the markup and only the
  tablist ever clears it, so `html:not(.js) .cap-panel[hidden]` forces them
  back to `display: block`. Without that rule the entire right-hand stage is
  unreachable with no JS. Do not remove it.
  - Demand-compounding chart (`.dstack`, inside panel 01, `data-demand-stack`
    on the `.cap-demo`). A stacked area chart of four channels over eight
    quarters. Paid comes online in Q1 and stays near flat, SEO in Q2, content
    in Q3, community in Q5, each stacking on the ones already running, so
    stack order bottom to top is also the order they start. The model gives
    the combined total a synergy multiplier that grows with the number of
    live channels and with elapsed time (`SYN_K` 0.09 per extra channel at
    full ramp), so the top of the stack pulls away from a dashed line showing
    the same channels run in isolation. The hatched wedge between the two is
    the compounding lift, reaching +27% at Q8, and it is the entire point of
    the visual. The y axis is fixed at 200 index units rather than fit to the
    data, so toggling a channel visibly shrinks the chart instead of silently
    rescaling the axis.
    The numbers are an illustrative model, not Tim's results, which is why
    the panel's chip reads "Illustrative model" (using
    `.cap-demo__chip--quiet`, an outline variant of the loud gold chip) and
    the units are an index rather than dollars. Do not relabel them as
    pipeline dollars or attribute them to a client.
    The final-state paths ship as static SVG in `index.html`, so the chart
    renders and is crawlable with no JS. They were generated from the same
    model as `demandStack()` in `/js/main.js`, which redraws them on init, so
    the two agree by construction. If the model constants change, regenerate
    the markup rather than hand-editing path data. Easiest way is to load the
    page and copy the `d` attributes back out of the DOM.
    `demandStack()` adds three things on top of the static chart. A
    left-to-right reveal wipe (a `<rect>` inside `clipPath#dstack-clip`),
    near-linear easing so the sweep reads as time passing and the
    acceleration the viewer sees belongs to the curve. A readout that counts
    through the quarters as the wipe passes them, landing on the Q8 numbers.
    And legend toggles (`.dstack__key`, `aria-pressed`) that recompute the
    model and tween between the old and new curves. The last live channel
    cannot be switched off, since an empty chart reads as a broken panel.
    Hovering or focusing a key isolates that band (`.is-isolating` on
    `.dstack`, `.is-focus` on the area); the click handler re-runs `isolate()`
    afterwards, otherwise turning a channel off leaves the chart dimmed
    around a band that no longer exists.
    Curves are Catmull-Rom converted to cubic beziers with control-point y
    clamped to its own segment. Without that clamp a curve overshoots into
    the band stacked below it and shows a sliver of the wrong color.
    The wedge fill and the isolation line are off-white, not gold. Gold
    disappeared against the gold content band and the terracotta community
    band underneath, which is what the first pass got wrong.
    Under `prefers-reduced-motion` the wipe and the toggle tween are both
    skipped, but the toggles still work and redraw instantly, same reasoning
    as the constellation's pointer handling.
  - One question, four surfaces (`.qsurf`, inside panel 02,
    `data-query-surfaces` on the `.cap-demo`). The claim is that buyers look
    in several places and phrase the question differently in each, so the
    demo is a surface switcher rather than a chart. Keep it that way. Four
    panels in four registers reads as a system, four charts reads as a
    template.
    Four tabs, Google organic / Google paid / ChatGPT / Reddit, each with its
    own query phrased the way that surface is actually used (short keywords
    for search, a full sentence for the chat, a "reddit" suffixed query for
    the thread) and its own result format. Implicit surfaces on all four.
    That set is not arbitrary. They are Implicit's four largest channels and
    each panel's stat is the real share from
    `/the-work/implicit-plg-gtm`, paid 27%, LLMs 23%, organic 22%, Reddit
    13%, 85% of the 2,100 signups between them. Keep those in sync with the
    case study if it is ever restated, and keep the attribution inside the
    sentence ("of Implicit signups"), since the panel is chipped
    "Illustrative model" for the rendered results and the numbers are the one
    part that is not illustrative.
    Nothing on this panel invents a third party. Every result the demo is not
    claiming is a grey `.qsurf__ghost` placeholder rather than a made up
    competitor, there are no usernames, and no words are put in anyone's
    mouth. The Reddit panel describes a thread ("Implicit comes up in the
    replies") instead of quoting a comment. Hold that line if this is ever
    extended.
    Every `.qsurf__panel` shares one grid cell (`grid-area: 1 / 1`), so the
    stage is always as tall as the tallest surface at any width and
    switching can never resize the demo. That replaces guessing a
    min-height, so do not swap it back for one. The panels also carry the
    `hidden` attribute, so `html:not(.js) .qsurf__panel[hidden]` forces them
    back into flow, same fix as `.cap-panel[hidden]` one level up.
    `querySurfaces()` reveals the placeholder rows first and the branded
    result last regardless of DOM order (`data-step` marks a revealing
    element, `data-step="hit"` marks the payoff), then lights the brand
    highlight, then counts the share up. It auto-advances every 5.2s, and
    any click or arrow key sets `manual` and stops the carousel for good,
    since cycling underneath someone who just picked a surface is what makes
    an auto-advancing panel annoying.
    `stop()` snaps the panel back to its resolved state rather than leaving
    the sequence wherever it had reached. Without that, a demo that scrolled
    out mid reveal was stranded blank with the share reading 0%.
    The panel is hidden until its tab is selected, and a hidden element does
    not intersect, so one IntersectionObserver starts and stops it for both
    scrolling away and tab switching. `querySurfaces()` therefore needs no
    coupling to `capabilities()`.
    The demo advances on a loop, so there is deliberately NO `aria-live`
    anywhere in it. A `visually-hidden` paragraph describes the whole thing
    instead, and the tablist covers the part a user actually drives.
    Under `prefers-reduced-motion` the auto-advance never starts and the
    sequence never staggers. One surface shows fully resolved and the tabs
    still switch instantly.
  - Right-lever decision board (`.lever`, inside panel 03, `data-plg-lever`
    on the `.cap-demo`). The claim on this panel is judgment, that knowing
    which motion fits is the skill. The placeholder it replaced was a PLG
    funnel, which argued the opposite by presenting PLG as the answer. Do not
    go back to a funnel here.
    Four mechanism questions score a motion from 0 (pure sales-led) to 100
    (pure product-led). Single-player value 34, buying it 28, the category
    20, expansion 18. Those four came from Tim directly, replacing an earlier
    set built on deal size and buying committee, which are proxies rather
    than causes. Single-player value is the precondition and a procurement
    gate is a hard blocker, which is why those two carry most of the weight.
    All 16 combinations produce distinct scores spread across five verdict
    bands.
    The verdict must be able to rule PLG out. The bottom band reads "PLG here
    burns a year and produces signups that never buy. Run demand gen." A
    board that can only ever recommend PLG proves nothing, so keep that
    refusal if the copy is reworked.
    Three presets snap the board to real engagements and land at 100, 54 and
    0. Implicit is product-led, ConstructConnect is both motions at once
    (in-product surfaces feeding a sales team, PQLs up 6.5x, revenue still
    closing as contracts), CEI Clairvoyance is sales-led. Those
    configurations are derived from the case studies, so re-check them if a
    study is restated. ConstructConnect is what stops the panel reading as a
    false binary, since the middle is where most companies actually sit.
    Only an exact match on all four inputs names an engagement. Move one
    toggle off a preset and `.lever__match` empties, so a half-changed board
    never claims to be a real client.
    The inputs are native radios, so keyboard behaviour and no-JS
    readability come for free. Nothing recomputes the verdict without JS
    though, and native radios would still flip, so `html:not(.js)` disables
    the controls and hides the presets, leaving a static readout of the
    default engagement rather than a board contradicting its own verdict.
    `--at` on `.lever__marker` is a unitless 0 to 100, and the CSS travels it
    between 7px and width minus 7px so the marker stays fully inside the
    track at both extremes. A plain percentage offset half-clipped it at 0
    and 100.
    On reveal the board auto-cycles the three presets every 3s. Any radio
    change or preset click sets `manual`, stops the cycle for good, and only
    then adds `aria-live="polite"` to the verdict. Marking it live from the
    start would make a screen reader announce every step of the automatic
    cycle, same reasoning as the no-`aria-live` decision on panel 02.
    Under `prefers-reduced-motion` the cycle never starts and the marker
    jumps rather than slides, which the global reduced-motion block already
    handles by collapsing transition-duration.
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
- Player/coach illustration pair (`.player-coach`, the "Player coach,
  literally." section on `/about`, class lives on the `<section>` itself
  alongside `data-player-coach`). An ink and watercolor coach and player
  (`/assets/about/`), background keyed to transparent in processing (see
  Illustration assets below) so they read as drawn straight onto the
  section's sage field rather than sitting in a photo card. They cross-fade
  from coach to player as the section scrolls, driven by a single `--pc-mix`
  custom property (0 = coach, 1 = player) that `playerCoach()` in
  `/js/main.js` writes on the section; CSS does the rest, an opacity
  cross-fade plus a small opposed translate/scale drift on the two stacked
  `<img>` elements inside `.pc-frame`.
  The base stylesheet rules are the no-JS AND reduced-motion view:
  `.player-coach__body` (head + 2x2 card grid) sits inside `.container` as
  normal; `.player-coach__media` is a sibling block styled to match
  `.container`'s own max-width/padding so it lines up with the page, holding
  both images side by side in normal flow at full opacity, no positioning
  tricks, no scroll coupling.
  The enhanced treatment lives inside a single `.js` +
  `prefers-reduced-motion: no-preference` + `min-width: 901px` query, so it
  can never strand the player image at opacity 0. There,
  `.player-coach__media` becomes a **full-bleed sibling of `.container`**
  (same pattern as `.stack`), letting `.pc-frame` borrow width beyond the
  container's max-width. `.pc-frame` is `position: absolute`, right-flush
  against the `<section>` itself (`.player-coach__media` stays
  `position: static` and collapses to zero height in this view; `.pc-frame`
  skips straight past it to the section as its containing block). It does
  NOT move on scroll: `playerCoach()`'s `layout()` measures the "Player
  coach, literally." heading and the second row of the card grid ONCE per
  viewport size (resize/fonts-ready/load, never on a scroll tick) and writes
  explicit top/height/width inline so the art spans from the heading down
  through ~70% of that second row. Width is derived from height via the
  source art's 4:5 aspect ratio (no cropping), then clamped to
  `sectionRect.right - bodyRect.right - EDGE_GAP` (so it never overlaps the
  copy column) and to `MAX_WIDTH` (680px, so it doesn't drift away from the
  copy on ultra-wide screens). This means the pair does not always reach the
  full 70%-into-row-2 target at the narrow end of the enhanced range
  (901-1150px or so), since there simply isn't enough spare width there to
  stay uncropped; that's an accepted responsive trade-off, not a bug to
  chase. `updateMix()` (a separate function, runs every scroll tick) then
  reads the now-static frame's own `getBoundingClientRect()` each scroll and
  maps standard "progress through the viewport"
  (`(vh - rect.top) / (vh + rect.height)`) through a hold/smoothstep remap
  to `--pc-mix`. `.pc-frame` has `overflow: hidden`: the cross-fade's
  scale/drift transform can push the invisible (opacity 0) image a couple of
  percent past the frame's own box, and since it's flush against the
  section's true right edge that was enough to add a horizontal scrollbar
  before the `overflow: hidden` was added, worth remembering if the drift
  amounts ever change. Do not add `reveal` to `.player-coach__media`.

### Illustration assets

- `/assets/about/player-coach-coach.webp` and `player-coach-player.webp` are
  the About page illustrations, processed from the uploaded originals (which
  had an opaque off-white/cream paper background, RGB roughly `(240, 234,
  221)`) by: downscaling to a 1200px max dimension, keying the paper out to
  alpha transparency, and encoding RGBA WebP at quality 88 (960x1200, ~225KB
  each; bigger than the older opaque encode because alpha compresses worse,
  still small enough not to matter). The key-out is distance-from-background
  in RGB space with a soft smoothstep ramp (roughly `low=12, high=50`, sampled
  per image from the median of a border strip, not a fixed constant, since
  the two source paper tones differ slightly), not a hard-edge cutout. That
  softness is a feature, not a compromise: it lets faint watercolor washes
  near the paper's own tone fade out gradually exactly like they would on
  real paper, so the art reads as drawn straight onto whatever page
  background sits behind it (see the player/coach section above) rather than
  looking cut out. Re-run the same distance-based key-out (not a plain white
  strip like the logo pipeline below) if these are ever replaced from new
  source art. There is no raw/processed split for these the way there is for
  logos, since they arrived as chat attachments rather than through the
  normal upload intake, only the single processed file in `/assets/about/`.

### Case study assets: the Agolo to Implicit rebrand

Same raw/processed split as the logos. `/assets/agolo-implicit-rebrand-logos/`
and `/assets/agolo-implicit-rebrand-webpages/` hold the untouched uploads
(original filenames and sizes, kept for provenance, not referenced by any
page). Everything the site actually loads lives in
`/assets/case-studies/agolo-implicit/`.

- Rebrand transition video. The source is a 10s 1920x1080 H.264 file, roughly
  19MB, which is far too heavy to ship. Processed with a static ffmpeg from
  the `imageio-ffmpeg` pip package (there is no system ffmpeg in this
  environment and `apt-get` cannot reach a mirror, so install that package
  first if the video is ever re-encoded). Trimmed to 0.7s through 9.3s, which
  drops dead white frames at both ends while keeping the white-to-white seam
  so the loop is invisible. Scaled to 1280x720 and encoded twice, H.264 at
  CRF 30 with `+faststart` and VP9 at CRF 38, landing at roughly 290KB each.
  The poster is a single frame at 6.8s (the Implicit logo, fully resolved)
  encoded as WebP.
- Page captures. The uploaded screenshots are full-page, 5,000 to 13,000px
  tall and up to 11MB. Each is cropped to its hero region at a per-image
  fraction of the capture width (tuned by hand, since the useful region ends
  in a different place on every page), downscaled to 1400px wide, and encoded
  as WebP at quality 80. All seven land under 135KB. Regenerate by re-running
  the same crop-fraction, resize, and encode against a replacement capture.
- Wordmarks. `agolo-wordmark.svg` and `implicit-wordmark.svg` are straight
  copies of the source SVGs, no processing. Both are dark-on-light, which is
  what the page needs. There is a light-on-dark Implicit variant in the raw
  folder if a dark section ever needs it.

Components built for this page, all in `/css/style.css`:

- `.rebrand-film` with `.filmstrip`. The `<video>` is `aria-hidden` and
  decorative. The real before/after evidence is the static wordmark pair
  underneath it, which is why the video is hidden entirely under both
  `prefers-reduced-motion` and `html:not(.js)` while the filmstrip always
  renders. Do not make the filmstrip conditional on either.
- `.qbars`, the quarterly column chart. Columns rather than a line because
  the series spans 1 to 1,133 and a linear line flattens the first five
  quarters into the baseline, losing the step changes that are the point.
  The Q4 2024 (Agolo) column is deliberately a neutral gray and the Q2 2026
  column is the page's single terracotta accent. The 1-lead column is
  floored at 2.5px so it reads as a visible sliver rather than nothing.
  Static SVG in the markup, so it renders and is crawlable with no JS.
- `.shot`, a framed page capture with fake browser chrome. Images are clipped
  to `max-height: 340px` with `object-position: top`, so the headline being
  evidenced is always what stays visible.
- `.posline` / `.posrow`, the alternating version-by-version progression. The
  verbatim site headline from each version is the primary evidence and is
  marked up as `.posrow__headline`.
- `.scope-grid`, committed-to versus ruled-out. Both check and slash marks
  are `clip-path` polygons, no icon font or image.

The growth-chart hover handler in `/js/main.js` is shared between the line
chart and the column chart. It matches `.growth__svg, .qbars__svg` and reads
`data-unit` off the `[data-growth]` root for the tooltip label, defaulting to
"signups" for the original chart. Add `data-unit` to any new chart rather
than hardcoding a noun.

### Case study assets: CEI Clairvoyance (AI productization)

Same raw/processed split again. `/assets/case-studies/CEI-Clairvoyance-case-study/`
holds the untouched uploads (original filenames, kept for provenance, not
referenced by any page), including `old-case-study-webpage.png`, a 10MB
full-page capture of the AI productization case study from Tim's previous
site that the current page is rewritten from. Everything the site loads lives
in `/assets/case-studies/cei-clairvoyance/`.

- Page captures. `Clairvoyance-Foundation-Assistants.webp` and
  `Clairvoyance-Chat-Clair.webp` are 1500px-wide full-page captures. Each is
  cropped to its top 900px (hero plus the first section below it), resized to
  1400 wide, and encoded WebP at quality 80, landing at 1400x840 and under
  80KB. That crop height is uniform across both, unlike the Agolo set where
  each capture needed its own hand-tuned fraction.
- Homepage. The upload is `AI+Homepage+Content-gif.gif`, an 85-frame
  annotated walkthrough at 1200x600. Only frame 0 is shipped, as
  `cei-homepage-ai.webp`. Frame 0 carries the static white arrow pointing at
  the AI Innovation menu, which is useful annotation. Later frames add a
  hand-drawn marker squiggle that reads as slideware next to the clean
  captures, so do not swap in a later frame.
- Practice lockup. `clairvoyance-lockup.png` is the CEI Clairvoyance mark
  from `/assets/brand-logos/CEI Clairvoyance Mark (1).png`, trimmed to its
  alpha bounding box and resized to 760px wide. It already had real
  transparency, so it skipped the near-white strip pass the brand logos need.
- The engagement-path diagram (`Clairvoyance-Offering.webp`, the three-step
  workshop / proof of value / steady state artwork) is deliberately NOT
  shipped. It is CEI's own red-and-navy slide art and would fight the sage
  and terracotta page. It is rebuilt as markup in the `.path` component
  instead. Re-derive from that source file if the steps or durations change.

Components added for this page, both in `/css/style.css`:

- `.path`, the three-step engagement route. A three-column grid of
  `.path__step` cards reusing `.chain`'s connector construction (a 2px rule
  plus a rotated-square arrowhead drawn in the gap). The duration pill
  (`.path__dur`) carries the only solid color fill, since the durations are
  the whole point of the diagram. `.path__step--final` takes the terracotta
  accent. Under 860px it collapses to one column and the connectors rotate
  into the vertical gap, so the arrows keep pointing at the next step.
- `.step > .shot` and `.step > .shot-pair` get `margin-top: var(--space-lg)`.
  `.shot` deliberately zeroes its own margin so a parent grid's gap can own
  the spacing (that is how the Agolo `.posrow` layout uses it), but stacked
  straight inside a `.step` there is no such grid, so the captures collided
  with each other and with the copy above them.
- `.figure--plain` with `.figure__art`. The default `.figure img` treatment
  (white card, border, `width: 100%`) boxes a transparent logo and makes it
  read as a screenshot of a logo. This variant drops the frame, caps the art
  at 420px, and holds the figure to the same 68ch measure as `.step__body`
  so it centers on the copy column instead of drifting into the empty right
  half of the container.

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
  `<li>`, real alt text only on the first copy). The duplicate copy's links
  still carry a real `href` and `target="_blank"` so a logo stays clickable
  once the marquee has scrolled past the first copy, just with
  `tabindex="-1"` so it never becomes a second keyboard tab stop for the
  same brand. Animated via
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
- `/the-work` — Case study index (built, links to five case studies).
- `/the-work/constructconnect-conversion-optimization` — fully built.
- `/the-work/implicit-plg-gtm` — fully built.
- `/the-work/seo-content-marketing-growth` — fully built.
- `/the-work/ai-productization-gtm` — fully built. CEI Clairvoyance, the AI
  practice productization and go-to-market. The second CEI study on the site,
  so it deliberately owns the AI keyword numbers (73 / 18 / 10) while
  `/the-work/seo-content-marketing-growth` owns the sitewide search numbers
  (810 / 205 / 47%), and the two cross-link rather than repeat each other.
- `/the-work/agolo-implicit-repositioning` — fully built. Replaced the
  `/the-work/cei-brand-refresh` placeholder, which was deleted rather than
  kept, since Agolo to Implicit is the stronger brand and positioning story
  and the site only needs one. Nothing links to the CEI URL any more.
- `/fractional-cmo` — fully built. The page's job is qualification, not
  conversion, since the site is a career portfolio first and the fractional
  work is explicitly secondary. That posture drives everything on it. No
  published rate, no packaged tiers, no scheduler embed, no gated lead
  magnets, and a closing section that states plainly that the primary goal is
  a full-time VP or Head of Marketing seat. Keep that section if the page is
  ever rewritten, since without it a recruiter cannot tell what Tim wants.
  Most sections reuse an existing component: an `.icon-card` grid for the fit
  situations, `.scope-grid` for what he takes on versus what is ruled out,
  `.path` for the three-step engagement shape, and `.work-grid` re-headlined
  by the problem each case study started with rather than by its metric.
  There is deliberately NO `.stat-strip` here. The four numbers it used to
  carry appear on the homepage and `/about` already, and the case studies are
  linked from this page, so the block was removed as redundant on Tim's
  instruction. The honesty line it used to carry ("results from full-time
  roles, which is where most of this was earned") moved into the intro of the
  "The proof" section and must survive any rewrite, since the page has no
  fractional-specific evidence. Sections alternate plain / tint down the page;
  removing the stat strip is what set the current order, so re-check the
  rhythm if a section is ever added or dropped.
  Three components were added for this page:
  - `.icon-card__when`, the set-off symptom list at the bottom of each "When
    it makes sense" card, introduced by a small uppercase "Sometimes this
    happens when:" label against a gold left rule. It uses `margin-top: auto`
    so the callouts pin to the bottom of each card and line up across a row
    even when the descriptions above them differ in length. That label is the
    one sanctioned exception to the no-colons-in-body-copy rule, requested
    explicitly by Tim, so do not "fix" it.
  - `.icon-card--invite`, the sage-tinted sixth card that closes the same
    grid ("Have a marketing problem that isn't on this list?"). It exists to
    make the grid three even rows AND to catch problems the five specific
    cards miss, so do not drop it to get back to five.
  - `.faq`, native `<details>`/`<summary>` disclosures laid out as a 2x2 grid
    of cards (one column under 720px). Native elements were chosen so it
    stays keyboard operable and fully readable with no JS. The open/close
    slide rides on `::details-content` with `interpolate-size:
    allow-keywords`; engines without support drop those rules and get an
    instant toggle, which is a fine fallback, so do not replace this with a
    JS accordion. `align-items: start` on the grid is load-bearing. Without
    it, opening one card stretches its row partner to match, which looks
    like a rendering bug.
  - `.scope__icon`, the circled check and circled diagonal slash beside the
    two `.scope__title` headings, echoing the per-item markers below them.
  The `.path` section animates via `[data-path-progress]` on the `<ol>`,
  handled by `pathProgress()` in `/js/main.js`. It adds `is-lit` to each step
  in turn (260ms apart) once the list is in view, fading the card up and
  drawing that step's incoming connector. The attribute is what opts in, so
  the CEI case study's static path is untouched. The hidden state is gated
  behind `html.js`, and the stacked layout under 860px flips the connector
  draw from `scaleX` to `scaleY` since the rule runs vertically there.
  On top of that one-time entrance, an ambient gold sweep runs forever
  (`path-glow-card` / `path-glow-line` / `path-glow-arrow`), travelling card,
  connector, card, connector, card. All five elements share one 5.4s cycle
  and are offset by `--glow-i * 0.45s`, where `--glow-i` is set per step by
  `:nth-child`, so the wave stays in phase no matter when each step was lit.
  Do not gate the sweep on `.is-lit`; starting each element's animation at a
  different moment is what would knock the phase out. The card keyframe uses
  a 2px ring plus a blurred halo rather than a halo alone, since a pure halo
  is close to invisible with a cream card on a cream field. The global
  reduced-motion block collapses all animation to a single 0.001ms pass,
  which removes the sweep with no page-specific rule needed.
  Carries both `Person` (with `makesOffer`) and `FAQPage` JSON-LD; the
  `FAQPage` question names must be kept in sync by hand with the four
  `.faq__q` summaries, since nothing generates one from the other, and Google
  expects the marked-up text to match what is visible.
- `/contact` — email, LinkedIn, resume download.

Global nav on all pages: About Me, The Work, Fractional CMO, Contact.
Resume download button appears on About, The Work index, Fractional CMO, Contact.
Resume file at `/assets/resume.pdf` is the real resume (Tim_LaBarge_Resume_2026.pdf, added 2026-07-31).

## Known placeholders to replace later

- Proof-strip brand logos are text labels. Real logo files to come.
- The About page's "Why marketing" section had a dashed-border "Photo coming
  soon" placeholder next to the hit-list, removed on 2026-07-31 since the site
  is now live and an empty placeholder read worse than no photo. `.about-grid`
  is single-column now. When a real photo exists, re-add an image column
  (the removed `.about-photo` treatment is gone from `/css/style.css`, not
  just hidden, so this needs a fresh layout rather than an unhide).
- The CEI Clairvoyance case study has no closed-won revenue, deal count, or
  workshop/proof-of-value engagement counts, since none was available. It
  leads on the $1MM+ pipeline number instead. The recruiting lift is written
  qualitatively for the same reason, on Tim's explicit instruction, so do not
  invent a figure for it. The seven AI pages are named in the copy but only
  `https://cei.ai/` is linked, since the deep URLs could not be verified (the
  live site refuses automated requests).
- The Agolo to Implicit case study has no deal size, sales cycle, or win rate
  data, since none was available. It leads on qualified leads per quarter
  instead. If those numbers surface later they belong in the results section.
- The Fractional CMO page's "Ruled out" column is only partly dictated. Tim
  specified what he takes on (demand gen, PLG, content strategy, GTM
  strategy, competitive analysis, branding, messaging and positioning, CRO),
  and later added one exclusion in his own words, that he will not be the
  person running someone's social media or paid ad campaigns day to day. The
  other three items were inferred from things he did say (he prefers cash
  over equity, he is one person rather than an agency, and the Agolo rebrand
  was positioning-led) and are still worth confirming or replacing.
- The Fractional CMO page carries no fractional-specific client evidence. Tim
  has done consulting and freelance marketing work many times, though not
  under the "Fractional CMO" label, and no named client, metric, or
  testimonial from that work was available. The page therefore leans entirely
  on full-time-role results and says so in the evidence section rather than
  implying a fractional track record. It reuses the Jake Nelson-Dooley quote
  from the homepage. A testimonial from someone who actually bought advisory
  work would be the single highest-value addition to the page.
