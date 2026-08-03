import { buildCMPHeuristics } from "./scripts/cmp-data-fetch.js"
import { buildCookieHeuristics } from "./scripts/cookie-data-fetch.js"
import { buildTrackerHeuristics } from "./scripts/tracker-data-fetch.js"
import { buildTrancoCandidates } from "./scripts/tranco-fetch.js"

const sources = [
  ["tracker heuristics", buildTrackerHeuristics],
  ["CMP heuristics", buildCMPHeuristics],
  ["cookie heuristics", buildCookieHeuristics],
  ["Tranco candidates", buildTrancoCandidates],
]

async function extract() {
  for (const [name, build] of sources) {
    try {
      await build()
    } catch (err) {
      console.error(
        `Failed to build ${name}, keeping previous dist file:`,
        err.message,
      )
    }
  }
}

extract()
