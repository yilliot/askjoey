Source for `../ui-proposal.html` (one self-contained page, filed with Steward as `askjoey / hero-options`).
The frames are screenshots of the hero lab (`site/src/pages/lab/`), taken with Playwright at 1440×900 and 390×844.

```sh
python3 -I build.py template.html ../.assets ../ui-proposal.html
steward run proposal add docs/plan/hero-options/ui-proposal.html --project askjoey --slug hero-options --title "Hero options — more visual impact"
```
