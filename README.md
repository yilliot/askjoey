# askjoey

Listing website for **Joey Lee** (REN 80914, IQI Realty Sdn Bhd): new homes in Johor Bahru for Singapore buyers.

- Live preview: https://askjoey.axon.commun.cloud (no-index until Joey's own domain)
- Projects: **New Casa Suites** (R&F Princess Cove Phase 3) and **Causewayz Square @ JBCC** (Exsim)
- Design: UI proposal P135 v2 (`docs/plan/new-casa-listing-site/`), accepted 12 Oct 2026

| Folder | What |
|---|---|
| `site/` | Astro static site. Content lives in `site/src/data/*.ts` (Joey's details in `agent.ts`) |
| `site/scripts/grade.sh` | Graded master photos from `materials/` into `site/src/assets/img/` |
| `deploy/` | nginx site + installer for the axon EC2, and `deploy.sh` |
| `materials/` | Developers' brochures and images as downloaded, with `FACTS.md` per project |

```sh
cd site && npm install                  # Node 24 (see .nvmrc)
npm run dev                             # local dev server
bash scripts/grade.sh                   # after changing source photos
bash ../deploy/deploy.sh                # push to GitHub; axon pulls, builds, switches; check
bash ../deploy/deploy.sh rollback       # back to the previous release
```

Still from Joey: the agency's Board of Valuers firm number "E (1) …" (`site/src/data/agent.ts` → `agencyReg`; the SSM company number is in), per-layout price lists.
