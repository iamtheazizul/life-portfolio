// scripts/seed.js
import { createClient } from 'contentful-management';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Get __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env file directly as fallback
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value && !process.env[key]) {
      process.env[key] = value.trim();
    }
  });
}

// Log what we're getting
console.log('Debug - Environment variables loaded:');
console.log('VITE_CONTENTFUL_SPACE_ID:', process.env.VITE_CONTENTFUL_SPACE_ID ? '✓ loaded' : '✗ missing');
console.log('VITE_CONTENTFUL_MANAGEMENT_TOKEN:', process.env.VITE_CONTENTFUL_MANAGEMENT_TOKEN ? '✓ loaded' : '✗ missing');
console.log('');

const SPACE_ID = process.env.VITE_CONTENTFUL_SPACE_ID;
const MANAGEMENT_TOKEN = process.env.VITE_CONTENTFUL_MANAGEMENT_TOKEN;

const ENVIRONMENT_ID = 'master';

// ---- DATA -------------------------------------------------------
const milestonesData = [
  {
    title: 'Started High School',
    year: '2019',
    type: 'course',
    description: 'First lines of code in an intro CS elective — hooked immediately.',
    fullDescription: 'I remember walking into that computer lab for the first time. The teacher handed out a syllabus for Introduction to Computer Science, and something just clicked. I spent the first week writing simple Python scripts, and by the end of the semester, I had built a text-based adventure game. It wasn\'t pretty, but it was mine.',
    order: 1,
  },
  {
    title: 'Built My First Website',
    year: '2020',
    type: 'project',
    description: 'A janky HTML/CSS fan page. Broke it a hundred times, learned from every one.',
    fullDescription: 'My first website was a fan page dedicated to my favorite video game. It was pure HTML and CSS—no frameworks, no JavaScript. The layout was all floats and tables. It looked terrible on mobile, but I was so proud when I finally got it deployed to Netlify.',
    order: 2,
  },
  {
    title: 'Regional Science Fair — 2nd Place',
    year: '2021',
    type: 'achievement',
    description: 'A weather-prediction project using basic ML. My first taste of data.',
    fullDescription: 'I trained a simple neural network to predict rainfall patterns using historical weather data. It wasn\'t sophisticated by any means, but placing second at the regional fair felt huge at the time. That project sparked a real interest in how data could tell stories.',
    order: 3,
  },
  {
    title: 'AP Computer Science',
    year: '2022',
    type: 'course',
    description: 'Java, data structures, and the first time algorithms actually clicked.',
    fullDescription: 'This was the course that fundamentally changed how I think about programming. We spent months on data structures—linked lists, trees, graphs—and finally, algorithms just made sense. I realized that writing code is one thing, but understanding *why* a particular approach is faster is everything.',
    order: 4,
  },
  {
    title: 'Personal Budget Tracker App',
    year: '2022',
    type: 'project',
    description: 'React + local storage. First real app with actual state management.',
    fullDescription: 'After learning React basics, I decided to build something I could actually use. A budget tracker seemed perfect. I used React hooks for state management and localStorage to persist data. It had charts, categories, and a working export feature. This was the first app that felt "production-ready" to me.',
    order: 5,
  },
  {
    title: 'Hackathon Finalist',
    year: '2023',
    type: 'achievement',
    description: '48 hours, 3 teammates, way too much coffee, and a working demo.',
    fullDescription: 'Our team built a real-time collaboration tool for remote teams. We pitched our prototype on Sunday morning after pulling an all-nighter. We didn\'t win, but we made it to the finals, and more importantly, I learned how to work under pressure and communicate ideas quickly.',
    order: 6,
  },
  {
    title: 'University — Software Engineering',
    year: '2024',
    type: 'course',
    description: 'Started my degree, went deep on systems and web development.',
    fullDescription: 'University kicked everything up a notch. My software engineering course introduced me to design patterns, system architecture, and testing frameworks. I learned about SOLID principles, microservices, and how to think about scalability from day one.',
    order: 7,
  },
  {
    title: 'This Portfolio',
    year: '2025',
    type: 'project',
    description: 'Learning React + Tailwind by building the very page you\'re looking at.',
    fullDescription: 'I wanted to build a portfolio that reflected my journey, not just a list of projects. The timeline concept came from wanting to show growth over time. I used React for interactivity, Tailwind for styling, and Contentful for content management. It\'s a living document—I update it as I grow.',
    order: 8,
  },
];

