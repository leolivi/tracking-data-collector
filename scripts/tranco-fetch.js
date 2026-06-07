import fs from "fs";
import { DataCollector } from "./DataCollector.js";

// Fetches the latest Tranco top-100 list and saves the candidates.
// Output: dist/tranco-candidates.json
// Tranco methodology: https://tranco-list.eu/methodology

const CANDIDATE_COUNT = 100;

async function fetchListId() {
  const today = new Date();
  for (let offset = 0; offset < 7; offset++) {
    const d = new Date(today);
    d.setDate(d.getDate() - offset);
    const dateStr = d.toISOString().split("T")[0];

    const res = await fetch(`https://tranco-list.eu/api/lists/date/${dateStr}`);
    if (!res.ok) continue;

    const json = await res.json();
    if (json.list_id) return { listId: json.list_id, date: dateStr };
  }
  throw new Error("Tranco: no list found for the last 7 days");
}

async function fetchCandidates(listId) {
  const res = await fetch(
    `https://tranco-list.eu/download/${listId}/${CANDIDATE_COUNT}`
  );
  if (!res.ok) throw new Error(`Tranco download failed: ${res.status}`);

  const text = await res.text();
  return text
    .trim()
    .split("\n")
    .slice(0, CANDIDATE_COUNT)
    .map(line => {
      const comma = line.indexOf(",");
      return {
        rank:   parseInt(line.slice(0, comma), 10),
        domain: line.slice(comma + 1).trim(),
      };
    });
}

export async function buildTrancoCandidates() {
  const { listId, date } = await fetchListId();
  console.log(`Tranco list ${listId} (${date})`);

  const candidates = await fetchCandidates(listId);
  console.log(`Fetched ${candidates.length} Tranco candidates`);

  const collector = new DataCollector();
  // candidates as domain → rank map so writeDist totalCount works correctly
  const candidateMap = Object.fromEntries(
    candidates.map(({ rank, domain }) => [domain, rank])
  );

  collector.writeDist("tranco-candidates.json", { candidates: candidateMap });
  console.log("Saved dist/tranco-candidates.json");
}
