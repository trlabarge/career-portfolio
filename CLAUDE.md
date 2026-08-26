# CLAUDE.md — Tim LaBarge Career Portfolio

Context for future sessions so this does not need re-explaining.

## Who this is for

Tim LaBarge, a B2B SaaS marketing leader (15+ years) targeting VP of Marketing,
Head of Marketing, and CMO roles at growth-stage SaaS companies (Series A to C).
This is a career portfolio, not a lead-gen or consulting site. It is also open to
select fractional and advisory work.

## The positioning, and why AI runs through it

The site's central claim is that Tim has spent the last four years bringing AI
products to market, two at CEI and two at Implicit. That claim is load-bearing
and it changed the site in 2026-08 after an advisor pointed out that the
evidence for it was already here, just filed under labels that hid it.

Two things follow, and both are easy to undo by accident.

- **Commercialization is the claim, not tooling.** Tool fluency (Claude Code in
  the hero, the AI cluster in the constellation, the LLM-search capability
  panel) is the abundant claim that every marketer makes. Having shipped AI
  go-to-market three times is the scarce one. Copy should lead with the second
  and let the first support it. Do not let a rewrite invert that order.
- **Three of the five case studies are AI go-to-market, across two company
  types.** Implicit twice (a PLG launch from zero and the Agolo repositioning),
  both at a pre-revenue AI-native startup, plus CEI Clairvoyance at a mid-size
  tech and AI services firm. Naming both types is what shows range. Dropping
  the services firm makes him read as an early-stage specialist, which is the
  exact undersell the change was made to fix.

There is deliberately **no AI nav item**. A nav item would read as a service
line, which undercuts the full-time-role intent, and it would date badly. A
perspective/POV page on AI in GTM is the one addition that would earn a nav
slot later, and the agreed sequence is to build it as a single page first with
no nav item, then promote it only if it gets read. Name it Perspective or
Notes, never AI.

The **no AI section** half of that rule was narrowly overridden in 2026-08,
after Tim's mentor said the claim was true but too quiet to land. The homepage
now carries a `section--sage section--narrow` statement band, "Every company is
being asked to turn what it sells into an AI product." It is a positioning
argument that hands off to the case studies, not a service line, so it lists no
deliverables and carries no offer language or CTA. **It sits after the
capabilities section and before the work grid, and that placement is
load-bearing**, since putting it any earlier makes the first two screens read
as an AI specialist ad. It also deliberately carries no cards, because cards
here duplicate the work grid directly below it.

