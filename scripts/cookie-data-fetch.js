import fs from "fs";

const SOURCE = "open-cookie-database/open-cookie-database.json";

// --- Cookies Data FROM Open Cookie Database --- //
// names that belong in SESSION even when the DB category is Functional
const SESSION_LIKE = ["session", "sess", "sid", "csrf", "xsrf", "token", "auth", "jsession", "phpsess", "vwo"];

export async function buildCookieHeuristics() {
  const db = JSON.parse(fs.readFileSync(SOURCE, "utf8"));
  const analytics = {};
  const advertising = {};
  const necessary = {};
  const session = {};

  for (const entries of Object.values(db)) {
    for (const entry of entries) {
      const name = entry.cookie?.trim();
      if (!name) continue;

      switch (entry.category) {
        case "Analytics":
          analytics[name] = true;
          break;
        case "Marketing":
          advertising[name] = true;
          break;
        case "Security":
          session[name] = true;
          break;
        case "Functional": {
          const lower = name.toLowerCase();
          const isSession = SESSION_LIKE.some((p) => lower.includes(p));
          (isSession ? session : necessary)[name] = true;
          break;
        }
      }
    }
  }

  // ensure dist directory exists
  if (!fs.existsSync("dist")) fs.mkdirSync("dist");

  const totalCount = Object.keys(analytics).length + Object.keys(advertising).length
    + Object.keys(necessary).length + Object.keys(session).length;

  fs.writeFileSync("dist/cookie-heuristics.json", JSON.stringify({
    version: new Date().toISOString().split("T")[0],
    totalCount,
    analytics,
    advertising,
    necessary,
    session,
  }));
}
