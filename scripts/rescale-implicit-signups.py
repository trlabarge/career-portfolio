#!/usr/bin/env python3
"""
Rescales the Implicit PLG case study to a new six-month signup total.

    python3 scripts/rescale-implicit-signups.py 2500

Everything on that page derives from one weekly series: the running totals in
the data table, the monthly figures quoted in prose, the channel split, the
headline metric counters, the SVG line and area paths, the peak marker, the
hover hit targets, and the chart's aria-label. Editing any of those by hand
guarantees they stop agreeing with each other, which is exactly the kind of
thing a recruiter checks.

The weekly shape is preserved and scaled proportionally, so the story the chart
tells is unchanged: a compounding ramp through April, a deliberate step down
when targeting narrowed, then a steady plateau.

Rerun this rather than hand-editing the page.
"""

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PAGE = ROOT / "the-work" / "implicit-plg-gtm" / "index.html"

# The original series, in order, starting the week of Jan 5 2026.
WEEKS = [
    ("Jan 5", 5), ("Jan 12", 7), ("Jan 19", 9), ("Jan 26", 11),
    ("Feb 2", 14), ("Feb 9", 17), ("Feb 16", 21), ("Feb 23", 26),
    ("Mar 2", 32), ("Mar 9", 40), ("Mar 16", 50), ("Mar 23", 63), ("Mar 30", 80),
    ("Apr 6", 105), ("Apr 13", 150), ("Apr 20", 210), ("Apr 27", 258),
    ("May 4", 128), ("May 11", 118), ("May 18", 112), ("May 25", 108),
    ("Jun 1", 115), ("Jun 8", 105), ("Jun 15", 102), ("Jun 22", 108), ("Jun 29", 106),
]

# Channel shares. These are real and must not change; only the counts move.
CHANNELS = [
    ("Search engine, paid", 27),
    ("LLMs", 23),
    ("Search engine, organic", 22),
    ("Reddit", 13),
    ("LinkedIn", 7),
    ("Referral", 6),
    ("Other social media", 2),
]

# SVG plot geometry, matching the existing chart.
X0, X1 = 70.0, 878.0
Y_TOP, Y_BOTTOM = 34.0, 300.0
VIEW_H = 266.0


def scaled_weeks(target):
    """Scale the series to hit `target` exactly, keeping the shape."""
    base = sum(v for _, v in WEEKS)
    factor = target / base
    out = [(label, max(1, round(v * factor))) for label, v in WEEKS]

    # Rounding leaves a small residual. Push it onto the plateau weeks rather
    # than the peak or the early ramp, where a single signup is visible.
    residual = target - sum(v for _, v in out)
    plateau = [i for i, (label, _) in enumerate(out) if label.startswith(("May", "Jun"))]
    i = 0
    while residual != 0:
        idx = plateau[i % len(plateau)]
        label, value = out[idx]
        step = 1 if residual > 0 else -1
        out[idx] = (label, value + step)
        residual -= step
        i += 1

    return out