const branchItemsData = [
  {
    title: 'Recipe Sharing App',
    year: '2022',
    type: 'project',
    description: 'A weekend project to practice working with a public API.',
    fullDescription: 'I spent a weekend learning how to work with the Spoonacular API. Built a simple app where you could search for recipes and save your favorites. It taught me a lot about API rate limiting and error handling.',
  },
  {
    title: 'Note-Taking Chrome Extension',
    year: '2023',
    type: 'project',
    description: 'First time learning the browser extension APIs.',
    fullDescription: 'Created a Chrome extension that lets you take quick notes while browsing. The tricky part was managing local storage across the background script and content scripts. This project really deepened my understanding of how browsers work.',
  },
  {
    title: 'Robotics Club Lead',
    year: '2024',
    type: 'achievement',
    description: 'Organized weekly builds and led a team of 6 to a regional competition.',
    fullDescription: 'I took over the robotics club and transformed it into something more structured. We met weekly, worked on autonomous systems, and competed at a regional level. Leadership taught me as much as engineering did.',
  },
  {
    title: 'Study Abroad — Systems Design',
    year: '2025',
    type: 'course',
    description: 'A semester in Berlin focused on distributed systems.',
    fullDescription: 'Spent a semester studying distributed systems in Berlin while interning at a tech startup. Learned about consensus algorithms, fault tolerance, and how real systems handle millions of users.',
  },
];

const branchesData = [
  {
    label: 'Side projects',
    side: 'left',
    linkedMilestoneOrder: 5,
    items: [0, 1],
  },
  {
    label: 'Beyond the classroom',
    side: 'right',
    linkedMilestoneOrder: 7,
    items: [2, 3],
  },
];

// ---- HELPER FUNCTIONS -----------------------------------------------
async function createOrUpdateContentType(environment, contentTypeName, fields) {
  try {
    const contentTypes = await environment.getContentTypes();
    let contentType = contentTypes.items.find((ct) => ct.name === contentTypeName);

    if (contentType) {
      console.log(`✓ Content type "${contentTypeName}" already exists`);
      return contentType;
    }

    contentType = await environment.createContentType({
      name: contentTypeName,
      fields,
    });

    await contentType.publish();
    console.log(`✓ Created content type "${contentTypeName}"`);
    return contentType;
  } catch (error) {
    console.error(`✗ Error with content type "${contentTypeName}":`, error.message);
    throw error;
  }
}

async function createMilestoneContentType(environment) {
  return createOrUpdateContentType(environment, 'milestone', [
    {
      id: 'title',
      name: 'Title',
      type: 'Symbol',
      required: true,
    },
    {
      id: 'year',
      name: 'Year',
      type: 'Symbol',
      required: true,
    },
    {
      id: 'type',
      name: 'Type',
      type: 'Symbol',
      validations: [{ in: ['course', 'project', 'achievement'] }],
      required: true,
    },
    {
      id: 'description',
      name: 'Description',
      type: 'Text',
      required: true,
    },
    {
      id: 'fullDescription',
      name: 'Full Description',
      type: 'Text',
    },
    {
      id: 'image',
      name: 'Image',
      type: 'Link',
      linkType: 'Asset',
    },
    {
      id: 'order',
      name: 'Order',
      type: 'Integer',
      required: true,
    },
  ]);
}

async function createBranchContentType(environment) {
  return createOrUpdateContentType(environment, 'branch', [
    {
      id: 'label',
      name: 'Label',
      type: 'Symbol',
      required: true,
    },
    {
      id: 'side',
      name: 'Side',
      type: 'Symbol',
      validations: [{ in: ['left', 'right'] }],
      required: true,
    },
    {
      id: 'linkedMilestone',
      name: 'Linked Milestone',
      type: 'Link',
      linkType: 'Entry',
      required: true,
    },
    {
      id: 'branchItems',
      name: 'Branch Items',
      type: 'Array',
      items: {
        type: 'Link',
        linkType: 'Entry',
      },
    },
  ]);
}

async function createMilestoneEntries(environment) {
  console.log('\n📍 Creating milestone entries...');
  const createdMilestones = [];

  for (const data of milestonesData) {
    try {
      const entry = await environment.createEntry('milestone', {
        fields: {
          title: { 'en-US': data.title },
          year: { 'en-US': data.year },
          type: { 'en-US': data.type },
          description: { 'en-US': data.description },
          fullDescription: { 'en-US': data.fullDescription },
          order: { 'en-US': data.order },
        },
      });

      await entry.publish();
      createdMilestones.push(entry);
      console.log(`  ✓ Created: "${data.title}"`);
    } catch (error) {
      console.error(`  ✗ Error creating "${data.title}":`, error.message);
    }
  }

  return createdMilestones;
}

