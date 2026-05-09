import fs from "fs";

const SOURCE = "consent-o-matic/Rules.json";

// --- CMP Data FROM CONSENT-O-MATIC --- //
// CMP selectors from Consent-O-Matic
export async function buildCMPHeuristics() {
  const rules = JSON.parse(fs.readFileSync(SOURCE, "utf8"));

  const cmpMap = {};
  const selectorMap = {};

  for (const [name, config] of Object.entries(rules)) {
    cmpMap[name] = true;
    for (const detector of config.detectors ?? []) {
      for (const key of ["presentMatcher", "showingMatcher"]) {
        const selector = detector[key]?.target?.selector;
        if (selector) selectorMap[selector] = true;
      }
    }
  }

  // ensure dist directory exists
  if (!fs.existsSync("dist")) fs.mkdirSync("dist");

  fs.writeFileSync("dist/cmp-selectors.json", JSON.stringify({
    version: new Date().toISOString().split("T")[0],
    totalCount: Object.keys(cmpMap).length,
    cmps: cmpMap,
    selectors: selectorMap,
  }));
}
