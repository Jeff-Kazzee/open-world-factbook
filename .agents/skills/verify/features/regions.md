# Regions

## Sub-features

Homepage region entry, country list in a region, Japan navigation, home return, region entry from the countries index. Source: `src/app/page.tsx`, `src/app/countries/page.tsx`, `src/app/region/[id]/page.tsx`.

## How to get to it (user POV)

Choose East & Southeast Asia from the homepage, select Japan, return home, choose “View all … countries →”, and choose the same region there.

## Driving it with Playwright

Use `--journey regions`. Assert East & Southeast Asia, Japan, Open World Factbook, All Countries and the region H1 at each navigation. The helper records clicks and captures each destination.

## Gotchas

The canonical URL ID is `east-n-southeast-asia`. Only this region and Japan are sampled. Maps and remote flags are blocked; do not infer their loading from the local page. Unknown-region HTTP behavior is outside this browser recipe.
