# Information pages

## Sub-features

About Project, Data API and Contribute footer navigation, page headings and home returns. Source: `src/components/Footer.tsx`, `src/app/about/page.tsx`, `src/app/api-docs/page.tsx`, `src/app/contribute/page.tsx`.

## How to get to it (user POV)

Use the homepage footer links About Project, Data API and Contribute. Return home using the page's home link between visits.

## Driving it with Playwright

Use `--journey information`. The helper clicks footer links and asserts H1s `About Open World Factbook`, `Data Access` and `Contribute`, plus the home H1 after each return. It records actions and captures every destination.

## Gotchas

Data API is a documentation page, not a callable API endpoint. External repository, contribution and donation links must not be followed. This recipe samples homepage footer entry only; footer links from every other page and remote destinations are not covered.
