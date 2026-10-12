"""Build the hero-options proposal: inline the storyboard frames into one self-contained page.

Usage: python3 -I build.py template.html ../.assets ../ui-proposal.html
Placeholder: {{name}} -> data URI of <assets>/name.webp
"""
import base64, pathlib, re, sys

tpl, assets, out = (pathlib.Path(a) for a in sys.argv[1:4])
html = tpl.read_text()


def uri(m):
    f = assets / f"{m.group(1)}.webp"
    return "data:image/webp;base64," + base64.b64encode(f.read_bytes()).decode()


html = re.sub(r"\{\{([a-z0-9-]+)\}\}", uri, html)
out.write_text(html)
print(out, f"{len(html) / 1024:.0f} KB")
