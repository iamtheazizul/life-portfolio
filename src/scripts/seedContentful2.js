import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Walk upward from this file's location until we find .env.local (or hit
// the filesystem root), so this works no matter which folder the script
// lives in or which directory you run `node` from.
function findEnvFile(startDir, filename = ".env.local") {
  let dir = startDir;
  for (let i = 0; i < 8; i++) {
    const candidate = path.join(dir, filename);
    if (fs.existsSync(candidate)) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

const envPath = findEnvFile(__dirname);
if (envPath) {
  dotenv.config({ path: envPath });
} else {
  console.warn("Could not find .env.local by walking up from this script.");
}

const SPACE_ID = process.env.VITE_CONTENTFUL_SPACE_ID;
const MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const ENV_ID = process.env.CONTENTFUL_ENV_ID || "master";
const LOCALE = process.env.CONTENTFUL_LOCALE || "en-US";

if (!SPACE_ID || !MANAGEMENT_TOKEN) {
  console.error(
    "Missing env vars. Set VITE_CONTENTFUL_SPACE_ID and CONTENTFUL_MANAGEMENT_TOKEN in .env.local."
  );
  process.exit(1);
}

// Content type IDs as configured in Contentful. Adjust these if your
// `branch` / `link` content types were created with different casing
// than `Milestone` (Contentful content type IDs are case-sensitive).
const CONTENT_TYPES = {
  milestone: "milestone",
  branch: "branch",
  link: "link",
};

const BASE_URL = `https://api.contentful.com/spaces/${SPACE_ID}/environments/${ENV_ID}`;

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${MANAGEMENT_TOKEN}`,
    "Content-Type": "application/json",
  },
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retries a request on 429 (rate limit), waiting however long Contentful
 * says to wait (X-Contentful-RateLimit-Reset, in seconds) before retrying.
 * Falls back to simple backoff if that header isn't present.
 */
async function withRetry(fn, { retries = 5 } = {}) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const status = err.response?.status;
      const isLastAttempt = attempt === retries;
      if (status === 429 && !isLastAttempt) {
        const resetSeconds = Number(
          err.response.headers?.["x-contentful-ratelimit-reset"]
        );
        const waitMs = Number.isFinite(resetSeconds)
          ? resetSeconds * 1000 + 200
          : 1000 * (attempt + 1);
        console.warn(`  rate limited — waiting ${waitMs}ms (attempt ${attempt + 1}/${retries})`);
        await sleep(waitMs);
        continue;
      }
      throw err;
    }
  }
}

// Small pause between entities so we stay well under the rate limit
// instead of relying on retries to bail us out after the fact.
const REQUEST_PACING_MS = 150;

const MILESTONES = [
  {
    id: "y1-fall", year: "2022", term: "Fall", title: "Freshman Year — Fall", category: "course",
    branches: [
      { id: "1a", title: "Intro to Comp. Sci.", details: { description: "First real programming course — where the whole path started.", image: null, links: [] } },
      { id: "1b", title: "Mapping the Soc. World", details: { description: "", image: null, links: [] } },
      { id: "1c", title: "Writing Seminar", details: { description: "", image: null, links: [] } },
      { id: "1d", title: "Principles of Chemistry", details: { description: "", image: null, links: [] } },
    ],
  },
  {
    id: "y1-spring", year: "2023", term: "Spring", title: "Freshman Year — Spring", category: "course",
    branches: [
      { id: "2a", title: "Data Structures & Math", details: { description: "", image: null, links: [] } },
      { id: "2b", title: "Calc III", details: { description: "", image: null, links: [] } },
      { id: "2c", title: "Intro to Microeconomics", details: { description: "", image: null, links: [] } },
      { id: "2d", title: "Writing Seminar", details: { description: "", image: null, links: [] } },
      { id: "2e", title: "Sociological Research", details: { description: "", image: null, links: [] } },
    ],
  },
  {
    id: "ex-volunteer", year: "2023", term: "Summer", title: "(example — edit me) Weekend tutoring at the library", category: "volunteer",
    details: {
      description: "Swap this out for something real. Volunteer entries are a good place for ongoing, low-drama contributions that don't fit neatly under a project or a course.",
      image: null,
      links: [],
    },
  },
  {
    id: "y2-fall", year: "2023", term: "Fall", title: "Sophomore Year — Fall", category: "course",
    branches: [
      { id: "5a", title: "Class Study of Piano", details: { description: "", image: null, links: [] } },
      { id: "5b", title: "Software Design", details: { description: "", image: null, links: [] } },
      { id: "5c", title: "Linear Algebra", details: { description: "", image: null, links: [] } },
      { id: "5d", title: "Intro to Macroeconomics", details: { description: "", image: null, links: [] } },
      { id: "5e", title: "Sociological Perspectives", details: { description: "", image: null, links: [] } },
      { id: "5f", title: "Self-Paced Fitness", details: { description: "", image: null, links: [] } },
    ],
  },
  {
    id: "ex-project", year: "2023", term: "Winter break", title: "(example — edit me) Built a campus events app", category: "project",
    details: {
      description: "A short paragraph on what the project is, why you built it, and what you learned.\n\nSecond paragraph for stack details, screenshots, or a demo link below.",
      image: null,
      links: [{ label: "View on GitHub", url: "https://github.com" }],
    },
  },
  {
    id: "y2-spring", year: "2024", term: "Spring", title: "Sophomore Year — Spring", category: "course",
    branches: [
      { id: "4a", title: "Algorithms", details: { description: "", image: null, links: [] } },
      { id: "4b", title: "Intro Physics II", details: { description: "", image: null, links: [] } },
      { id: "4c", title: "Stats for Social Science", details: { description: "", image: null, links: [] } },
      { id: "4d", title: "Leisure & Fun in MidEast", details: { description: "", image: null, links: [] } },
      { id: "4e", title: "IdeaLab Special Topics", details: { description: "", image: null, links: [] } },
    ],
  },
  {
    id: "y3-t1", year: "2024", term: "Term 1", title: "Junior Year — 1st Term", category: "course",
    branches: [
      { id: "3a", title: "Intro to Engineering", details: { description: "", image: null, links: [] } },
      { id: "3b", title: "Discrete and Probabilistic Systems", details: { description: "", image: null, links: [] } },
      { id: "3c", title: "Urban Applications of GIS", details: { description: "", image: null, links: [] } },
    ],
  },
  {
    id: "ex-leadership", year: "2024", term: "Fall", title: "(example — edit me) Elected treasurer, robotics club", category: "leadership",
    details: {
      description: "What the role involved, roughly how long you held it, and one concrete thing you changed or improved.",
      image: null,
      links: [],
    },
  },
  {
    id: "y3-t2", year: "2025", term: "Term 2", title: "Junior Year — 2nd Term", category: "course",
    branches: [
      { id: "2aa", title: "Systems", details: { description: "", image: null, links: [] } },
      { id: "2bb", title: "Embedded Systems", details: { description: "Mucho gusto", image: null, links: [] } },
      { id: "2cc", title: "AR/VR Development", details: { description: "", image: null, links: [] } },
    ],
  },
  {
    id: "y3-t3", year: "2025", term: "Term 3", title: "Junior Year — 3rd Term", category: "course",
    branches: [
      { id: "1aa", title: "Distributed Systems and Fields", details: { description: "", image: null, links: [] } },
      { id: "1bb", title: "Machine Learning", details: { description: "", image: null, links: [] } },
      { id: "1cc", title: "Digital Electronics", details: { description: "", image: null, links: [] } },
    ],
  },
  {
    id: "ex-achievement", year: "2025", term: "Summer", title: "(example — edit me) 1st place, university hackathon", category: "achievement",
    details: {
      description: "Name the event, your team, what you shipped in the time given, and why it placed.",
      image: null,
      links: [{ label: "Devpost entry", url: "https://devpost.com" }],
    },
  },
  {
    id: "y4-fall", year: "2025", term: "Fall", title: "Senior Year — Fall", category: "course",
    branches: [
      { id: "1a2", title: "Programming Langs", details: { description: "", image: null, links: [] } },
      { id: "1b2", title: "Cybersecurity", details: { description: "", image: null, links: [] } },
      { id: "1c2", title: "Intro to Computer Org", details: { description: "", image: null, links: [] } },
      { id: "1d2", title: "CS Tools Bootcamp", details: { description: "", image: null, links: [] } },
      { id: "1e2", title: "PM Seminar", details: { description: "", image: null, links: [] } },
      { id: "1f2", title: "PM Experience", details: { description: "", image: null, links: [] } },
      { id: "1g2", title: "Political Sociology", details: { description: "", image: null, links: [] } },
    ],
  },
  {
    id: "y4-spring", year: "2026", term: "Spring", title: "Senior Year — Spring", category: "course",
    branches: [
      { id: "1a3", title: "Comp & Complexity", details: { description: "", image: null, links: [] } },
      { id: "1b3", title: "Artificial Intelligence", details: { description: "", image: null, links: [] } },
      { id: "1c3", title: "Imm & US Color Lines", details: { description: "", image: null, links: [] } },
      { id: "1d3", title: "Elementary Spanish I", details: { description: "", image: null, links: [] } },
    ],
  },
  {
    id: "ex-goal", year: "2026", term: "After graduation", title: "(example — edit me) Land a role in software engineering", category: "goal",
    details: {
      description: "Goal entries are a nice way to close the trail out — where you're headed next, even if it isn't a finished chapter yet.",
      image: null,
      links: [],
    },
  },
];

/**
 * Creates the entry with a fixed ID if it doesn't exist, otherwise updates
 * it in place (using the current version, as CMA requires for PUT).
 */
async function upsertEntry(contentTypeKey, entryId, fields) {
  let version = null;
  try {
    const { data } = await withRetry(() => client.get(`/entries/${entryId}`));
    version = data.sys.version;
  } catch (err) {
    if (err.response?.status !== 404) throw err;
  }

  const headers = version
    ? { "X-Contentful-Version": version }
    : { "X-Contentful-Content-Type": CONTENT_TYPES[contentTypeKey] };

  const { data } = await withRetry(() =>
    client.put(`/entries/${entryId}`, { fields }, { headers })
  );
  await sleep(REQUEST_PACING_MS);
  return data;
}

async function publishEntry(entryId) {
  const { data: entry } = await withRetry(() => client.get(`/entries/${entryId}`));
  const { data } = await withRetry(() =>
    client.put(`/entries/${entryId}/published`, null, {
      headers: { "X-Contentful-Version": entry.sys.version },
    })
  );
  await sleep(REQUEST_PACING_MS);
  return data;
}

function ref(entryId) {
  return { sys: { type: "Link", linkType: "Entry", id: entryId } };
}

/** Creates (draft only, no publish) a Link entry, returns a reference to it. */
async function createLink(entryId, link) {
  const fields = {
    label: { [LOCALE]: link.label ?? "" },
    url: { [LOCALE]: link.url ?? "" },
  };
  try {
    await upsertEntry("link", entryId, fields);
  } catch (err) {
    throw new Error(
      `Link entry "${entryId}" failed to create: ${err.response?.status} ${JSON.stringify(err.response?.data)}`
    );
  }
  return ref(entryId);
}

/**
 * Creates (draft only) a Branch entry and its nested Link entries, as a
 * standalone entry. Does NOT attach it to any Milestone — that linking
 * step is skipped for now, so you can hook it up by hand later.
 */
async function createBranchStandalone(milestoneId, branch) {
  const entryId = `branch-${milestoneId}-${branch.id}`;
  const branchLinks = branch.details?.links ?? [];

  const linkRefs = [];
  for (let i = 0; i < branchLinks.length; i++) {
    linkRefs.push(await createLink(`link-${entryId}-${i}`, branchLinks[i]));
  }

  const fields = {
    title: { [LOCALE]: branch.title ?? "" },
    description: { [LOCALE]: branch.details?.description ?? "" },
    links: { [LOCALE]: linkRefs },
  };

  try {
    await upsertEntry("branch", entryId, fields);
  } catch (err) {
    throw new Error(
      `Branch entry "${entryId}" failed to create: ${err.response?.status} ${JSON.stringify(err.response?.data)}`
    );
  }
  return entryId;
}

/**
 * Creates (draft only) a Milestone entry. Its own top-level `links`
 * field is populated, but the `branches` reference field is
 * intentionally left untouched — link milestones to their branches
 * manually in the Contentful UI once things are settled.
 */
async function createMilestone(milestone) {
  const topLevelLinks = milestone.details?.links ?? [];
  const linkRefs = [];
  for (let i = 0; i < topLevelLinks.length; i++) {
    linkRefs.push(await createLink(`link-${milestone.id}-${i}`, topLevelLinks[i]));
  }

  const fields = {
    id: { [LOCALE]: milestone.id },
    year: { [LOCALE]: milestone.year },
    title: { [LOCALE]: milestone.title },
    category: { [LOCALE]: milestone.category },
    description: { [LOCALE]: milestone.details?.description ?? "" },
    links: { [LOCALE]: linkRefs },
    // `branches` intentionally omitted — link these up manually later.
  };

  if (milestone.term) {
    fields.term = { [LOCALE]: milestone.term };
  }

  try {
    await upsertEntry("milestone", milestone.id, fields);
  } catch (err) {
    throw new Error(
      `Milestone entry "${milestone.id}" failed to create: ${err.response?.status} ${JSON.stringify(err.response?.data)}`
    );
  }
  return milestone.id;
}

async function main() {
  let createFailures = 0;
  const createdIds = [];

  console.log("=== PHASE 1: Creating all entries as drafts (no publish yet) ===\n");

  console.log("--- Milestones ---");
  for (const milestone of MILESTONES) {
    try {
      const id = await createMilestone(milestone);
      createdIds.push(id);
      console.log(`Created  milestone ${milestone.id}`);
    } catch (err) {
      createFailures += 1;
      console.error(`Failed   milestone ${milestone.id}:\n${err.message}`);
    }
  }

  console.log("\n--- Branches (and nested Links) ---");
  for (const milestone of MILESTONES) {
    for (const branch of milestone.branches ?? []) {
      const entryId = `branch-${milestone.id}-${branch.id}`;
      try {
        const id = await createBranchStandalone(milestone.id, branch);
        createdIds.push(id);
        console.log(`Created  ${entryId}`);
      } catch (err) {
        createFailures += 1;
        console.error(`Failed   ${entryId}:\n${err.message}`);
      }
    }
  }

  console.log(
    `\nPhase 1 done. ${createdIds.length} entries created as drafts, ${createFailures} failed to create.`
  );

  console.log("\n=== PHASE 2: Publishing every successfully-created entry ===\n");
  let publishFailures = 0;
  for (const entryId of createdIds) {
    try {
      await publishEntry(entryId);
      console.log(`Published ${entryId}`);
    } catch (err) {
      publishFailures += 1;
      console.error(
        `Failed to publish ${entryId} (still saved as draft): ${err.response?.status} ${JSON.stringify(err.response?.data)}`
      );
    }
  }

  console.log(
    `\nDone. ${createdIds.length - publishFailures}/${createdIds.length} entries published` +
      (publishFailures > 0 ? ` (${publishFailures} left as drafts — rerun this script to retry just publishing, it's safe to re-run).` : ".")
  );
  console.log("Reminder: Milestone.branches was NOT set — link branches to their milestones manually in Contentful.");
  if (createFailures > 0 || publishFailures > 0) process.exitCode = 1;
}

main();