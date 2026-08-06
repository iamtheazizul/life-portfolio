import { useState, useEffect, useRef, useLayoutEffect, useCallback, useMemo } from "react";
import { X, ExternalLink, MapPin } from "lucide-react";

/* ============================================================================
   MILESTONE DATA
   ----------------------------------------------------------------------------
   This is the ONLY place you should need to edit to add/change your journey.
   Each entry is one waypoint on the trail. Two shapes are supported:

   1) A "bundle" waypoint (e.g. a semester) that groups several small items
      (courses). Expanding it opens a wide drawer below the whole row with
      the courses in a grid, each opening its own card:

      {
        id: "unique-id",
        year: "2022",
        term: "Fall",                 // small sub-label, optional
        title: "Freshman Year — Fall",
        category: "course",           // see CATEGORY_META below for options
        branches: [
          { id: "b1", title: "Intro to Computer Science",
            details: { description: "...", image: null, links: [] } },
          ...
        ],
      }

   2) A standalone waypoint that pops the rich card straight away:

      {
        id: "unique-id",
        year: "2023",
        term: "Summer",
        title: "Built a weather app",
        category: "project",
        details: {
          description: "Paragraph one.\n\nParagraph two.",
          image: "https://...jpg",   // or null
          links: [{ label: "GitHub repo", url: "https://..." }],
        },
      }

   Order this array chronologically — the trail is walked in the order items
   appear here, snaking left-to-right then right-to-left, row by row.
============================================================================ */

const CATEGORY_META = {
  project:       { emoji: "💻", label: "Project",       color: "#3F7A6E" },
  course:        { emoji: "🎓", label: "Course",        color: "#3B6EA5" },
  work:          { emoji: "💼", label: "Work",          color: "#8A5A2E" },
  research:      { emoji: "🔬", label: "Research",      color: "#5C5CA8" },
  club:          { emoji: "🏛", label: "Club",          color: "#A15C86" },
  leadership:    { emoji: "👥", label: "Leadership",    color: "#B5562E" },
  volunteer:     { emoji: "🤝", label: "Volunteer",     color: "#5B7A5E" },
  achievement:   { emoji: "🏆", label: "Achievement",   color: "#C9A24B" },
  certification: { emoji: "📜", label: "Certification", color: "#6E7E8C" },
  experience:    { emoji: "🌍", label: "Experience",    color: "#2E8A8A" },
  learning:      { emoji: "📚", label: "Learning",      color: "#6E5A96" },
  reflection:    { emoji: "💡", label: "Reflection",    color: "#A8763C" },
  memory:        { emoji: "📸", label: "Memory",        color: "#B0567E" },
  goal:          { emoji: "🎯", label: "Goal",          color: "#B5432E" },
  personal:      { emoji: "❤️", label: "Personal",      color: "#7A4A6E" },
};

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

/* ---------------------------------------------------------------------- */

function loadFonts() {
  if (document.getElementById("journey-fonts")) return;
  const link = document.createElement("link");
  link.id = "journey-fonts";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,500;9..144,600;9..144,700&family=Work+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap";
  document.head.appendChild(link);
}

