# Country profile

## Sub-features

Direct Japan entry, server response, visible country heading, home navigation. Source: `src/app/country/[slug]/page.tsx`.

## How to get to it (user POV)

Open `/country/japan` directly, or reach Japan through homepage search, country index or region links. Use the top home link to return.

## Driving it with Playwright

Use `--journey profile` for direct entry: assert HTTP 200, visible Japan H1 and a successful home-link return. It retains a Japan capture and home capture. Search, countries and regions journeys cover their own Japan entry points when separately executed.

## Gotchas

The default search journey proves only search-to-profile navigation. This profile recipe does not assert every section, featured-country entry, every possible country or remote maps/flags. Missing/unknown-country responses belong to separate HTTP smoke checks.
