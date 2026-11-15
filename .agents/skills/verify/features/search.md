# Search

## Sub-features

Home input; matching dropdown; Escape dismissal with preserved query; focus reopening; outside-click dismissal; unmatched query; clearing; Japan navigation. Source: `src/components/SearchBar.tsx`, homepage and country profile route.

## How to get to it (user POV)

Open the homepage and use the input labelled by placeholder `Search countries, regions, capitals...`. Type `jap`, then choose Japan.

## Driving it with Playwright

Use `--journey search`. The helper asserts each state using the real input, keys, clicks and visible links. Screenshots/accessibility snapshots cover home, matching results, Escape, outside click, no results, cleared input, and Japan. `actions.jsonl` records actions and observed URLs. Success requires the exact loopback Japan URL and visible Japan H1, without page errors.

## Gotchas

Scope dropdown links to the search input's parent: the homepage also links countries elsewhere. Clicking a still-focused field does not produce a new focus event; blur before testing focus reopening. Escape dismisses without clearing the query. Remote flag images and fonts are blocked and cannot establish a visual claim. `--fail-after-capture` deliberately fails immediately after the home capture and exercises failure cleanup only.
