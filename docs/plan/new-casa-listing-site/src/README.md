Source for `../ui-proposal.html` (one self-contained page, filed with Steward as `askjoey / new-casa-listing-site`).

```sh
bash mkassets.sh                                   # graded webp images from materials/ into ../.assets
python3 -I build.py template.html ../.assets ../ui-proposal.html
steward run proposal add docs/plan/new-casa-listing-site/ui-proposal.html --project askjoey --slug new-casa-listing-site --title "Joey's listing site — New Casa Suites (R&F Princess Cove Phase 3)"
```
