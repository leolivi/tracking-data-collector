import { buildCookieHeuristics } from "./scripts/cookie-data-fetch.js";
import { buildCMPHeuristics } from "./scripts/cmp-data-fetch.js";
import { buildTrackerHeuristics } from "./scripts/tracker-data-fetch.js";
import { buildTrancoCandidates } from "./scripts/tranco-fetch.js";

async function extract() {
  await buildTrackerHeuristics();
  await buildCMPHeuristics();
  await buildCookieHeuristics();
  await buildTrancoCandidates();
}

extract();