// Catmull-Rom -> cubic bezier, so the trail curves smoothly through every waypoint,
// including the turns at the end of each row.
function smoothPath(points) {
  if (points.length < 2) return "";
  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`;
  }
  return d;
}

// how many columns per row, based on available width (capped at 5)
function colsForWidth(w) {
  if (w < 560) return 2;
  if (w < 800) return 3;
  if (w < 1040) return 4;
  return 5;
}

const DOT_SIZE = 42;
const ROW_CARD_ZONE = 150; // fixed space reserved for dot + card
const ROW_GAP = 64; // breathing room between rows when nothing is expanded
const DRAWER_GAP = 20; // extra gap added around an open drawer

function useContainerWidth() {
  const ref = useRef(null);
  const [width, setWidth] = useState(1050);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const measure = () => setWidth(ref.current.offsetWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, width];
}

function useInView() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

// Smoothly eases an array of {x,y} points toward new target positions whenever
// the target changes (e.g. a row grows taller because a drawer opened),
// instead of snapping. Both the waypoint dots and the connecting trail read
// from this, so they move in lockstep.
function useAnimatedPoints(target) {
  const [current, setCurrent] = useState(target);
  const fromRef = useRef(target);
  const startRef = useRef(null);
  const frameRef = useRef();
  const key = target.map((p) => `${Math.round(p.x)},${Math.round(p.y)}`).join("|");

  useEffect(() => {
    fromRef.current = current;
    startRef.current = null;
    const DURATION = 420;
    const step = (now) => {
      if (startRef.current === null) startRef.current = now;
      const t = Math.min(1, (now - startRef.current) / DURATION);
      const eased = 1 - Math.pow(1 - t, 3);
      setCurrent(target.map((p, i) => {
        const f = fromRef.current[i] || p;
        return { x: f.x + (p.x - f.x) * eased, y: f.y + (p.y - f.y) * eased };
      }));
      if (t < 1) frameRef.current = requestAnimationFrame(step);
    };
    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return current;
}

/* ---------------------------------------------------------------------- */

function Legend({ active, onToggle }) {
  return (
    <div className="sticky top-0 z-30 backdrop-blur-sm" style={{ background: "rgba(237,230,210,0.9)", borderBottom: "1px solid rgba(35,43,56,0.12)" }}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar">
        {Object.entries(CATEGORY_META).map(([key, meta]) => {
          const isActive = active === key;
          const isDimmed = active !== null && !isActive;
          return (
            <button
              key={key}
              onClick={() => onToggle(isActive ? null : key)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap transition-all duration-200 shrink-0"
              style={{
                fontFamily: "'Work Sans', sans-serif",
                fontSize: "12.5px",
                fontWeight: 600,
                color: isActive ? "#fff" : "#232B38",
                background: isActive ? meta.color : "rgba(35,43,56,0.06)",
                opacity: isDimmed ? 0.45 : 1,
                border: `1px solid ${isActive ? meta.color : "rgba(35,43,56,0.14)"}`,
              }}
            >
              <span>{meta.emoji}</span>
              {meta.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MilestoneNode({ milestone, pos, colWidth, expanded, onToggleExpand, onOpenDetails }) {
  const meta = CATEGORY_META[milestone.category];
  const hasBranches = !!milestone.branches?.length;
  const [ref, inView] = useInView();
  const cardWidth = Math.min(colWidth - 22, 188);

  const handleClick = () =>
    hasBranches ? onToggleExpand(milestone.id) : onOpenDetails({ title: milestone.title, ...milestone.details }, meta.color);

  return (
    <div
      ref={ref}
      className="absolute flex flex-col items-center"
      style={{
        top: pos.y,
        left: pos.x,
        transform: `translateX(-50%) scale(${inView ? 1 : 0.85})`,
        opacity: inView ? 1 : 0,
        transition: "opacity 0.55s ease, transform 0.4s ease",
      }}
    >
      <button
        onClick={handleClick}
        className="relative z-10 flex items-center justify-center rounded-full shadow-md transition-transform hover:scale-110 shrink-0"
        style={{
          width: DOT_SIZE, height: DOT_SIZE, background: meta.color, border: "3px solid #EDE6D2",
          boxShadow: expanded ? `0 0 0 4px ${meta.color}33` : undefined,
        }}
        title={milestone.title}
      >
        <span style={{ fontSize: 17 }}>{meta.emoji}</span>
      </button>

      <div className="mt-2.5" style={{ width: cardWidth }}>
        <div
          onClick={handleClick}
          className="rounded-xl px-3 py-2.5 shadow-sm cursor-pointer text-center transition-transform hover:-translate-y-0.5"
          style={{ background: "#FBF8EF", border: `1px solid ${expanded ? meta.color + "66" : "rgba(35,43,56,0.10)"}` }}
        >
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10.5px", color: meta.color, fontWeight: 500 }}>
            {milestone.year}
            {milestone.term && <span style={{ opacity: 0.65 }}> · {milestone.term}</span>}
          </div>
          <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: "14.5px", color: "#232B38", marginTop: 3, lineHeight: 1.25 }}>
            {milestone.title}
          </div>
          {hasBranches && (
            <div style={{ fontFamily: "'Work Sans', sans-serif", fontSize: "10.5px", color: "#8B93A0", marginTop: 4 }}>
              {expanded ? "tap to close ▲" : `${milestone.branches.length} courses ▾`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Full-width drawer for a row: opens beneath ALL cards in that row (not just
// under one), so course chips can wrap into a wide grid using the space that
// would otherwise sit empty beside shorter columns.
function RowDrawer({ rowIndex, items, top, width, onOpenDetails, onMeasure }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(t);
  }, []);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const report = () => onMeasure(rowIndex, el.offsetHeight);
    report();
    const ro = new ResizeObserver(report);
    ro.observe(el);
    return () => ro.disconnect();
  }, [rowIndex, onMeasure, items.length]);

  const drawerWidth = Math.min(width - 32, 30 + items.length * 260, 980);

  return (
    <>
      {items.map((m) => (
        <div
          key={`tick-${m.id}`}
          className="absolute"
          style={{ left: m.dotX, top: top - DRAWER_GAP + 2, width: 2, height: DRAWER_GAP - 2, background: `${CATEGORY_META[m.category].color}88`, transform: "translateX(-50%)" }}
        />
      ))}
      <div
        ref={ref}
        className="absolute left-1/2"
        style={{
          top,
          transform: `translateX(-50%) translateY(${shown ? 0 : -6}px)`,
          width: drawerWidth,
          opacity: shown ? 1 : 0,
          transition: "opacity 0.3s ease, transform 0.3s ease",
        }}
      >
        <div className="rounded-2xl p-4 shadow-sm" style={{ background: "#FBF8EF", border: "1px solid rgba(35,43,56,0.10)" }}>
          {items.map((m, idx) => {
            const meta = CATEGORY_META[m.category];
            return (
              <div key={m.id} style={{ marginTop: idx > 0 ? 14 : 0, paddingTop: idx > 0 ? 14 : 0, borderTop: idx > 0 ? "1px dashed rgba(35,43,56,0.14)" : "none" }}>
                <div className="flex items-center gap-1.5" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: meta.color, fontWeight: 600 }}>
                  <span>{meta.emoji}</span>
                  {m.title}
                </div>
                <div className="grid gap-2 mt-2.5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))" }}>
                  {m.branches.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => onOpenDetails({ title: b.title, ...b.details }, meta.color)}
                      className="px-2.5 py-1.5 rounded-md text-left transition-colors hover:brightness-95"
                      style={{
                        fontFamily: "'Work Sans', sans-serif", fontSize: "12.5px", fontWeight: 500, color: "#232B38",
                        background: "rgba(35,43,56,0.04)", borderLeft: `3px solid ${meta.color}`,
                      }}
                    >
                      {b.title}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function DetailModal({ item, color, onClose }) {
  useEffect(() => {
    if (!item) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(35,43,56,0.55)" }} onClick={onClose}>
      <div
        className="relative w-full overflow-hidden rounded-2xl shadow-2xl"
        style={{ maxWidth: 480, maxHeight: "88vh", overflowY: "auto", background: "#FBF8EF" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="absolute flex items-center justify-center rounded-full"
          style={{
            top: 18, right: 18, width: 46, height: 46, border: `2px dashed ${color}`, color,
            fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, zIndex: 2, background: "rgba(251,248,239,0.9)",
          }}
        >
          ✓ visited
        </div>

        <button onClick={onClose} className="absolute z-20 rounded-full p-1.5 transition-colors" style={{ top: 18, left: 18, background: "rgba(35,43,56,0.08)" }}>
          <X size={16} color="#232B38" />
        </button>

        {item.image ? (
          <img src={item.image} alt={item.title} className="w-full object-cover" style={{ height: 200 }} />
        ) : (
          <div className="w-full flex items-center justify-center" style={{ height: 130, background: `linear-gradient(135deg, ${color}22, ${color}0a)`, borderBottom: `1px solid ${color}33` }}>
            <span style={{ fontSize: 34, opacity: 0.55 }}>🗺️</span>
          </div>
        )}

        <div className="px-7 py-6">
          <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "24px", color: "#232B38", lineHeight: 1.2, paddingRight: item.image ? 0 : 56 }}>
            {item.title}
          </div>

          {item.description ? (
            <div style={{ fontFamily: "'Work Sans', sans-serif", fontSize: "14.5px", color: "#454F5C", marginTop: 14, lineHeight: 1.65 }}>
              {item.description.split("\n").filter(Boolean).map((para, i) => (
                <p key={i} style={{ marginTop: i === 0 ? 0 : 10 }}>{para}</p>
              ))}
            </div>
          ) : (
            <div style={{ fontFamily: "'Work Sans', sans-serif", fontSize: "13.5px", color: "#8B93A0", marginTop: 14, fontStyle: "italic" }}>
              No notes added yet — fill in the `description` field for this entry.
            </div>
          )}

          {item.links?.length > 0 && (
            <div className="flex flex-col gap-2 mt-5">
              {item.links.map((l, i) => (
                <a key={i} href={l.url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 transition-colors" style={{ fontFamily: "'Work Sans', sans-serif", fontSize: "13.5px", fontWeight: 600, color }}>
                  <ExternalLink size={13} /> {l.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */

export default function JourneyMap() {
  useEffect(loadFonts, []);

  const [containerRef, width] = useContainerWidth();
  const [expanded, setExpanded] = useState({});
  const [drawerHeights, setDrawerHeights] = useState({});
  const [selected, setSelected] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [progress, setProgress] = useState(0);
  const trailRef = useRef(null);

  const cols = colsForWidth(width);
  const colWidth = width / cols;
  const rows = Math.ceil(MILESTONES.length / cols);

  const onMeasureDrawer = useCallback((rowIndex, height) => {
    setDrawerHeights((prev) => (prev[rowIndex] === height ? prev : { ...prev, [rowIndex]: height }));
  }, []);

  // group milestones by row + column, expanded (bundle) items in a row share one drawer
  const rowInfo = useMemo(() => {
    const info = [];
    for (let r = 0; r < rows; r++) {
      const items = [];
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        const m = MILESTONES[i];
        if (!m) continue;
        const reversed = r % 2 === 1;
        const col = reversed ? cols - 1 - c : c;
        items.push({ m, index: i, dotX: colWidth * (col + 0.5) });
      }
      info.push(items);
    }
    return info;
  }, [rows, cols, colWidth]);

  const expandedByRow = useMemo(
    () => rowInfo.map((items) => items.filter(({ m }) => m.branches?.length && expanded[m.id]).map(({ m, dotX }) => ({ ...m, dotX }))),
    [rowInfo, expanded]
  );

  const rowTops = useMemo(() => {
    const tops = [20];
    for (let r = 0; r < rows; r++) {
      const hasDrawer = expandedByRow[r].length > 0;
      const drawerH = hasDrawer ? drawerHeights[r] || 90 : 0;
      const extra = hasDrawer ? drawerH + DRAWER_GAP * 2 : 0;
      tops.push(tops[r] + ROW_CARD_ZONE + extra + ROW_GAP);
    }
    return tops;
  }, [rows, expandedByRow, drawerHeights]);

  const totalHeight = rowTops[rows] + 20;

  const targetPositions = MILESTONES.map((_, i) => {
    const row = Math.floor(i / cols);
    const colInRow = i % cols;
    const reversed = row % 2 === 1;
    const col = reversed ? cols - 1 - colInRow : colInRow;
    return { x: colWidth * (col + 0.5), y: rowTops[row] };
  });

  const positions = useAnimatedPoints(targetPositions);
  const pathPoints = positions.map((p) => ({ x: p.x, y: p.y + DOT_SIZE / 2 }));
  const pathD = smoothPath(pathPoints);

  const toggleExpand = useCallback((id) => setExpanded((p) => ({ ...p, [id]: !p[id] })), []);
  const openDetails = useCallback((details, color) => {
    setSelected(details);
    setSelectedColor(color);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (!trailRef.current) return;
      const rect = trailRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height;
      const traveled = Math.min(Math.max(vh * 0.5 - rect.top, 0), total);
      setProgress(total ? traveled / total : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ background: "#EDE6D2", minHeight: "100vh" }}>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @media (prefers-reduced-motion: reduce) {
          * { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
        }
      `}</style>

      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: "repeating-radial-gradient(circle at 15% 8%, rgba(35,43,56,0.035) 0, rgba(35,43,56,0.035) 1px, transparent 1px, transparent 46px)",
          opacity: 0.6,
        }}
      />

      <header className="relative pt-16 pb-8 px-4 text-center">
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: "0.18em", color: "#5B7A5E", fontWeight: 500 }}>
          2022 — 2026
        </div>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "44px", color: "#232B38", marginTop: 8 }}>
          My Journey
        </h1>
        <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: "14.5px", color: "#5B6472", marginTop: 10, maxWidth: 480, marginInline: "auto" }}>
          Every stamp is a stop along the way — tap one to read the story behind it.
        </p>
      </header>

      <Legend active={activeCategory} onToggle={setActiveCategory} />

      <div className="fixed hidden md:flex flex-col items-center z-20" style={{ right: 28, top: "18%", bottom: "12%" }}>
        <div style={{ width: 2, flex: 1, background: "rgba(35,43,56,0.12)", position: "relative" }}>
          <div
            className="absolute rounded-full flex items-center justify-center"
            style={{ left: "50%", top: `${progress * 100}%`, transform: "translate(-50%, -50%)", width: 26, height: 26, background: "#5B7A5E", transition: "top 0.1s linear" }}
          >
            <MapPin size={13} color="#EDE6D2" />
          </div>
        </div>
      </div>

      <div ref={trailRef} className="relative max-w-6xl mx-auto" style={{ minHeight: totalHeight, transition: "min-height 0.42s ease" }}>
        <div ref={containerRef} className="relative" style={{ height: totalHeight, transition: "height 0.42s ease" }}>
          <svg width={width} height={totalHeight} className="absolute top-0 left-0" style={{ overflow: "visible" }}>
            <path d={pathD} fill="none" stroke="#A99A7C" strokeWidth={3} strokeDasharray="1 12" strokeLinecap="round" />
          </svg>

          {MILESTONES.map((m, i) => {
            const dimmed = activeCategory !== null && activeCategory !== m.category;
            return (
              <div key={m.id} style={{ opacity: dimmed ? 0.22 : 1, pointerEvents: dimmed ? "none" : "auto", transition: "opacity 0.3s ease" }}>
                <MilestoneNode
                  milestone={m}
                  pos={positions[i]}
                  colWidth={colWidth}
                  expanded={!!expanded[m.id]}
                  onToggleExpand={toggleExpand}
                  onOpenDetails={openDetails}
                />
              </div>
            );
          })}

          {rowInfo.map((_, r) =>
            expandedByRow[r].length > 0 ? (
              <RowDrawer
                key={`drawer-${r}`}
                rowIndex={r}
                items={expandedByRow[r]}
                top={rowTops[r] + ROW_CARD_ZONE + DRAWER_GAP}
                width={width}
                onOpenDetails={openDetails}
                onMeasure={onMeasureDrawer}
              />
            ) : null
          )}
        </div>
      </div>

      <footer className="text-center pb-16 pt-6" style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 12.5, color: "#8B93A0" }}>
        End of the trail — for now.
      </footer>

      <DetailModal item={selected} color={selectedColor} onClose={() => setSelected(null)} />
    </div>
  );
}