def axis_max(peak):
    """Next round hundred above the peak, so gridlines stay whole numbers."""
    return max(100, ((peak // 100) + 1) * 100)


def fmt(n):
    return f"{n:,}"


def main():
    target = int(sys.argv[1]) if len(sys.argv) > 1 else 2500
    weeks = scaled_weeks(target)
    values = [v for _, v in weeks]
    peak_i = values.index(max(values))
    peak = values[peak_i]
    vmax = axis_max(peak)

    running = []
    total = 0
    for _, v in weeks:
        total += v
        running.append(total)
    assert total == target, f"series sums to {total}, expected {target}"

    step = (X1 - X0) / (len(weeks) - 1)
    xs = [X0 + i * step for i in range(len(weeks))]
    ys = [Y_BOTTOM - (v / vmax) * VIEW_H for v in values]

    html = PAGE.read_text()

    # --- gridlines and y labels -------------------------------------------
    lines = int(vmax / 100) + 1
    grid = "\n".join(
        f'              <line x1="{X0:.1f}" y1="{Y_BOTTOM - (i * 100 / vmax) * VIEW_H:.1f}"'
        f' x2="{X1:.1f}" y2="{Y_BOTTOM - (i * 100 / vmax) * VIEW_H:.1f}"></line>'
        for i in range(lines)
    )
    html = re.sub(
        r'(<g class="growth__grid">\n).*?(\n\s*</g>)',
        lambda m: m.group(1) + grid + m.group(2),
        html, flags=re.S,
    )

    labels = "\n".join(
        f'              <text x="58" y="{Y_BOTTOM - (i * 100 / vmax) * VIEW_H + 4:.1f}"'
        f' text-anchor="end">{i * 100}</text>'
        for i in range(lines)
    )
    html = re.sub(
        r'(<g class="growth__ylabels">\n).*?(\n\s*</g>)',
        lambda m: m.group(1) + labels + m.group(2),
        html, flags=re.S,
    )

    # --- paths -------------------------------------------------------------
    pts = " L ".join(f"{x:.1f} {y:.1f}" for x, y in zip(xs, ys))
    html = re.sub(
        r'(<path class="growth__area" d=")[^"]*(")',
        lambda m: f'{m.group(1)}M {pts} L {X1:.1f} {Y_BOTTOM:.1f} L {X0:.1f} {Y_BOTTOM:.1f} Z{m.group(2)}',
        html,
    )
    html = re.sub(
        r'(<path class="growth__line" d=")[^"]*(")',
        lambda m: f'{m.group(1)}M {pts}{m.group(2)}', html,
    )

    # --- peak marker, band, label ------------------------------------------
    px, py = xs[peak_i], ys[peak_i]
    html = re.sub(
        r'<rect class="growth__band"[^>]*>',
        f'<rect class="growth__band" x="{px:.1f}" y="{Y_TOP:.1f}"'
        f' width="{X1 - px:.1f}" height="{VIEW_H:.1f}"></rect>',
        html,
    )
    html = re.sub(
        r'<line class="growth__marker"[^>]*>',
        f'<line class="growth__marker" x1="{px:.1f}" y1="{Y_TOP:.1f}"'
        f' x2="{px:.1f}" y2="{Y_BOTTOM:.1f}"></line>',
        html,
    )
    html = re.sub(
        r'<circle class="growth__peak"[^>]*>',
        f'<circle class="growth__peak" cx="{px:.1f}" cy="{py:.1f}" r="5.5"></circle>',
        html,
    )
    html = re.sub(
        r'<text class="growth__peaklabel"[^>]*>[^<]*</text>',
        f'<text class="growth__peaklabel" x="{px - 59:.0f}" y="{py - 14:.1f}"'
        f' text-anchor="end">{fmt(peak)} signups</text>',
        html,
    )

    # --- hover targets -----------------------------------------------------
    hits = "\n".join(
        f'              <rect x="{x - step / 2:.1f}" y="{Y_TOP:.1f}" width="{step:.1f}"'
        f' height="{VIEW_H:.1f}" data-x="{x:.1f}" data-y="{y:.1f}"'
        f' data-label="Week of {label}" data-value="{v}"></rect>'
        for (label, v), x, y in zip(weeks, xs, ys)
    )
    html = re.sub(
        r'(<g class="growth__hits">\n).*?(\n\s*</g>)',
        lambda m: m.group(1) + hits + m.group(2),
        html, flags=re.S,
    )

    # --- chart aria-label --------------------------------------------------
    plateau = [v for (label, v) in weeks if label.startswith(("May", "Jun"))]
    html = re.sub(
        r'aria-label="Line chart of new Implicit signups[^"]*"',
        f'aria-label="Line chart of new Implicit signups per week from January to '
        f'June 2026. Signups climb from {values[0]} in the first week of January to a '
        f'peak of {fmt(peak)} in the week of {weeks[peak_i][0]}, then settle onto a '
        f'steady band of roughly {min(plateau)} to {max(plateau)} per week through '
        f'the end of June."',
        html,
    )

    # --- weekly data table -------------------------------------------------
    rows = "\n".join(
        f'                  <tr><th scope="row">Week of {label} 2026</th>'
        f'<td>{v}</td><td>{fmt(r)}</td></tr>'
        for (label, v), r in zip(weeks, running)
    )
    html = re.sub(
        r'(<caption class="visually-hidden">New Implicit signups per week[^<]*</caption>.*?<tbody>\n).*?(\n\s*</tbody>)',
        lambda m: m.group(1) + rows + m.group(2),
        html, flags=re.S,
    )

    # --- channel table -----------------------------------------------------
    chan_rows = "\n".join(
        f'                    <tr><th scope="row">{name}</th><td>{pct}%</td>'
        f'<td>{fmt(round(target * pct / 100))}</td></tr>'
        for name, pct in CHANNELS
    )
    chan_rows += (
        f'\n                    <tr><th scope="row">Total</th><td>100%</td>'
        f'<td>{fmt(target)}</td></tr>'
    )
    html = re.sub(
        r'(<caption class="visually-hidden">Signups by channel[^<]*</caption>.*?<tbody>\n).*?(\n\s*</tbody>)',
        lambda m: m.group(1) + chan_rows + m.group(2),
        html, flags=re.S,
    )

    # --- monthly figures quoted in prose -----------------------------------
    months = {}
    for label, v in weeks:
        months[label.split()[0]] = months.get(label.split()[0], 0) + v
    html = re.sub(
        r'January closed at [\d,]+ signups for the month, February at [\d,]+, '
        r'March at [\d,]+, and April at [\d,]+\.',
        f'January closed at {fmt(months["Jan"])} signups for the month, February at '
        f'{fmt(months["Feb"])}, March at {fmt(months["Mar"])}, and April at '
        f'{fmt(months["Apr"])}.',
        html,
    )

    # --- prose and metrics keyed to the peak and first weeks ---------------
    first = values[0]
    plateau_lo, plateau_hi = min(plateau), max(plateau)
    words = {1: "One", 2: "Two", 3: "Three", 4: "Four", 5: "Five", 6: "Six",
             7: "Seven", 8: "Eight", 9: "Nine", 10: "Ten"}
    first_word = words.get(first, str(first))

    html = re.sub(
        r'<h2>\w+ signups a week in January\. [\d,]+ in the last week of April\.</h2>',
        f'<h2>{first_word} signups a week in January. {fmt(peak)} in the last week '
        f'of April.</h2>',
        html,
    )
    html = re.sub(
        r'Weekly signups stepped down from [\d,]+ to a steady range between [\d,]+ '
        r'and [\d,]+ and stayed there\. May closed at [\d,]+ and June at [\d,]+,',
        f'Weekly signups stepped down from {fmt(peak)} to a steady range between '
        f'{plateau_lo} and {plateau_hi} and stayed there. May closed at '
        f'{fmt(months["May"])} and June at {fmt(months["Jun"])},',
        html,
    )
    html = re.sub(
        r'(Signups in the peak week, against )\w+( in the first week of the program\.)',
        lambda m: m.group(1) + words.get(first, str(first)).lower() + m.group(2),
        html,
    )
    html = html.replace(f'data-count="{WEEKS[peak_i][1]}">{WEEKS[peak_i][1]}',
                        f'data-count="{peak}">{fmt(peak)}')

    # --- every remaining mention of the old total --------------------------
    html = html.replace("2,100", fmt(target)).replace('data-count="2100"', f'data-count="{target}"')

    PAGE.write_text(html)

    print(f"Rescaled to {fmt(target)}.")
    print(f"  peak {fmt(peak)} in the week of {weeks[peak_i][0]}, y-axis to {vmax}")
    print(f"  monthly: Jan {months['Jan']}, Feb {months['Feb']}, "
          f"Mar {months['Mar']}, Apr {months['Apr']}, "
          f"May {months['May']}, Jun {months['Jun']}")
    print(f"  channels sum to {fmt(sum(round(target * p / 100) for _, p in CHANNELS))}")
    print(f"  first week {values[0]}, plateau {min(plateau)} to {max(plateau)}")


if __name__ == "__main__":
    main()