async function createBranchItemEntries(environment) {
  console.log('\n🌿 Creating branch item entries...');
  const createdItems = [];

  for (const data of branchItemsData) {
    try {
      const entry = await environment.createEntry('milestone', {
        fields: {
          title: { 'en-US': data.title },
          year: { 'en-US': data.year },
          type: { 'en-US': data.type },
          description: { 'en-US': data.description },
          fullDescription: { 'en-US': data.fullDescription },
          order: { 'en-US': 0 },
        },
      });

      await entry.publish();
      createdItems.push(entry);
      console.log(`  ✓ Created: "${data.title}"`);
    } catch (error) {
      console.error(`  ✗ Error creating "${data.title}":`, error.message);
    }
  }

  return createdItems;
}

async function createBranchEntries(environment, milestones, branchItems) {
  console.log('\n🌳 Creating branch entries...');

  for (const branchData of branchesData) {
    try {
      const linkedMilestone = milestones.find(
        (m) => m.fields.order['en-US'] === branchData.linkedMilestoneOrder
      );

      if (!linkedMilestone) {
        console.error(
          `  ✗ Could not find milestone with order ${branchData.linkedMilestoneOrder}`
        );
        continue;
      }

      const items = branchData.items.map((idx) => branchItems[idx]);

      const entry = await environment.createEntry('branch', {
        fields: {
          label: { 'en-US': branchData.label },
          side: { 'en-US': branchData.side },
          linkedMilestone: {
            'en-US': {
              sys: {
                type: 'Link',
                linkType: 'Entry',
                id: linkedMilestone.sys.id,
              },
            },
          },
          branchItems: {
            'en-US': items.map((item) => ({
              sys: {
                type: 'Link',
                linkType: 'Entry',
                id: item.sys.id,
              },
            })),
          },
        },
      });

      await entry.publish();
      console.log(`  ✓ Created branch: "${branchData.label}"`);
    } catch (error) {
      console.error(
        `  ✗ Error creating branch "${branchData.label}":`,
        error.message
      );
    }
  }
}

// ---- MAIN SEED FUNCTION -----------------------------------------------
async function seedContentful() {
  try {
    console.log('🌱 Starting Contentful seed...\n');

    // Validate environment variables
    if (!SPACE_ID || !MANAGEMENT_TOKEN) {
      throw new Error(
        'Missing required environment variables. Check your .env file:\n' +
        '- VITE_CONTENTFUL_SPACE_ID\n' +
        '- VITE_CONTENTFUL_MANAGEMENT_TOKEN'
      );
    }

    // Create the client AFTER validating env vars
    // NOTE: `{ type: 'legacy' }` is required because recent versions of
    // contentful-management default createClient() to the new "plain"
    // client, which doesn't expose client.getSpaces()/space.getEnvironment()
    // etc. Passing 'legacy' restores the waterfall-style API this script uses.
    const client = createClient(
      {
        accessToken: MANAGEMENT_TOKEN,
      },
      { type: 'legacy' }
    );

    // Get space directly by ID (avoids getSpaces(), which requires
    // org-level list permission that space-scoped tokens often don't have)
    const space = await client.getSpace(SPACE_ID);

    console.log(`✓ Connected to space: ${space.name} (${SPACE_ID})`);

    const environment = await space.getEnvironment(ENVIRONMENT_ID);
    console.log(`✓ Connected to environment: ${ENVIRONMENT_ID}\n`);

    // Create content types
    console.log('📋 Setting up content types...');
    await createMilestoneContentType(environment);
    await createBranchContentType(environment);

    // Create entries
    const milestones = await createMilestoneEntries(environment);
    const branchItems = await createBranchItemEntries(environment);
    await createBranchEntries(environment, milestones, branchItems);

    console.log('\n✨ Seed completed successfully!');
    console.log(`   - ${milestones.length} milestones created`);
    console.log(`   - ${branchItems.length} branch items created`);
    console.log(`   - ${branchesData.length} branches created`);
  } catch (error) {
    console.error('\n❌ Seed failed:', error.message);
    process.exit(1);
  }
}

// Run the seed
seedContentful();