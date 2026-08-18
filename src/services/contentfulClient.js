const SPACE_ID = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
const ACCESS_TOKEN = import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN;

// Content type ID for the singleton "Journey Order" entry. Check the
// actual ID via "Copy ID" on the content type in Contentful if this
// doesn't match (it auto-generates from the name you gave it).
const ORDER_CONTENT_TYPE = "journeyOrder";

const BASE_URL = `https://cdn.contentful.com/spaces/${SPACE_ID}/entries`;

function buildEntryMap(includes) {
  const map = new Map();
  (includes?.Entry ?? []).forEach((e) => map.set(e.sys.id, e));
  return map;
}

function buildAssetMap(includes) {
  const map = new Map();
  (includes?.Asset ?? []).forEach((a) => map.set(a.sys.id, a));
  return map;
}

function resolveImage(imageLink, assetMap) {
  if (!imageLink?.sys?.id) return null;
  const asset = assetMap.get(imageLink.sys.id);
  const url = asset?.fields?.file?.url;
  return url ? `https:${url}` : null;
}

function resolveLink(linkEntry) {
  if (!linkEntry) return null;
  const f = linkEntry.fields;
  return { label: f.label || "", url: f.url || "" };
}

function resolveBranch(branchEntry, entryMap, assetMap) {
  if (!branchEntry) return null;
  const f = branchEntry.fields;
  const links = Array.isArray(f.links)
    ? f.links
        .map((ref) => resolveLink(entryMap.get(ref.sys.id)))
        .filter(Boolean)
    : [];

  return {
    id: branchEntry.sys.id,
    title: f.title || "",
    details: {
      description: f.description || "",
      image: resolveImage(f.image, assetMap),
      links,
    },
  };
}

function resolveMilestone(milestoneEntry, entryMap, assetMap) {
  if (!milestoneEntry) return null;
  const fields = milestoneEntry.fields;

  const branches = Array.isArray(fields.branches)
    ? fields.branches
        .map((ref) => resolveBranch(entryMap.get(ref.sys.id), entryMap, assetMap))
        .filter(Boolean)
    : [];

  const links = Array.isArray(fields.links)
    ? fields.links
        .map((ref) => resolveLink(entryMap.get(ref.sys.id)))
        .filter(Boolean)
    : [];

  const image = resolveImage(fields.image, assetMap);

  return {
    id: fields.id || milestoneEntry.sys.id,
    year: fields.year || "",
    term: fields.term || undefined,
    title: fields.title || "",
    category: fields.category || "learning",
    description: fields.description || "",
    image,
    links,
    branches,
    details: { description: fields.description || "", image, links },
  };
}

export async function fetchMilestones() {
  try {
    // include=3 so we pull in, in one request:
    //   Journey Order -> Milestone (1) -> Branch (2) -> Link (3)
    // (Milestone's own top-level `links` also resolve within this depth.)
    const response = await fetch(
      `${BASE_URL}?access_token=${ACCESS_TOKEN}&content_type=${ORDER_CONTENT_TYPE}&limit=1&include=3`
    );

    if (!response.ok) {
      throw new Error(`Contentful API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const orderEntry = data.items?.[0];

    if (!orderEntry) {
      console.warn(
        `⚠️ No "${ORDER_CONTENT_TYPE}" entry found — create and publish the Journey Order singleton entry in Contentful.`
      );
      return [];
    }

    const entryMap = buildEntryMap(data.includes);
    const assetMap = buildAssetMap(data.includes);
    const orderedRefs = Array.isArray(orderEntry.fields.milestones)
      ? orderEntry.fields.milestones
      : [];

    return orderedRefs
      .map((ref) => resolveMilestone(entryMap.get(ref.sys.id), entryMap, assetMap))
      .filter(Boolean);
  } catch (error) {
    console.error("❌ Error fetching milestones:", error);
    return [];
  }
}