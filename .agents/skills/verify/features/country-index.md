# Country index

## Sub-features

Homepage entry, alphabetical index, letter anchor, Japan profile link. Source: `src/app/countries/page.tsx`.

## How to get to it (user POV)

Choose the homepage's “View all … countries →” link, select J in the letter index, then select Japan.

## Driving it with Playwright

Use `--journey countries`. Assert the All Countries H1 after the homepage link, the `#letter-J` fragment after selecting J, and the Japan H1 after the link within that letter section. Captures cover index and Japan. Region links from the index have a separate `regions` journey.

## Gotchas

Use the exact letter fragment and scope Japan to its letter section. This journey samples J/Japan; it does not prove every index entry or a direct URL entry. Remote flags are blocked. A feature recipe remains unverified until its run evidence exists.
