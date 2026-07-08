// lib/contentfulClient.js
import { createClient } from "contentful";

const client = createClient({
  space: import.meta.env.VITE_CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN,
});

export const fetchMilestones = async () => {
  try {
    const response = await client.getEntries({
      content_type: "milestone",
      order: "fields.order",
    });

    return response.items.map((item) => ({
      id: item.sys.id,
      title: item.fields.title,
      year: item.fields.year,
      type: item.fields.type,
      description: item.fields.description,
      fullDescription: item.fields.fullDescription || null,
      image: item.fields.image?.fields?.file?.url || null,
      order: item.fields.order,
    }));
  } catch (error) {
    console.error("Error fetching milestones:", error);
    return [];
  }
};

export const fetchBranches = async () => {
  try {
    const response = await client.getEntries({
      content_type: "branch",
    });

    return response.items.map((item) => ({
      id: item.sys.id,
      label: item.fields.label,
      side: item.fields.side,
      fromId: item.fields.linkedMilestone?.sys.id,
      items: (item.fields.branchItems || []).map((branchItem) => ({
        id: branchItem.sys.id,
        title: branchItem.fields.title,
        year: branchItem.fields.year,
        type: branchItem.fields.type,
        description: branchItem.fields.description,
        fullDescription: branchItem.fields.fullDescription || null,
        image: branchItem.fields.image?.fields?.file?.url || null,
      })),
    }));
  } catch (error) {
    console.error("Error fetching branches:", error);
    return [];
  }
};