The band is built in four beats, not one paragraph. It shipped as a headline
over a single long block and read as a wall that people skipped. Now: the
opening line as a `.lede`, then `.pullline` ("The technology is rarely the hard
part.") at display scale, then `.hardparts`, three gold-numbered items for
positioning, packaging and demand, then `.hardparts__close` with the claim.
Same words throughout, four levels of hierarchy instead of one. `.hardparts`
uses gold numerals straight on the field rather than `.chain`, which paints
cream cards with light borders for the off-white page and would put three pale
boxes on sage.

The homepage hero follows the same principle. `.hero__subhead`,
`.hero__claim` and `.hero__meta` are three deliberate weights: breadth, then
the AI claim against a gold rule, then the tool list small and muted. Running
them together as one paragraph is what made the block get skimmed, and it also
inverted the ordering rule below. The bottom margin lives on `.hero__meta`,
since `.hero__subhead` is no longer the last element before the button row.

### Two counts, and they are not the same number

The single easiest thing to garble on this site, because the copy says "twice"
while the work grid shows three AI case studies. Both are correct.

- **Two AI products taken to market.** Implicit, and CEI Clairvoyance. "Twice"
  always means this, and it counts products and companies.
- **Three projects.** Implicit was two distinct pieces of work on the *same*
  product, the Agolo to Implicit rebrand and repositioning, and a later shift
  in go-to-market from B2B sales-led to product-led growth.
- Never write "three AI products," and never treat the two Implicit projects as
  two products. `timbot/persona.md` and `facts.md` §12 both carry this rule
  because a visitor who counts the cards will ask.

### The anti-narrowing guardrail

An earlier pass at the 2026-08 messaging work put the AI claim in the H1 and
made it the whole identity. Tim rejected it: the AI work is the sharpest proof
inside a broader marketing leadership claim, never a replacement for it. What
holds that line, and what a future rewrite must not quietly undo:

- The homepage H1 stays a general marketing leadership claim. The AI content
  lives in the subhead, panel 05, and the band.
- ConstructConnect stays the bento hero card. It is the biggest number on the
  site and carries zero AI language, which makes it the breadth proof.
- Four of the five capability panels have nothing to do with AI. Keep that
  ratio.
- No AI language in the testimonial or the closing CTA.
- Banned phrasings anywhere: "leader in the age of AI", "AI-first marketer",
  "AI-native leader", "harnessing the power of AI", "the AI revolution". Note
  "AI-powered" appears on two case study pages as CEI's own real service and
  keyword names, and in the homepage `.hero__claim` ("AI-native and AI-powered
  programs") where Tim dictated it directly in 2026-08. Those are the sanctioned
  uses.

`timbot/persona.md` carries a "What to lead with" section encoding the same
rules for the chatbot, including the line Tim does not cross (he is a marketer
who commercialized AI, not an ML engineer). Keep the two in sync.

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
  `.eyebrow` and `.lede` both hardcode a dark colour for the off-white page, so
  they inherit nothing on a color field and used to render dark-on-dark. There
  is now a global rule lightening both under `.section--sage` and
  `.section--terracotta`. `.stack` sets the same two values scoped to itself
  and still wins, so that section is unchanged. Do not "fix" a new color-field
  section with another one-off override, the global rule already covers it.
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
    The observer runs at `threshold: 0` with `rootMargin: '0px 0px -10% 0px'`.
    The threshold must stay 0. It was 0.15, which is a fraction of the
    element's own area, so anything taller than roughly the viewport divided
    by 0.15 could never intersect enough to fire. On a 640px phone that hid a
    4,927px `.step` on the ConstructConnect study permanently, an entire
    section of the case study that no amount of scrolling would bring back.
    The negative bottom margin is what holds the reveal until the element is
    properly in view, and unlike a ratio it behaves the same at every element
    height. If reveals ever need to fire later, move that percentage, never
    the threshold.
  - Metric counters. `.metric__value[data-count]` counts up when in view. Store
    `data-count`, `data-decimals`, `data-prefix`, `data-suffix`. The final value
    is the initial text so no-JS still shows it.
  - Scroll-progress bar, injected at the top of `<body>` by JS.
- Interactive capabilities section (`.capabilities`, the "Five things I bring"
  block). Left column is a clickable vertical tablist (`.cap-item`, ARIA
  tab/tabpanel, arrow-key navigable). The active item highlights and its
  description expands. The right `.cap-stage` swaps a dynamic demo panel per
  item. All five panels are real interactive demos, see below. `capabilities()`
  in `/js/main.js` is fully generic over `.cap-item` / `.cap-panel`, so adding
  a panel needs no JS change there. Above 861px,
  where `.cap-stage` is
  sticky, `.cap-demo` and `.cap-stage` are pinned to the height of the
  tallest panel so switching tabs cannot shift the page. Two steps, 535px
  from 1024px up and 590px between 861px and 1023px, since panels 02 and 03
  wrap taller in the narrow half of that range. Below 861px the stage is
  static and panels size to their own content, where uneven heights cost
  nothing. Re-measure both numbers if a panel's content grows. Panel 01 now
  carries noticeable slack under its readout as a result, which is the
  accepted cost of panel 03's longer verdict copy.
  Below 861px the two columns stack, so the list sits above the stage. The
  list keeps the same collapsed behaviour as desktop there, one open
  description at a time. An earlier pass expanded all four on mobile, which
  made the list about 1000px tall and left the single visible panel a full
  screen below the item that controls it. Three of the four demos were
  effectively unreachable, since nothing about a plain expanded list reads
  as tappable. Do not reintroduce that. The rows also grow a chevron
  (`.cap-item::after`, down when closed, up when open) purely as a mobile
  affordance, since on desktop the stage sitting alongside is the hint and
  on mobile there is nothing. `.cap-demo` chrome tightens on mobile too, as
  the chip and tag otherwise wrapped to two lines each and pushed the demo
  itself down.
  Each panel deliberately moves in a different interaction register. Legend
  toggles on 01, surface tabs on 02, a radio board on 03, a continuous
  slider on 04, a two-state commit flip on 05. Five of the same control would
  read as a template, so keep a new panel out of a register already in use.
  Panel 05 was measured against the pinned heights when it was added and fits
  inside the existing 535px and 590px steps, so neither number moved. On a
  360px viewport the five-row list measures ~538px, well clear of the ~1000px
  failure described below. Re-check both if its content grows.
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
    13%, 85% of the 2,500 signups between them. Keep those in sync with the
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
    The panel deliberately carries no `.cap-demo__tag`. "Right lever" was
    removed on Tim's instruction as saying nothing the board does not
    already say.
    The preset chips sit under the label "When I've used these models:",
    which is what turns them from a UI affordance into evidence, since each
    is a real engagement. That colon is a sanctioned exception to the
    no-colons rule, same as `.icon-card__when`, and was requested directly.
    Four mechanism questions score a motion from 0 (pure sales-led) to 100
    (pure product-led). Single-player value 34, buying it 28, the category
    20, expansion 18. Those four came from Tim directly, replacing an earlier
    set built on deal size and buying committee, which are proxies rather
    than causes. Single-player value is the precondition and a procurement
    gate is a hard blocker, which is why those two carry most of the weight.
    All 16 combinations produce distinct scores spread across five verdict
    bands.
    Each verdict names the motion and explains when it applies, in that
    order ("This is a hybrid approach. Self-serve is a real front door
    and..."). An earlier pass was too clipped and assumed the reader already
    had the vocabulary, so keep the descriptive register if these are
    rewritten. All five are parallel in shape and length on purpose, which
    also keeps the block from resizing between bands.
    The verdict must be able to rule PLG out. The bottom band ends "Forcing
    PLG here burns a year and produces signups that never buy." A board that
    can only ever recommend PLG proves nothing, so keep that refusal if the
    copy is reworked.
    `.lever__verdict` reserves `min-height: 168px`, measured as the tallest
    verdict across all 16 combinations in the width range where the stage is
    sticky. Without it, switching bands changes the panel height and jolts
    the sticky stage on every toggle.
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
  - Player-coach allocation (`.pcoach`, inside panel 04,
    `data-player-coach-mix` on the `.cap-demo`). "A leader people want to
    work for" is a claim only other people can make, so this panel renders
    the operating model behind it rather than asserting it. It is not proof
    and is not meant to read as proof. See the known gap below.
    One native range input for team size, 1 to 12. Its `step` is 0.01 rather
    than 1, so the thumb and the bar travel smoothly instead of snapping
    between twelve slots. The readout rounds to whole people and
    `aria-valuetext` announces them, and a `keydown` handler moves arrow keys
    to the next whole integer, since a hundredth-of-a-person step would
    otherwise make the control unusable from the keyboard.
    The meter is labelled Player at one end and Coach at the other, so the
    bar reads as a spectrum between the two roles. The panel carries no
    `.cap-demo__tag`; "Player coach" was removed from the top right on Tim's
    instruction and became those two end labels instead.
    The hands-on share is
    `FLOOR + (100 - FLOOR) / size^1.2` with `FLOOR` 22, so it falls steeply
    as the first hires land and then flattens onto a floor it never leaves.
    Four work items hand off at sizes 2, 4, 6 and 8 (`data-at`), and three
    carry `data-anchor` instead and stay hands on at every size. The whole
    argument is that neither the fill nor the anchors reach zero. A leader
    who claims to stay close to the work and then shows a chart bottoming
    out has disproved themselves, so do not let this bottom out.
    The work items and the model are Tim's own framing from the About page's
    "Player coach, literally." section, drafted here and open to his edits.
    They are illustrative, which is why the chip reads "Illustrative model"
    like the other three panels.
    On reveal the slider sweeps once from 1 to 12 and stops. It does not
    loop, unlike panels 02 and 03, since a control that keeps moving on its
    own is one the user has to fight to grab. Any input sets `manual` and
    the sweep never runs again.
    The control is a native range styled almost entirely by `accent-color`,
    so keyboard behaviour comes for free and the panel stays readable with
    no JS. Nothing recomputes the split without JS though, and a native
    range would still drag, so `html:not(.js)` disables it, same fix as the
    radios on panel 03.
    Under `prefers-reduced-motion` the sweep never runs and the panel opens
    at the full team size, already resolved. Dragging still works.
  - AI go-to-market before/after (`.ashift`, inside panel 05, `data-ai-shift`
    on the `.cap-demo`). Two rows, Implicit and CEI, each showing what the
    company was selling and what a buyer could actually purchase, side by
    side, with a hard metric under each state. The claim on this panel is that
    the technology was never the hard part.
    **This is the one panel whose numbers are real, so it carries the loud gold
    `.cap-demo__chip` reading "Real engagements" rather than the quiet outline
    "Illustrative model" the other four use.** That contrast is deliberate. Do
    not normalize it.
    **Both states are on screen at once, and that is the point.** An earlier
    version was a one-button commit flip that swapped one state for the other,
    which meant the comparison the panel exists to make was never actually
    visible. Do not go back to a sequential reveal here.
    The register is a two-option segmented switch (`.ashift__toggle` /
    `.ashift__tog`, `aria-pressed`) that drives which side is emphasised.
    `.ashift` takes `is-before` or `is-after` and the CSS does the dimming.
    It is styled as a switch rather than as tabs so it does not read as a
    second copy of panel 02.
    The neutral state ships in the markup with no state class, so with no JS
    both columns render at full strength and the panel reads as a finished
    comparison. `aiShift()` in `/js/main.js` adds `is-before` on init.
    The inactive side drops to 0.38 opacity and its value goes sage-tint
    rather than gold. It deliberately stays legible. It is still half the
    argument, and a column faded to nothing makes the panel look broken.
    An IntersectionObserver advances to `is-after` on the way out so someone
    who scrolls past still sees the payoff, and any click sets `manual` and
    stops that, same reasoning as panels 02 and 03. Under
    `prefers-reduced-motion` the panel opens on `is-after`, since the
    transition that would have sold the change is suppressed, and both
    buttons still work.
    **That observer needs its `seen` guard.** The panel ships hidden behind
    its tab, so the observer's very first callback reports `isIntersecting`
    false. Without `seen` that advances the panel before anyone has opened the
    tab. This shipped broken once.
    **There is deliberately no `data-count` anywhere in this panel.** The
    global `counters()` observes every `[data-count]`, fires at 0.6
    intersection and unobserves. Since the panel is hidden until its tab
    opens, that would run on tab open rather than on interaction.
    Metrics render as a small uppercase `.ashift__mlabel` above a large
    `.ashift__mval`, matching `.dstack__stat-label` and `.metric__label`
    elsewhere. Tim dictated them with colons ("leads per quarter: 1"), and
    label-over-value gives the same reading without breaking the no-colons
    rule.
    Two columns are kept below 861px rather than stacked. Type steps down
    instead. Stacking turns the comparison back into the sequential reveal
    this design replaced.
    **Implicit's after figure reads `1,000+`, not 1,133.** Tim chose the
    rounded form for this panel after the discrepancy was flagged. 1,133 stays
    the canonical figure everywhere else, including the `/the-work` card
    headline and the Agolo case study chart. They are the same result, not two
    metrics, and `timbot/facts.md` §10 carries the same note.
    **CEI's before state reads `$0` pipeline.** That is a claim of absence
    supported by "nothing a client can buy", since there was no purchasable
    practice to have pipeline for. It does not breach the
    never-resolve-millions rule, which governs the after state, and
    `$Millions` still names no figure.

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
- Case study cards carry two chip families and the distinction is the whole
  point. `.work-card__tag` (sage tint, sage-dark text) says what the work was.
  `.work-card__tag--type` (terracotta tint, terracotta-dark text) says what
  kind of company it was for, and it exists so the AI throughline is scannable
  without reading a single card. The three values are `AI-Native Startup`,
  `Tech/AI Services Firm`, and `B2B SaaS`, Title Case to match the existing
  discipline tags. They appear on both the homepage bento and `/the-work`, and
  the two lists must stay in sync.
  **A card can carry more than one.** Both Implicit studies are an AI-native
  startup selling B2B SaaS and carry both chips, on Tim's instruction. That is
  what puts Implicit in front of a visitor filtering `/the-work` for SaaS
  rather than hiding it behind the startup label. ConstructConnect is B2B SaaS
  alone and both CEI studies are Tech/AI Services Firm alone. In the bento the
  pair sits in a `.work-card__types` wrapper, which takes over the single
  chip's `margin-top: auto`, since chips in a row-direction flex box would
  otherwise bottom-align against each other whenever the pair wrapped.
  The tint is deliberate. Solid terracotta is reserved for CTAs and the bento
  hero card, and ten solid pills across two pages would spend that signal, so
  `--color-terracotta-tint` (`#F0DED6`) was added for this. `#8F5241` on it is
  5.1:1, which passes AA at the chip's 0.72rem size. Because the pill carries
  its own fill it stays legible on the sage Agolo card with no variant. The one
  variant that IS needed is on `.work-card--hero`, whose field is solid
  terracotta, where the fill swaps to off-white so the chip does not read as
  tonal against its own hue.
  In the bento the chip takes `align-self: flex-start` (a bare span in a flex
  column would stretch to the card width) and `margin-top: auto`, which is what
  lines the chips up across a row when the copy above them differs in length.
  Same trick as `.icon-card__when`.
- The homepage bento (`.work-grid--bento`) holds five cards, not four. The
  ConstructConnect hero spans two rows in column one, Implicit and CEI
  Clairvoyance stack beside it, and row three is SEO next to the sage Agolo
  card. That placement is pure grid auto-flow given the hero's `grid-row: span
  2`, so it needs no explicit row/column rules and it survives reordering only
  if the hero stays first in the DOM. Adding CEI Clairvoyance is what broke the
  old four-card arrangement, since the sage card used to be full width. It
  dropped `--wide` to half width to close the hole. The `.work-card--wide`
  rules are now unused and were kept for a possible sixth study rather than
  deleted.
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

### The filter band on /the-work

Two facets above the case study grid, company type and type of work, so a
recruiter screening for one kind of company or one discipline can cut to it.
The default state is both facets on All, which renders exactly the scrollable
list the page was before, and that is deliberate. Filtering is an accelerator
here, never a gate.

**It is a toolbar, not a panel, and that is the second thing it shipped as.**
The first pass was a bordered cream card with stacked labels and a count badge
on every chip, 288px tall on a laptop, which pushed the first case study below
the fold. Tim rejected it. What replaced it has no fill and no border box, the
facet label sits inline with its own chip row, and the counts moved into the
accessible name. It measures 112px on a laptop and 89px on a phone. If this is
ever touched, height is the constraint that matters. Keep it quiet.

Things that are load-bearing.

- **The controls are generated, not written.** `.work-filters` ships as an
  empty `<div data-work-filters>` and `workFilters()` in `/js/main.js` builds
  every chip by reading the tags already printed on the cards, splitting them
  by the `--type` modifier. The tags on the cards stay the single source of
  truth, so adding a case study or retagging one needs no filter maintenance
  and the band can never offer a filter that matches nothing. Do not hand-write
  the control list into the HTML.
- **`:empty` is the no-JS state.** Nothing can filter without JS, so the empty
  container hides itself and the full list renders untouched. That is also why
  the band ships empty rather than hidden.
- **One selection per facet, ANDed across the two.** Clicking the selected chip
  clears that facet. Multi-select within a facet was not built, since with five
  studies two company types selected together is nearly the same set as All.
- **Every chip knows the count it would leave**, computed against the *other*
  facet's current selection, and a chip that would leave zero is `disabled`.
  That is what makes an empty grid unreachable by clicking. The number is
  spoken in the chip's `aria-label` and never printed, since a badge on every
  chip is most of what made the first version too wide. The empty state still
  exists in `render()` for a hand-edited URL, and it should stay.
- **Selected chips take the colour of the chip family they filter**, terracotta
  for company type and sage for type of work, so a control and the tag it
  matches read as the same thing. Do not normalize the two to one colour.
- **The work-type vocabulary on `/the-work` is exactly five values**, on Tim's
  instruction: `AI Go-To-Market`, `Demand Generation`, `Brand & Positioning`,
  `SEO & Content`, `Product-Led Growth`. Four earlier tags were folded in
  rather than kept, since a facet with nine values and five one-project entries
  is a wall, not a filter. Conversion Optimization folded into Demand
  Generation, Naming & Identity and Messaging into Brand & Positioning, and
  Productization into AI Go-To-Market. Those four still appear on
  `/fractional-cmo` cards and inside the case studies, which is fine, the facet
  is built from `/the-work` alone. Adding a sixth value means adding it to a
  card, so weigh it against the height budget above.
  The ConstructConnect card now reads Demand Generation alone, which is the one
  place the fold costs something, since conversion optimization is that study's
  signature. Its headline and copy still say so.
- **The AI value leads each facet, then the rest by project count**, so the AI
  throughline is the first thing in both rows and the one-project tags fall to
  the end. `leadsWithAi()` matches on the label starting with "AI", not on a
  hardcoded slug, so it survives a retag like the rest of the module. That is
  what puts AI-Native Startup ahead of B2B SaaS even though B2B SaaS carries
  more projects.
- **The state is in the query string** (`?company=…&work=…`, slugs), written
  with `replaceState` and read on load, so a filtered view is linkable. Use
  `replaceState`, not `pushState`, or the back button unwinds chip clicks
  instead of leaving the page. An unrecognised slug is ignored rather than
  applied.
- **Below 721px the groups collapse into a native `<details>`.** Stacked, the
  chip rows still cost most of a phone screen between the headline and the
  first case study. That is the same failure the capabilities list had on
  mobile. `workFilters()` forces the details open above 721px and the summary
  is `display: none` there, so the band reads as a plain toolbar on desktop.
  The status line stays *outside* the disclosure on purpose, so a collapsed
  band still says how many projects are showing and still offers "Show
  everything", and the summary names the active selections so a closed band
  never hides what it is doing.
- `.work-filters` uses `grid-template-columns: minmax(0, 1fr)`, not a bare
  auto column. An auto grid column sizes from its items' min-content width and
  the summary's selection line is `nowrap`, so a long pair of labels widened
  the whole band past a 320px viewport instead of ellipsing. `body`'s
  `overflow-x: hidden` then hid the result rather than announcing it, which is
  exactly the trap the mobile rules below describe.
- Filtered-in cards re-deal with a 45ms stagger (`work-card-in`,
  `--filter-i`), and `render()` also forces `is-visible` onto every shown card,
  since a card hidden behind a filter cannot intersect and would never earn its
  reveal on its own.

### Case study cards on /the-work carry a field colour

Five white boxes in a grid read as a list of links rather than five distinct
pieces of work, so each card on `/the-work` takes a tinted field
(`.work-card--field-sage` / `--field-cream` / `--field-terracotta`) and the
grid carries `.work-grid--studies`, which is also what scopes the larger card
headline (`clamp(1.55rem, 2.2vw, 1.9rem)`).

- **The tint is keyed to company type**, not picked per card. Sage tint is the
  AI-native startup, cream is the tech and AI services firm, terracotta tint is
  the B2B-SaaS-only study. So filtering by company type resolves the grid to a
  single colour, which is the point. Do not reassign these to make a prettier
  spread.
- **The three fields are the site's own triad and lavender is not in it.** The
  AI-native card shipped lavender first and read as off-palette against the
  warm off-white page. Whatever replaces a field has to keep three tints that
  separate at a glance, which is also why a gold tint was not the answer, it
  sits close enough to cream that two of the five cards stop looking different.
- **Each tint collides with the chip family that shares its hue**, and in both
  places the chip fill swaps to off-white. Terracotta-tint company chips on the
  terracotta field, sage-tint discipline chips on the sage field. Same fix and
  same reasoning as `.work-card--hero`. It does mean one tag renders two ways
  across the grid, which is the accepted cost of the fields.
- `h3` on the sage field steps to `--color-sage-dark`. Plain sage on sage tint
  is 3.4:1, which passes for large text but only just, and these headlines
  carry the card.
- Chips on a tinted field take a 1px inset ring, since two pale fills an eighth
  of a step apart stop reading as separate objects.
- `/fractional-cmo` reuses `.work-grid` with its own problem-led headlines and
  its own tags, and is deliberately left plain. It is a different framing of
  the same five studies, not a second copy of this grid.

## Tech and conventions

- Plain HTML/CSS/JS. No framework, no build step.
- Clean URLs via folder + `index.html` (e.g. `/about/index.html` serves at
  `/about`). `vercel.json` sets `cleanUrls` and `trailingSlash: false`.
- Deployed on Vercel.
- Mobile-first and responsive. Vanilla JS only, no libraries (`/js/main.js`
  handles nav toggle, scroll progress, reveal-on-scroll, metric counters, the
  rotating hero word, the growth-curve draw, the tool-stack constellation, and
  the case study filters).
- Semantic HTML5 (header, nav, main, section, article, footer). One H1 per page.
- Accessibility: skip link, alt text, ARIA where needed, keyboard navigable,
  sufficient contrast.

### Mobile rules worth not relearning

The site is checked at 320x640, 360x640, 360x800, 390x844, 430x932 and
768x1024. A few things are load-bearing.

- No page may scroll horizontally. `body` carries `overflow-x: hidden`, which
  means a real overflow hides rather than announces itself, so measure
  `document.documentElement.scrollWidth` against `innerWidth` instead of
  trusting the look of it. Headings carry `overflow-wrap: break-word` as a
  last-resort net, and `.case-hero h1` takes a lower clamp floor
  (`2.25rem` against the global `2.75rem`) because case-study titles lead with
  a company name and "ConstructConnect" is one unbreakable 16-character word
  that needed 374px on a 360px screen. The homepage hero keeps the taller
  floor, it has no long word and should stay loud.
- Standalone controls get at least 44px of height: the brand, the menu button,
  the mobile nav links, footer nav links, and the `.chart__data` summary.
  `.dstack__key` sits at 38px, the most a pill that size can take without
  breaking the row. Links inside running sentences are deliberately left
  alone, since padding them out would wreck the line spacing of the copy and
  inline links are exempt from the target-size rule anyway. There is also a
  `@media (pointer: coarse)` bump on `.primary-nav__link`, which is what
  covers a tablet between 721px and 860px still using the horizontal desktop
  nav. It is scoped to coarse pointers so the mouse-driven header keeps its
  tighter spacing.
- The mobile nav closes on Escape (returning focus to the button) and on a tap
  outside itself, not only on a link click. The links are `display: block` so
  the row, not the word, is the target. As an inline box they gave ragged
  half-width underlines.
- `.stack__canvas-wrap` ships before `.container` so the absolute canvas layer
  sits behind the copy. Below 720px it returns to normal flow, where that
  source order put the tool list above the heading it belongs to, so `.stack`
  becomes a flex column and the wrap takes `order: 2`. Fix it there, not by
  moving the markup, which would break the desktop stacking.
- `.growth__plot` and `.qbars__plot` scroll sideways under 720px, and the left
  edge of both series is the flat opening, so the part worth seeing starts
  off-screen. A `mask-image` fades the right edge as the affordance. The text
  hint stays, a hint you have to read is not enough on its own. The
  `min-width` on the two SVGs cannot come down. Axis labels are SVG text and
  scale with the viewBox, so fitting the chart to a phone renders them at
  roughly 4px.

### Per-page requirements (every new page must have)

- Unique `<title>` and meta description.
- Open Graph and Twitter Card tags.
- Canonical `<link>`.
- Shared header nav, footer, and `/css/style.css` link.
- Set `aria-current="page"` on the active nav link.
- JSON-LD structured data: `Person` on homepage/about, `Article` on case studies.
- Add the new URL to `sitemap.xml`.

The social share image `/assets/og-image.png` (1200x630) is generated from
`/assets/og-image.source.html` by `node scripts/render-og-image.mjs`, which
renders it in a headless Chromium viewport and screenshots it. Edit the source
and re-render with `npm run og:build`. The script refuses to write a file if
Space Grotesk did not load, since a card that silently falls back to a system
sans stops looking like the site.

It does **not** need network access. The script reads both faces out of
`node_modules/@fontsource/*` and inlines them as data URIs before
screenshotting, so the render is offline and deterministic. Run `npm install`
first. If Playwright cannot find Chromium, pass
`CHROME_PATH=/opt/pw-browsers/chromium`.

The card carries the TL mark, in a sage rounded-square badge, set directly in
markup and CSS (a `.face` div with a `.mark` span, no image file) so the
render script never depends on an asset existing on disk. It matches the
favicon and the Timbot avatar.

### The canonical origin is load-bearing

It is baked into 69 places: every canonical link, `og:url`, `og:image`,
`twitter:image`, the JSON-LD blocks, `sitemap.xml`, and `robots.txt`. It is currently
`https://timsmarketing.com`, the apex with no www. Change it with `node
scripts/set-canonical-origin.mjs https://the-real-domain.com` rather than by
hand, then re-run `npm run timbot:build` since page text feeds the chatbot
corpus.

The apex has to stay the primary domain in Vercel, with www redirecting to it.
If that flips, every canonical and every `og:image` points at a URL that 301s,
which Google tolerates and some scrapers do not.

Getting this wrong is not cosmetic. Two failures show up immediately:

- A canonical pointing at a domain you do not serve tells Google the real
  version of every page lives elsewhere.
- An `og:image` the scraper cannot fetch makes LinkedIn and iMessage fall back
  to hunting the page for the largest image available, which on this site means
  a logo from the brand marquee. That shipped once and put the Hugo Boss
  wordmark on a LinkedIn share.

## Site architecture

- `/` — Homepage (fully built).
- `/about` — About Me (placeholder scaffold).
- `/the-work` — Case study index (built, links to five case studies). Carries
  the two-facet filter band, see below.
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

## Timbot, the chat widget

An avatar chatbot that speaks as Tim, present on every page. It exists because
a recruiter comparing candidates remembers the one they had a conversation
with. It is a differentiator, and it is also the single easiest thing on this
site to turn into a liability, which is why the guardrails below are not
optional.

### Architecture

Static site, one serverless function. No framework, no client-side build step,
consistent with everything else here.

- `/api/chat.js` streams a reply over SSE. The `ANTHROPIC_API_KEY` lives in
  Vercel env vars and never reaches the browser. Model is `claude-opus-5` at
  `effort: "low"`, which keeps a chat widget responsive.
  Thinking is left at its default (on) rather than disabled, because this model
  leaks `<thinking>` tags into visible output when thinking is explicitly off.
  Thinking counts toward `max_tokens`, hence 3000 for what should be a
  four-sentence answer.
- `/api/_lib/knowledge.js` is the entire system prompt as one generated string.
  It ships inside the function bundle, and Vercel compiles `/api` rather than
  serving it, so the persona and the do-not-say rules are not publicly
  fetchable. `/timbot/` and `/scripts/` are additionally excluded via
  `.vercelignore`, since everything else in the repo root is served as a static
  asset. That is also why `CLAUDE.md` is readable at `/CLAUDE.md` today.
- `/api/_lib/validate.js` rebuilds the message list from scratch on every
  request rather than forwarding what the browser sent. This is the piece that
  drops an injected `role: "system"` turn, strips extra fields like
  `cache_control`, and ignores content that arrives as a block array instead of
  a string.
- `/js/timbot.js` is the widget. Vanilla, no dependencies. The conversation
  lives in `sessionStorage` so it survives navigation, which matters when the
  launcher follows you across the site.

### The wave

The launcher waves once per session, 20s in, to catch someone who has been
reading and never noticed it. `armWave()` sets a timer, `cancelWave()` kills it
and is called from both `open()` and the launcher's click handler, so it can
never fire over an active conversation.

- **Once per session, tracked under `timbot:waved`,** which is three-state
  rather than a boolean. Unset arms the 20s timer. `shown` means the bounce
  already ran this session, so a later page in the same session shows the hand
  immediately and statically, no timer and no motion. `done` means the visitor
  clicked and nothing shows again. That is what makes the hand persist across
  navigation until it is acknowledged, while the *motion* still only ever
  happens once. Two classes carry it, `is-waving` (hand plus bounce and
  wiggle, three iterations) and `is-waved` (hand only).
- Skipped if the panel is already open, if `/ask` set `data-timbot-open`, if
  there is already a stored conversation, or if `timbot:open` is `1`. Note
  `timbot:open` is set back to `0` on close, so it is a "currently open" flag
  and not a "has ever been opened" one. The stored-conversation check is what
  actually covers the second case.
- Skipped entirely under `prefers-reduced-motion`. `timbot.js` is its own IIFE
  and does not share `main.js`'s `reduceMotion`, so it runs its own
  `matchMedia` check. It also deliberately does not write `timbot:waved` in
  that branch, so nothing is consumed by a session that never saw it.
- The bounce animates the standalone `translate` property, not `transform`,
  because `.timbot__launcher:hover` already owns `transform: translateY(-2px)`.
  The two compose independently, so hovering mid-wave does not cancel the
  bounce. Do not "simplify" that back into `transform`.
- The 👋 is `aria-hidden` and `pointer-events: none`. The launcher's
  accessible name already says what the button does, and the wave must never
  steal focus.
- **No ring and no plate.** It sits at 2.1rem with only a drop shadow. An
  earlier version put a 1rem emoji inside a 30px gold circle, which read as a
  notification dot rather than as a hand. It is a hand, so it should look like
  one at a glance.
- The motion runs three iterations and then stops while the hand stays. A
  badge that keeps moving until it is clicked competes with reading.

### There is no retrieval step, and there should not be one

The whole corpus is roughly 30,000 tokens against a 1,000,000 token window, so
everything goes in the system prompt every time, cached. Retrieval is where
these bots lose accuracy, by fetching the wrong chunk and answering
confidently from it. Do not add a vector database here. If the corpus ever
triples it still fits.

The system prompt is one static block with `cache_control`, so repeat turns
read it at roughly a tenth of input price. Keep it byte-stable. Anything
per-request, a timestamp or a visitor ID, must go in the messages array and
never in the system block, or every turn pays full price.

### The knowledge is generated from the site, not hand-written

`npm run timbot:build` reads every page's HTML, strips it to text, appends
`timbot/facts.md`, `persona.md`, and `personality.md`, and writes
`api/_lib/knowledge.js`. The site is the source of truth, so the bot cannot
drift from what a visitor is reading on the same screen.

**Re-run it and commit the result after editing site copy or any `timbot/*.md`
file.** There is no build step on this project and `timbot/` is excluded from
the Vercel upload, so the deploy cannot regenerate it. Forgetting this is the
most likely way the bot goes stale.

### The three source files do different jobs

Keep them separate. Collapsing them produces a file nobody can edit safely.

- `timbot/facts.md` is what the bot may claim. Career history, the numbers
  ledger tying every figure to the page that backs it, the known gaps it must
  never fill, and the say-it-this-way rules.
- `timbot/persona.md` is how it speaks. The concede-then-reframe pattern, the
  confidence calibration, anchor quotes, and the never-say list.
- `timbot/personality.md` is the texture. Quick answers, running bits,
  recommendations, the origin story.

`timbot/persona-transcript.md` and `Timbot-Personality.md` are the raw
recordings those three are derived from. They are not in the prompt.

### Guardrails that are load-bearing

- **Never invent a number.** Every figure must appear verbatim in the corpus.
  The specific trap is a visitor asking for a total across projects, which
  invites the model to sum unrelated figures into a credential Tim never
  claimed. `facts.md` says decline instead.
- **`[FILL]` and `[CONFIRM]` markers mean unknown.** The prompt tells the model
  to treat them as missing information, never to read the bracket text aloud,
  and never to guess at what belongs there.
- **The say-it-this-way section is not about banned topics.** The
  ConstructConnect VP story and the BDR termination are both fine and both
  written out as permitted answers. What is restricted is a handful of
  sentences that identify a real person.
- **Treat every visitor message as untrusted.** Roleplay, fiction, and
  developer-mode framings are the dangerous ones, because they are polite and
  sound legitimate while asking for a fabricated credential on Tim's own site.

### Testing

`npm run timbot:test` covers request validation and the handler's guard paths
with no API key and no network. It is the fast check. The real check is
`timbot/eval-questions.md`, 59 questions run against the live bot and graded by
hand. Sections B, G, and H are launch blockers there.

### Known gaps

- The avatar is `/assets/timbot/timbot-avatar.webp` (512x512 RGBA, restored
  2026-08-26), a cropped ink-and-watercolor illustration, used on both the
  launcher (`.timbot__avatar`) and the panel header (`.timbot__head-avatar`)
  in `js/timbot.js`. It briefly shipped as the sage/off-white "TL" mark
  (matching the favicon) before Tim asked for the illustration back.
  `assets/timbot/timbot-avatar-source.webp` is the raw upload, kept for
  provenance and excluded from the Vercel deploy by `.vercelignore`.
  Regenerate the processed file with `scripts/process-timbot-avatar.py` (see
  `assets/timbot/README.md`) if the source art is ever replaced. **The TL
  mark stays on the social share card** (`/assets/og-image.png`, built from
  `/assets/og-image.source.html`) and the favicon; this swap only touches the
  chat widget, not the share image.
- Rate limiting in `/api/chat.js` is an in-memory map, which means per
  serverless instance. It is a speed bump, not a wall. Move it to Vercel KV or
  Upstash before the URL sees real traffic.
- Nothing logs the conversations. The questions recruiters actually ask are
  genuinely useful intelligence and worth capturing, anonymised.

## Testimonials

Six quotes, one per person, each on exactly one page. Spreading them out was
the point. Before 2026-08 the site ran two quotes and used Jake's twice, which
is the thing a reader notices and discounts.

| Person | Page | What it evidences |
| --- | --- | --- |
| Jake Nelson-Dooley | `/` | Range and hands-on ability |
| Henry Purdy | `/the-work/constructconnect-conversion-optimization` | Demand gen at volume |
| Brad Fleming | `/the-work/seo-content-marketing-growth` | Brand, content, messaging |
| Steven Keyser | `/fractional-cmo` | Business alignment, budget ownership |
| Jonathan Lofquist | `/about` | Leadership, from a direct report |
| Andrew Grosvenor | `/about` | Leadership, from a peer |

Rules that are load-bearing.

- **One quote, one page.** Do not reuse a person across two pages to fill a
  gap. If a page needs a quote and none fits, the honest move is no quote.
- **Every name links to that person's LinkedIn profile.** A quote a recruiter
  can verify in one click is worth more than one they cannot, which is the
  whole reason the links are there and are visibly underlined rather than bare.
- **Attributions are past tense and name the shared company.** Four of them
  read "Worked with Tim at X, where he was Y". The title is the role that
  person held at the time, not their role today, and the phrasing exists so a
  reader cannot mistake it for a current one. Henry's says "Former Chief
  Marketing Officer" and Jake's says "worked with Tim at ConstructConnect", so
  both already carry it. Do not rewrite any of these into a bare title.
- **Four of the six are trimmed** from longer notes. Trims cut on sentence and
  paragraph boundaries only, never mid-sentence, so no ellipses are needed and
  nobody's meaning is sharpened. `timbot/facts.md` §15 carries both the site
  version and a summary of what was cut, so Timbot can quote the fuller note
  if asked. Keep those in sync if a quote on a page is re-trimmed.
- **Blockquotes carry no quotation marks.** The component's scale and field do
  that work. Jake's had straight ASCII quotes until 2026-08, the only ones on
  the site, and they were removed for consistency.
- All six use the same `figure > blockquote` + `figcaption > cite` markup. The
  ConstructConnect page used a `blockquote > p` + sibling `cite` variant until
  2026-08, normalized then.

`.testimonial--pair` is the two-up variant, currently only on `/about`. Two
display-size quotes centered side by side read as a shouting match, so the
variant goes left-aligned and one step down in type. Each figure carries a
gold left rule running its full height, quote and attribution together. That
is load-bearing rather than decorative. Without it the two quotes are the same
white-on-sage treatment with only a gap between them and they read as one
continuous passage, which is exactly how the first pass shipped and had to be
fixed. The stacked layout under 720px takes a full `--space-lg` row gap for
the same reason, since there the two follow each other in reading order.
Above 720px it uses
subgrid so both quotes share a row and both attributions share the next,
which is what lines the two **names** up. The flex fallback bottom-aligns
instead, lining up the last line of the roles, so the names drift apart
whenever one role wraps and the other does not. Neither `margin-top: auto`
nor `flex: 1` on the blockquote can fix that on its own, since both consume
the leftover space and bottom-anchor the caption. The row has to be shared
across the two figures. `row-gap` is zeroed in the subgrid branch because the
figcaption's `padding-top` already owns the quote-to-name spacing.

## Known placeholders to replace later

- Homepage capability panel 04 ("A leader people want to work for") has no
  third-party evidence inside the panel itself. The panel shows Tim's
  operating model, which is self-asserted by nature. As of 2026-08 the
  leadership evidence lives on `/about` instead, in the `.testimonial--pair`
  section directly under "Player coach, literally." (Jonathan Lofquist, a
  direct report, and Andrew Grosvenor, a peer). That was the cheaper half of
  the fix. Replacing or flanking the demo itself with a wall of quotes is
  still the stronger move and is still open, but it means re-measuring the
  pinned `.cap-demo` / `.cap-stage` heights and picking an interaction
  register that is not already in use, so it was deliberately left as its own
  job. Real team sizes would also replace the generic 1 to 12 slider range,
  and Tim has confirmed he can supply them.

- Proof-strip brand logos are text labels. Real logo files to come.
- The About page's "Why marketing" section had a dashed-border "Photo coming
  soon" placeholder next to the hit-list, removed on 2026-07-31 since the site
  is now live and an empty placeholder read worse than no photo. `.about-grid`
  is single-column now. When a real photo exists, re-add an image column
  (the removed `.about-photo` treatment is gone from `/css/style.css`, not
  just hidden, so this needs a fresh layout rather than an unhide).
- The CEI Clairvoyance case study has no closed-won revenue, deal count, or
  workshop/proof-of-value engagement counts, since none was available. It
  leads on the pipeline number instead, stated as "Millions in AI project
  pipeline" on Tim's instruction (2026-08). It previously read `$1MM+`
  everywhere. There is no more precise figure on record, so nothing on the
  site or in Timbot may resolve "millions" to a specific number. If a real
  figure ever surfaces, it replaces the word in all nine places at once. They
  are the homepage bento card, the `/the-work` card headline, the case study's
  meta/og/twitter/JSON-LD descriptions, its lede, both of its `.metric__value`
  stats, the Fractional CMO page's work card, the `.lever` panel copy in
  `/js/main.js`, and the `facts.md` ledger. Grep for "millions" rather than
  trusting this list. The recruiting lift is written
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
  implying a fractional track record. Its quote is Steven Keyser, Director of
  Marketing at ConstructConnect, chosen because his lines about aligning
  marketing to business objectives and managing large budgets are the closest
  register on record to what a fractional buyer screens for. It is not
  fractional evidence and must never be presented as such. A testimonial from
  someone who actually bought advisory work would still be the single
  highest-value addition to the page.
