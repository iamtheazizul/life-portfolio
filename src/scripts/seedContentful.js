import axios from "axios";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const SPACE_ID = process.env.VITE_CONTENTFUL_SPACE_ID;
const MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;

const BASE_URL = `https://api.contentful.com/spaces/${SPACE_ID}`;

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${MANAGEMENT_TOKEN}`,
    "Content-Type": "application/json",
    "X-Contentful-Content-Type": "Milestone",
  },
});

// Your existing milestones data
const MILESTONES = [
  {
    id: "y1-fall",
    year: "2022",
    term: "Fall",
    title: "Freshman Year — Fall",
    category: "course",
    description: "My first semester at university",
    image: null,
    links: [],
    branches: [
      {
        id: "1a",
        title: "Intro to Comp. Sci.",
        description: "First real programming course — where the whole path started.",
      },
      {
        id: "1b",
        title: "Mapping the Soc. World",
        description: "",
      },
      {
        id: "1c",
        title: "Writing Seminar",
        description: "",
      },
      {
        id: "1d",
        title: "Principles of Chemistry",
        description: "",
      },
    ],
  },
  {
    id: "y1-spring",
    year: "2023",
    term: "Spring",
    title: "Freshman Year — Spring",
    category: "course",
    description: "Continuing my first year",
    image: null,
    links: [],
    branches: [
      {
        id: "2a",
        title: "Data Structures & Math",
        description: "",
      },
      {
        id: "2b",
        title: "Calc III",
        description: "",
      },
      {
        id: "2c",
        title: "Intro to Microeconomics",
        description: "",
      },
      {
        id: "2d",
        title: "Writing Seminar",
        description: "",
      },
      {
        id: "2e",
        title: "Sociological Research",
        description: "",
      },
    ],
  },
  {
    id: "ex-volunteer",
    year: "2023",
    term: "Summer",
    title: "Weekend tutoring at the library",
    category: "volunteer",
    description:
      "Spent my summer helping local students with their studies",
    image: null,
    links: [],
    branches: [],
  },
  {
    id: "y2-fall",
    year: "2023",
    term: "Fall",
    title: "Sophomore Year — Fall",
    category: "course",
    description: "Moving into my second year",
    image: null,
    links: [],
    branches: [
      {
        id: "5a",
        title: "Class Study of Piano",
        description: "",
      },
      {
        id: "5b",
        title: "Software Design",
        description: "",
      },
      {
        id: "5c",
        title: "Linear Algebra",
        description: "",
      },
      {
        id: "5d",
        title: "Intro to Macroeconomics",
        description: "",
      },
      {
        id: "5e",
        title: "Sociological Perspectives",
        description: "",
      },
      {
        id: "5f",
        title: "Self-Paced Fitness",
        description: "",
      },
    ],
  },
  {
    id: "ex-project",
    year: "2023",
    term: "Winter break",
    title: "Built a campus events app",
    category: "project",
    description:
      "Created a full-stack web app to help students discover campus events. Built with React, Node.js, and MongoDB.",
    image: null,
    links: [{ label: "View on GitHub", url: "https://github.com" }],
    branches: [],
  },
  {
    id: "y2-spring",
    year: "2024",
    term: "Spring",
    title: "Sophomore Year — Spring",
    category: "course",
    description: "Finishing my second year strong",
    image: null,
    links: [],
    branches: [
      {
        id: "4a",
        title: "Algorithms",
        description: "",
      },
      {
        id: "4b",
        title: "Intro Physics II",
        description: "",
      },
      {
        id: "4c",
        title: "Stats for Social Science",
        description: "",
      },
      {
        id: "4d",
        title: "Leisure & Fun in MidEast",
        description: "",
      },
      {
        id: "4e",
        title: "IdeaLab Special Topics",
        description: "",
      },
    ],
  },
  {
    id: "y3-t1",
    year: "2024",
    term: "Term 1",
    title: "Junior Year — 1st Term",
    category: "course",
    description: "Beginning my junior year",
    image: null,
    links: [],
    branches: [
      {
        id: "3a",
        title: "Intro to Engineering",
        description: "",
      },
      {
        id: "3b",
        title: "Discrete and Probabilistic Systems",
        description: "",
      },
      {
        id: "3c",
        title: "Urban Applications of GIS",
        description: "",
      },
    ],
  },
  {
    id: "ex-leadership",
    year: "2024",
    term: "Fall",
    title: "Elected treasurer, robotics club",
    category: "leadership",
    description:
      "Led financial planning for the robotics club with a budget of $50k. Helped secure 3 corporate sponsors.",
    image: null,
    links: [],
    branches: [],
  },
  {
    id: "y3-t2",
    year: "2025",
    term: "Term 2",
    title: "Junior Year — 2nd Term",
    category: "course",
    description: "Continuing junior year",
    image: null,
    links: [],
    branches: [
      {
        id: "2aa",
        title: "Systems",
        description: "",
      },
      {
        id: "2bb",
        title: "Embedded Systems",
        description: "Working with IoT devices and microcontrollers",
      },
      {
        id: "2cc",
        title: "AR/VR Development",
        description: "",
      },
    ],
  },
  {
    id: "y3-t3",
    year: "2025",
    term: "Term 3",
    title: "Junior Year — 3rd Term",
    category: "course",
    description: "Final term of junior year",
    image: null,
    links: [],
    branches: [
      {
        id: "1aa",
        title: "Distributed Systems and Fields",
        description: "",
      },
      {
        id: "1bb",
        title: "Machine Learning",
        description: "",
      },
      {
        id: "1cc",
        title: "Digital Electronics",
        description: "",
      },
    ],
  },
  {
    id: "ex-achievement",
    year: "2025",
    term: "Summer",
    title: "1st place, university hackathon",
    category: "achievement",
    description:
      "Our team built an AI-powered study assistant that won first place at TechFest 2025. Presented to 500+ students.",
    image: null,
    links: [{ label: "Devpost entry", url: "https://devpost.com" }],
    branches: [],
  },
  {
    id: "y4-fall",
    year: "2025",
    term: "Fall",
    title: "Senior Year — Fall",
    category: "course",
    description: "Beginning my final year",
    image: null,
    links: [],
    branches: [
      {
        id: "1a2",
        title: "Programming Langs",
        description: "",
      },
      {
        id: "1b2",
        title: "Cybersecurity",
        description: "",
      },
      {
        id: "1c2",
        title: "Intro to Computer Org",
        description: "",
      },
      {
        id: "1d2",
        title: "CS Tools Bootcamp",
        description: "",
      },
      {
        id: "1e2",
        title: "PM Seminar",
        description: "",
      },
      {
        id: "1f2",
        title: "PM Experience",
        description: "",
      },
      {
        id: "1g2",
        title: "Political Sociology",
        description: "",
      },
    ],
  },
  {
    id: "y4-spring",
    year: "2026",
    term: "Spring",
    title: "Senior Year — Spring",
    category: "course",
    description: "Final semester",
    image: null,
    links: [],
    branches: [
      {
        id: "1a3",
        title: "Comp & Complexity",
        description: "",
      },
      {
        id: "1b3",
        title: "Artificial Intelligence",
        description: "",
      },
      {
        id: "1c3",
        title: "Imm & US Color Lines",
        description: "",
      },
      {
        id: "1d3",
        title: "Elementary Spanish I",
        description: "",
      },
    ],
  },
  {
    id: "ex-goal",
    year: "2026",
    term: "After graduation",
    title: "Land a role in software engineering",
    category: "goal",
    description:
      "Seeking a position at a tech company where I can build impactful products.",
    image: null,
    links: [],
    branches: [],
  },
];

// Transform milestone to Contentful entry format
function transformToContentful(milestone) {
  return {
    fields: {
      id: {
        "en-US": milestone.id,
      },
      year: {
        "en-US": milestone.year,
      },
      term: {
        "en-US": milestone.term || "",
      },
      title: {
        "en-US": milestone.title,
      },
      category: {
        "en-US": milestone.category,
      },
      description: {
        "en-US": milestone.description || "",
      },
      links: {
        "en-US": milestone.links || [],
      },
      branches: {
        "en-US": milestone.branches || [],
      },
    },
  };
}

async function seedContentful() {
  try {
    console.log(`🌱 Starting to seed ${MILESTONES.length} milestones to Contentful...`);
    console.log(`Space ID: ${SPACE_ID}\n`);

    for (const milestone of MILESTONES) {
      try {
        const response = await client.post("/entries", transformToContentful(milestone), {
          headers: {
            "X-Contentful-Content-Type": "milestone",
          },
        });

        const entryId = response.data.sys.id;
        console.log(`✅ Created: ${milestone.title} (ID: ${entryId})`);

        // Publish the entry
        await client.put(`/entries/${entryId}/published`, {}, {
          headers: {
            "X-Contentful-Version": response.data.sys.version,
          },
        });

        console.log(`   📤 Published: ${milestone.title}\n`);
      } catch (error) {
        if (error.response?.status === 409) {
          console.warn(`⚠️  Already exists: ${milestone.title}\n`);
        } else {
          console.error(`❌ Error creating ${milestone.title}:`, error.response?.data?.message || error.message);
        }
      }
    }

    console.log("🎉 Seeding complete!");
  } catch (error) {
    console.error("Fatal error:", error.message);
    process.exit(1);
  }
}

seedContentful();