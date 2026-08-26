# Timbot avatar

`timbot-avatar-source.png` is the raw upload, kept for provenance and not
referenced by any page.

`timbot-avatar.webp` is what the site loads. Generate it with:

    pip install Pillow
    python3 scripts/process-timbot-avatar.py

The script crops to the artwork's bounding box, squares it, masks everything
outside the circle to alpha, and encodes a 512x512 RGBA WebP. Re-run it against
a replacement export rather than editing the output by hand.
