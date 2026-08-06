const SPACE_ID = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
const ACCESS_TOKEN = import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN;

const BASE_URL = `https://cdn.contentful.com/spaces/${SPACE_ID}/entries`;

export async function fetchMilestones() {
  try {
    const response = await fetch(
      `${BASE_URL}?access_token=${ACCESS_TOKEN}&content_type=milestone&order=fields.year,fields.term`
    );

    if (!response.ok) {
      throw new Error(`Contentful API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Transform Contentful data to EXACTLY match original structure
    const transformed = data.items.map((item) => {
      const fields = item.fields;

      // Ensure branches match original format exactly
      const branches = Array.isArray(fields.branches) 
        ? fields.branches.map((b) => ({
            id: b.id || "",
            title: b.title || "",
            details: {
              description: b.description || "",
              image: null,
              links: [],
            },
          }))
        : [];

      // Ensure links match original format
      const links = Array.isArray(fields.links)
        ? fields.links.map((l) => ({
            label: typeof l === "string" ? l : l.label || "",
            url: typeof l === "string" ? l : l.url || "",
          }))
        : [];

      return {
        id: fields.id || item.sys.id,
        year: fields.year || "",
        term: fields.term || undefined,
        title: fields.title || "",
        category: fields.category || "learning",
        description: fields.description || "",
        image: fields.image?.fields?.file?.url 
          ? `https:${fields.image.fields.file.url}` 
          : null,
        links: links,
        branches: branches,
        details: {
          description: fields.description || "",
          image: fields.image?.fields?.file?.url 
            ? `https:${fields.image.fields.file.url}` 
            : null,
          links: links,
        },
      };
    });

    console.log("✅ Transformed milestones:", transformed);
    return transformed;
  } catch (error) {
    console.error("❌ Error fetching milestones:", error);
    return [];
  }
}