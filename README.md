# tracking-data-collector

Pipeline to collect and process tracking-related data from multiple sources and convert it into structured JSON files for further use.

## Description

This repository automates the extraction and transformation of tracker, CMP, and cookie data from three open-source datasets. The pipeline runs as a weekly cron job and automatically syncs the updated data to the [detecta](https://github.com/leolivi/detecta) and [klartxt](https://github.com/leolivi/klartxt) extension repositories.

## Features

- Extracts tracker, fingerprinting, and tracking parameter data from DuckDuckGo Tracker Radar (DuckDuckGo, Inc., 2025)
- Extracts CMP selectors from Consent-O-Matic (Nouwens und Nylandsted Klokmose, 2025)
- Extracts cookie category heuristics from the Open Cookie Database (Kwakman, 2023)
- Runs automatically on a weekly schedule and pushes updates to downstream repos

## Output

| File | Description |
|---|---|
| `dist/tracker-core.json` | Top 2000 tracker domains with metadata |
| `dist/tracker-extended.json` | Remaining tracker domains |
| `dist/fingerprint-domains.json` | Domains with medium/high fingerprinting score |
| `dist/tracking-params.json` | Known tracking URL parameters |
| `dist/cmp-selectors.json` | CMP names and their CSS selectors |
| `dist/cookie-heuristics.json` | Cookie names categorized by purpose |

## Usage

To run the pipeline locally:

```zsh
npm run extract
```

After execution, the extracted data will be available in the `dist/` directory.

## Project Structure

```
tracking-data-collector/
├── extract.js
├── scripts/
│   ├── DataCollector.js
│   ├── tracker-data-fetch.js
│   ├── cmp-data-fetch.js
│   └── cookie-data-fetch.js
└── .github/
    └── workflows/
        └── update.yml
```

## Automated Workflow

The pipeline runs automatically every Monday at 9 AM UTC:

1. Clones the latest data from DuckDuckGo Tracker Radar, Consent-O-Matic, and Open Cookie Database
2. Runs `extract.js` to generate all files in `dist/`
3. Copies updated files to [detecta](https://github.com/leolivi/detecta) and [klartxt](https://github.com/leolivi/klartxt)
4. Commits and pushes changes if data has been updated

**Manual trigger:** Available via GitHub Actions workflow dispatch.

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

Nouwens, M. und Nylandsted Klokmose, C., 2025. Consent-O-Matic. [online] Verfügbar unter: https://consentomatic.au.dk/ [Zugegriffen 30 Dezember 2025].

---

This pipeline is designed for easy integration into other projects and provides a regularly updated dataset of web trackers, CMP patterns, and cookie categories.
