#!/usr/bin/env python3
"""
Processes the Timbot avatar from its raw upload into the file the site loads.

    pip install Pillow
    python3 scripts/process-timbot-avatar.py

Input:  assets/timbot/timbot-avatar-source.png   (raw upload, kept for provenance)
Output: assets/timbot/timbot-avatar.webp         (512x512 RGBA, what the site uses)

The source art is a circular illustration sitting on a square white canvas.
Three steps:

1. Find the circle. Scan in from each edge for the first non-white pixel and
   crop to that bounding box, so a lopsided margin in the export does not
   leave the face off-centre.
2. Mask everything outside the circle to alpha, with a one-pixel feathered
   edge. The widget already clips to a circle in CSS, so this mostly matters
   if the avatar is ever used somewhere square, and it stops a white fringe
   showing at the edge of the CSS mask on non-integer device pixel ratios.
3. Resize to 512 and encode WebP with alpha at quality 88. That is 2x the
   largest place it renders (the 48px launcher and the 40px panel header are
   the only two), which covers retina with room to spare.

Re-run this against a replacement export rather than hand-editing the output.
"""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "timbot" / "timbot-avatar-source.png"
OUT = ROOT / "assets" / "timbot" / "timbot-avatar.webp"

SIZE = 512
QUALITY = 88
# Anything at or above this in all channels counts as background.
WHITE = 244


def content_box(img):
    """Bounding box of everything that is not near-white."""
    rgb = img.convert("RGB")
    w, h = rgb.size
    px = rgb.load()

    def is_bg(x, y):
        r, g, b = px[x, y]
        return r >= WHITE and g >= WHITE and b >= WHITE

    left, right, top, bottom = 0, w - 1, 0, h - 1

    while left < right and all(is_bg(left, y) for y in range(h)):
        left += 1
    while right > left and all(is_bg(right, y) for y in range(h)):
        right -= 1
    while top < bottom and all(is_bg(x, top) for x in range(w)):
        top += 1
    while bottom > top and all(is_bg(x, bottom) for x in range(w)):
        bottom -= 1

    return left, top, right + 1, bottom + 1


def main():
    if not SRC.exists():
        raise SystemExit(
            f"Missing {SRC.relative_to(ROOT)}.\n"
            "Upload the raw avatar there first, then re-run."
        )

    img = Image.open(SRC).convert("RGBA")
    box = content_box(img)
    img = img.crop(box)

    # Square it off around the centre so the circular mask lands true.
    w, h = img.size
    side = max(w, h)
    square = Image.new("RGBA", (side, side), (255, 255, 255, 0))
    square.paste(img, ((side - w) // 2, (side - h) // 2))

    art = square.resize((SIZE, SIZE), Image.LANCZOS)

    # Circular alpha mask, feathered by a pixel so the edge is not jagged.
    mask = Image.new("L", (SIZE * 4, SIZE * 4), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, SIZE * 4 - 1, SIZE * 4 - 1), fill=255)
    mask = mask.resize((SIZE, SIZE), Image.LANCZOS).filter(
        ImageFilter.GaussianBlur(0.5)
    )

    out = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    out.paste(art, (0, 0), mask)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    out.save(OUT, "WEBP", quality=QUALITY, method=6)

    kb = OUT.stat().st_size / 1024
    print(f"cropped {Image.open(SRC).size} -> {box} -> {SIZE}x{SIZE}")
    print(f"wrote {OUT.relative_to(ROOT)} ({kb:.0f} KB)")


if __name__ == "__main__":
    main()
