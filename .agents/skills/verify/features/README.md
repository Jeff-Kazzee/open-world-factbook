# Factbook feature map

Read [the verification skill](../SKILL.md) for isolation, prerequisites, evidence and cleanup. Choose the smallest relevant journey using `--journey` with the helper command there. Every mode starts its own isolated instance and fresh browser context; a recipe is not evidence that it ran. Bind completion to the actual `result.json` and source/helper hashes in retained evidence.

| Feature | Recipe | Helper journey |
| --- | --- | --- |
| Search and result navigation | [Search](search.md) | `search` |
| Alphabetical country browsing | [Country index](country-index.md) | `countries` |
| Region browsing | [Regions](regions.md) | `regions` |
| Country profile | [Country profile](country-profile.md) | `profile` |
| Project/data/contribution information | [Information pages](information-pages.md) | `information` |

The minimum setup proof is the complete `search` journey plus the deliberate failed-drive cleanup control. Other recipes remain unverified until their own recorded execution. This map does not cover remote visuals, every country/region, footer entry points on every page, or unknown-route behavior; existing HTTP smoke evidence keeps its original separate scope.

The coordinator reports successful Linveo execution of both minimum setup controls on the matching-source independently built candidate recorded in [the skill](../SKILL.md). This closes the initial setup proof only; it does not imply the other four modes ran.
