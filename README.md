# tracking-data-collector

Pipeline to collect and process tracking-related data from multiple sources and convert it into structured JSON files for further use.

## Description

This repository automates the extraction and transformation of tracker, CMP, cookie, and E2E test site data from multiple open-source datasets and public APIs. The pipeline runs as a weekly cron job, commits the generated files to `dist/` in this repo, and pushes the tracker data directly to the [detecta](https://github.com/leolivi/detecta) extension repo. The [klartxt](https://github.com/leolivi/klartxt) extension repo instead pulls the `dist/` output from here itself, via its own weekly action.

## Features

- Extracts tracker, fingerprinting, and tracking parameter data from DuckDuckGo Tracker Radar (DuckDuckGo, Inc., 2025)
- Extracts CMP selectors from Consent-O-Matic (Nouwens und Nylandsted Klokmose, 2025)
- Extracts cookie category heuristics from the Open Cookie Database (Kwakman, 2023)
- Fetches the current Tranco top-100 domain list for E2E test site curation (Le Pochat et al., 2019)
- Runs automatically on a weekly schedule, commits the results to `dist/`, and pushes updates to the detecta repo

## Output

| File | Description |
|---|---|
| `dist/tracker-core.json` | Top 2000 tracker domains with metadata |
| `dist/tracker-extended.json` | Remaining tracker domains |
| `dist/fingerprint-domains.json` | Domains with medium/high fingerprinting score |
| `dist/tracking-params.json` | Known tracking URL parameters |
| `dist/cmp-selectors.json` | CMP names and their CSS selectors |
| `dist/cookie-heuristics.json` | Cookie names categorized by purpose |
| `dist/tranco-candidates.json` | Top 100 domains from Tranco -> run on demand for site re-curation, not part of the weekly sync |

## Usage

> **Note:** `npm run extract` requires the external source repositories (`tracker-radar`, `consent-o-matic`, `open-cookie-database`) to be cloned into the project root first. This happens automatically in the GitHub Actions pipeline but must be done manually for local runs. The script is intended to be run via the automated workflow.

To run the pipeline locally:

```zsh
git clone https://github.com/duckduckgo/tracker-radar.git
git clone https://github.com/cavi-au/Consent-O-Matic.git consent-o-matic
git clone https://github.com/jkwakman/Open-Cookie-Database.git open-cookie-database
npm run extract
```

After execution, the extracted data will be available in the `dist/` directory.

## Project Structure

```
tracking-data-collector/
├── extract.js
├── scripts/ ...
└── .github/
    └── workflows/
        └── update.yml
```

## Automated Workflow

The pipeline runs automatically every Monday at 9 AM UTC:

1. Clones the latest data from DuckDuckGo Tracker Radar, Consent-O-Matic, and Open Cookie Database
2. Runs `extract.js` to generate all files in `dist/`
3. Commits the updated `dist/` files to this repo if data has changed
4. Copies the tracker files to [detecta](https://github.com/leolivi/detecta) and pushes them directly (push-based)

[klartxt](https://github.com/leolivi/klartxt) does **not** get pushed to. Instead, it runs its own weekly "Sync Tracking Data" action (Mondays at 10 AM UTC, an hour after this pipeline) that clones this repo and copies the relevant `dist/` files into place (pull-based). This keeps klartxt in control of when it accepts new data.

**Manual trigger:** Available via GitHub Actions workflow dispatch on either repo.

## Dependencies

- Node.js (>= v20)

## Installation

1. Clone this repository.
2. Install dependencies:

```zsh
npm install
```

3. Run the extraction script:

```zsh
npm run extract
```

## License

MIT License. Source data is publicly available from the projects listed below.

## Sources

DuckDuckGo, Inc., 2025. duckduckgo/tracker-radar. [online] GitHub. Verfügbar unter: https://github.com/duckduckgo/tracker-radar [Zugegriffen 13 November 2025].

Kwakman, J., 2023. Open Cookie Database. [online] GitHub. Verfügbar unter: https://github.com/jkwakman/Open-Cookie-Database [Zugegriffen 10 Mai 2026].

Le Pochat, V., Van Goethem, T., Tajalizadehkhoob, S., Korczynski, M. und Joosen, W., 2019. Tranco: A Research-Oriented Top Sites Ranking Hardened Against Manipulation. In: Proceedings 2019 Network and Distributed System Security Symposium. [online] Network and Distributed System Security Symposium. San Diego, CA: Internet Society. https://doi.org/10.14722/ndss.2019.23386.

Nouwens, M. und Nylandsted Klokmose, C., 2025. Consent-O-Matic. [online] Verfügbar unter: https://consentomatic.au.dk/ [Zugegriffen 30 Dezember 2025].

---

This pipeline is designed for easy integration into other projects and provides a regularly updated dataset of web trackers, CMP patterns, and cookie categories.
