// src/Pages/MilestoneDetailPage.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchMilestones, fetchBranches } from '../lib/contentfulClient';
import { GraduationCap, Rocket, Trophy, X, ArrowLeft } from 'lucide-react';

const typeMeta = {
  course: { icon: GraduationCap, color: '#5B8CA6', label: 'Coursework' },
  project: { icon: Rocket, color: '#6E9C5C', label: 'Project' },
  achievement: { icon: Trophy, color: '#D99A3C', label: 'Achievement' },
};

// ---- MOCK DATA FOR TESTING -----------------------------------------
// Flip this to true to render the page with fake data instead of
// hitting Contentful at all. Useful for checking layout/styling while
// the seed/data pipeline is still being debugged. Set back to false
// (or delete this block) once real data is flowing.
const USE_MOCK_DATA = true;

const MOCK_MILESTONE = {
  id: 'mock-milestone-1',
  title: 'This Portfolio',
  year: '2025',
  type: 'project',
  description: "Learning React + Tailwind by building the very page you're looking at.",
  fullDescription:
    "I wanted to build a portfolio that reflected my journey, not just a list of projects. The timeline concept came from wanting to show growth over time. I used React for interactivity, Tailwind for styling, and Contentful for content management. It's a living document—I update it as I grow.",
  image: null,
};

const MOCK_RELATED_ITEMS = [
  {
    id: 'mock-branch-item-1',
    year: '2022',
    type: 'project',
    title: 'Recipe Sharing App',
    description: 'A weekend project to practice working with a public API.',
    fullDescription:
      'I spent a weekend learning how to work with the Spoonacular API. Built a simple app where you could search for recipes and save your favorites.',
    branchLabel: 'Side projects',
    branchSide: 'left',
  },
  {
    id: 'mock-branch-item-2',
    year: '2023',
    type: 'project',
    title: 'Note-Taking Chrome Extension',
    description: 'First time learning the browser extension APIs.',
    fullDescription:
      'Created a Chrome extension that lets you take quick notes while browsing. The tricky part was managing local storage across the background script and content scripts.',
    branchLabel: 'Side projects',
    branchSide: 'left',
  },
];

export default function MilestoneDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [milestone, setMilestone] = useState(null);
  const [relatedBranchItems, setRelatedBranchItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Mock path: skip Contentful entirely and render fake data.
    if (USE_MOCK_DATA) {
      setMilestone(MOCK_MILESTONE);
      setRelatedBranchItems(MOCK_RELATED_ITEMS);
      setLoading(false);
      setError(null);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);

        // Fetch all milestones and branches
        const [milestonesData, branchesData] = await Promise.all([
          fetchMilestones(),
          fetchBranches(),
        ]);

        // Find the milestone by ID
        const found = milestonesData.find((m) => m.id === id);

        if (!found) {
          setError('Milestone not found');
          setMilestone(null);
          return;
        }

        setMilestone(found);

        // Find any branches connected to this milestone
        const connectedBranches = branchesData.filter(
          (branch) => branch.fromId === id
        );

        // Extract all branch items
        const items = connectedBranches.flatMap((branch) =>
          branch.items.map((item) => ({
            ...item,
            branchLabel: branch.label,
            branchSide: branch.side,
          }))
        );

        setRelatedBranchItems(items);
      } catch (err) {
        console.error('Error loading milestone:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF6EC] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6E9C5C] mx-auto mb-4"></div>
          <p className="text-stone-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !milestone) {
    return (
      <div className="min-h-screen bg-[#FAF6EC] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🌱</div>
          <h2 className="text-2xl font-semibold text-stone-800 mb-2">
            Milestone not found
          </h2>
          <p className="text-stone-600 mb-6">
            {error || "The milestone you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#6E9C5C] hover:bg-[#5A8249] text-white rounded-lg font-semibold transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Timeline
          </button>
        </div>
      </div>
    );
  }

  const meta = typeMeta[milestone.type];
  const Icon = meta.icon;

  return (
    <div className="min-h-screen bg-[#FAF6EC]">
      {USE_MOCK_DATA && (
        <div className="bg-amber-100 border-b border-amber-300 text-amber-800 text-center text-xs font-semibold py-1.5">
          MOCK DATA MODE — set USE_MOCK_DATA to false in MilestoneDetailPage.jsx once Contentful is wired up
        </div>
      )}

      {/* Header with back button */}
      <div className="sticky top-0 z-40 bg-[#FAF6EC]/80 backdrop-blur-sm border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-4 py-2 text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors font-semibold"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <div className="text-sm text-stone-500 font-semibold">
            {milestone.year} · {meta.label}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero section */}
        <div className="mb-12">
          <div className="flex items-start gap-6 mb-8">
            <div
              className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-3xl"
              style={{ backgroundColor: meta.color }}
            >
              <Icon size={32} className="text-white" />
            </div>
            <div className="flex-1">
              <span
                className="inline-block text-xs font-semibold uppercase tracking-wide mb-2"
                style={{ color: meta.color }}
              >
                {milestone.year} · {meta.label}
              </span>
              <h1 className="font-display text-5xl font-semibold text-stone-800 leading-tight mb-4">
                {milestone.title}
              </h1>
              <p className="text-lg text-stone-600 leading-relaxed max-w-2xl">
                {milestone.description}
              </p>
            </div>
          </div>

          {/* Image */}
          {milestone.image && (
            <div className="rounded-2xl overflow-hidden shadow-lg mb-8">
              <img
                src={milestone.image}
                alt={milestone.title}
                className="w-full h-96 object-cover"
              />
            </div>
          )}

          {/* Full description */}
          {milestone.fullDescription && (
            <div className="bg-white rounded-2xl p-8 border border-stone-100 shadow-sm">
              <h2 className="font-display text-2xl font-semibold text-stone-800 mb-4">
                Full Story
              </h2>
              <p className="text-stone-700 leading-relaxed whitespace-pre-wrap">
                {milestone.fullDescription}
              </p>
            </div>
          )}
        </div>

        {/* Related branch items */}
        {relatedBranchItems.length > 0 && (
          <div className="mt-16 pt-16 border-t border-stone-200">
            <div className="mb-8">
              <h2 className="font-display text-3xl font-semibold text-stone-800 mb-2">
                Related to this milestone
              </h2>
              <p className="text-stone-600">
                These side projects and experiences happened alongside this milestone
              </p>
            </div>

            <div className="grid gap-6">
              {relatedBranchItems.map((item) => {
                const itemMeta = typeMeta[item.type];
                const ItemIcon = itemMeta.icon;

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl"
                        style={{ backgroundColor: itemMeta.color }}
                      >
                        <ItemIcon size={20} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className="text-xs font-semibold uppercase tracking-wide"
                            style={{ color: itemMeta.color }}
                          >
                            {item.year} · {itemMeta.label}
                          </span>
                          <span className="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded">
                            {item.branchLabel}
                          </span>
                        </div>
                        <h3 className="font-display text-lg font-semibold text-stone-800">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-stone-600 leading-relaxed">
                      {item.description}
                    </p>
                    {item.fullDescription && (
                      <p className="text-stone-700 mt-3 pt-3 border-t border-stone-100 text-sm">
                        {item.fullDescription}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CTA back to timeline */}
        <div className="mt-16 py-12 text-center border-t border-stone-200">
          <p className="text-stone-600 mb-6">Ready to see the full journey?</p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#6E9C5C] hover:bg-[#5A8249] text-white rounded-lg font-semibold transition-colors"
          >
            View Timeline
          </button>
        </div>
      </main>
    </div>
  );
}