// components/GrowthTimeline/GrowthTimeline.jsx
import React, { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { GraduationCap, Rocket, Trophy, Leaf, X, GitBranch } from "lucide-react";

// ---- DATA -------------------------------------------------------
const milestones = [
  { id: 1, year: "2019", type: "course", title: "Started High School", description: "First lines of code in an intro CS elective — hooked immediately." },
  { id: 2, year: "2020", type: "project", title: "Built My First Website", description: "A janky HTML/CSS fan page. Broke it a hundred times, learned from every one." },
  { id: 3, year: "2021", type: "achievement", title: "Regional Science Fair — 2nd Place", description: "A weather-prediction project using basic ML. My first taste of data." },
  { id: 4, year: "2022", type: "course", title: "AP Computer Science", description: "Java, data structures, and the first time algorithms actually clicked." },
  { id: 5, year: "2022", type: "project", title: "Personal Budget Tracker App", description: "React + local storage. First real app with actual state management." },
  { id: 6, year: "2023", type: "achievement", title: "Hackathon Finalist", description: "48 hours, 3 teammates, way too much coffee, and a working demo." },
  { id: 7, year: "2024", type: "course", title: "University — Software Engineering", description: "Started my degree, went deep on systems and web development." },
  { id: 8, year: "2025", type: "project", title: "This Portfolio", description: "Learning React + Tailwind by building the very page you're looking at." },
];

const branches = [
  {
    id: "br-side-projects",
    fromId: 5,
    side: "left",
    label: "Side projects",
    items: [
      { id: 51, year: "2022", type: "project", title: "Recipe Sharing App", description: "A weekend project to practice working with a public API." },
      { id: 52, year: "2023", type: "project", title: "Note-Taking Chrome Extension", description: "First time learning the browser extension APIs." },
    ],
  },
  {
    id: "br-extracurriculars",
    fromId: 7,
    side: "right",
    label: "Beyond the classroom",
    items: [
      { id: 71, year: "2024", type: "achievement", title: "Robotics Club Lead", description: "Organized weekly builds and led a team of 6 to a regional competition." },
      { id: 72, year: "2025", type: "course", title: "Study Abroad — Systems Design", description: "A semester in Berlin focused on distributed systems." },
    ],
  },
];

const typeMeta = {
  course: { icon: GraduationCap, color: "#5B8CA6", label: "Coursework" },
  project: { icon: Rocket, color: "#6E9C5C", label: "Project" },
  achievement: { icon: Trophy, color: "#D99A3C", label: "Achievement" },
};

// ---- CURVE MATH -----------------------------------------------
const AMPLITUDE = 95;
const FREQUENCY = 1.9;

function curveX(t, width) {
  return width / 2 + AMPLITUDE * Math.sin(t * FREQUENCY * Math.PI * 2);
}

// ---- useInView HOOK -----------------------------------------------
function useInView(threshold = 0.4) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}

// ---- NODE COMPONENT -----------------------------------------------
function Node({
  milestone,
  x,
  y,
  side,
  onOpen,
  onReveal,
  scale = 1,
  hasBranches = false,
  branchId = null,
  onToggleBranch = null,
  isBranchExpanded = false,
}) {
  const [ref, inView] = useInView(0.5);
  const meta = typeMeta[milestone.type];
  const Icon = meta.icon;

  useEffect(() => {
    if (inView && onReveal) onReveal(milestone.id);
  }, [inView, onReveal, milestone.id]);

  const dotSize = 36 * scale;
  const cardWidth = 208 * scale;

  const handleClick = () => {
    if (hasBranches && onToggleBranch) {
      onToggleBranch(branchId);
    } else {
      onOpen(milestone);
    }
  };

  return (
    <div
      ref={ref}
      className="absolute"
      style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
    >
      <button
        onClick={handleClick}
        className="relative z-10 flex items-center justify-center rounded-full border-4 border-[#FAF6EC] shadow-md transition-transform duration-500 ease-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2"
        style={{
          width: dotSize,
          height: dotSize,
          backgroundColor: meta.color,
          opacity: inView ? 1 : 0,
          transform: `scale(${inView ? 1 : 0.3}) rotate(${inView ? 0 : -45}deg)`,
          transitionProperty: "opacity, transform",
          boxShadow: hasBranches && isBranchExpanded
            ? `0 0 0 8px rgba(110, 156, 92, 0.2), rgba(0, 0, 0, 0.1) 0 10px 15px -3px`
            : "rgba(0, 0, 0, 0.1) 0 4px 6px -2px",
        }}
        aria-label={`${meta.label}: ${milestone.title}`}
        title={hasBranches ? "Click to toggle branches" : "Click for details"}
      >
        <Icon size={14 * scale} className="text-white" strokeWidth={2.5} />
      </button>

      <div
        className={`absolute top-1/2 -translate-y-1/2 rounded-2xl border border-black/5 bg-white/90 p-3.5 shadow-sm backdrop-blur-sm transition-all duration-700 ease-out ${
          side === "right" ? "left-12" : "right-12 text-right"
        }`}
        style={{
          width: cardWidth,
          opacity: inView ? 1 : 0,
          transform: `translateY(-50%) translateX(${
            inView ? "0" : side === "right" ? "-12px" : "12px"
          })`,
        }}
      >
        <span
          className="text-[10px] font-semibold uppercase tracking-wide"
          style={{ color: meta.color }}
        >
          {milestone.year} · {meta.label}
        </span>
        <h3 className="mt-1 font-display text-sm font-semibold text-stone-800">
          {milestone.title}
        </h3>
        {hasBranches && (
          <span className="mt-2 inline-block text-xs text-stone-500">
            {isBranchExpanded ? "▼ Collapse" : "▶ Expand branches"}
          </span>
        )}
      </div>
    </div>
  );
}

// ---- BRANCH GEOMETRY -----------------------------------------------
function branchGeometry(anchor, side, count) {
  const sign = side === "right" ? 1 : -1;
  const points = [];

  for (let i = 0; i < count; i++) {
    points.push({
      x: anchor.x + sign * (85 + i * 95),  // ← These numbers
      y: anchor.y - (i + 1) * 78,
    });
  }

  let d = `M ${anchor.x} ${anchor.y}`;
  let prev = anchor;

  points.forEach((p) => {
    const cx = prev.x + sign * 45;
    const cy = (prev.y + p.y) / 2;
    d += `Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    prev = p;
  });

  return { points, d };
}

// ---- BRANCH PATH -----------------------------------------------
function BranchPath({ d }) {
  const ref = useRef(null);
  const [length, setLength] = useState(0);
  const [grown, setGrown] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    setLength(ref.current.getTotalLength());
    requestAnimationFrame(() => requestAnimationFrame(() => setGrown(true)));
  }, [d]);

  return (
    <path
      ref={ref}
      d={d}
      fill="none"
      stroke="#B7C9A6"
      strokeWidth={3.5}
      strokeLinecap="round"
      strokeDasharray={length}
      style={{
        strokeDashoffset: grown ? 0 : length,
        transition: "stroke-dashoffset 900ms ease-out",
      }}
    />
  );
}

// ---- BRANCH GROUP -----------------------------------------------
function BranchGroup({ branch, anchor, onOpen, onReveal, isExpanded }) {
  const { points, d } = useMemo(
    () => branchGeometry(anchor, branch.side, branch.items.length),
    [anchor.x, anchor.y, branch.side, branch.items.length]
  );

  const labelPoint = points[0];
  const sign = branch.side === "right" ? 1 : -1;

  // Only render if expanded
  if (!isExpanded) return null;

  return (
    <>
      <svg className="pointer-events-none absolute left-0 top-0 overflow-visible">
        <BranchPath d={d} />
      </svg>

      <div
        className="absolute flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-[#8AA37A]"
        style={{
          left: labelPoint.x + sign * 18,
          top: anchor.y - 34,
          transform: branch.side === "right" ? "none" : "translateX(-100%)",
        }}
      >
        <GitBranch size={11} /> {branch.label}
      </div>

      {branch.items.map((item, i) => (
        <Node
          key={item.id}
          milestone={item}
          x={points[i].x}
          y={points[i].y}
          side={branch.side}
          scale={0.85}
          onOpen={onOpen}
          onReveal={onReveal}
        />
      ))}
    </>
  );
}

// ---- DETAIL MODAL -----------------------------------------------
function DetailModal({ milestone, onClose }) {
  if (!milestone) return null;

  const meta = typeMeta[milestone.type];
  const Icon = meta.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-[#FAF6EC] p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{ backgroundColor: meta.color }}
          >
            <Icon size={22} className="text-white" />
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-stone-400 hover:bg-stone-200 hover:text-stone-700"
          >
            <X size={20} />
          </button>
        </div>

        <span
          className="mt-4 block text-xs font-semibold uppercase tracking-wide"
          style={{ color: meta.color }}
        >
          {milestone.year} · {meta.label}
        </span>
        <h2 className="mt-1 font-display text-2xl font-semibold text-stone-800">
          {milestone.title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          {milestone.description}
        </p>
      </div>
    </div>
  );
}

// ---- MAIN COMPONENT -----------------------------------------------
export default function GrowthTimeline() {
  const width = 1400;
  const nodeSpacing = 210;
  const height = milestones.length * nodeSpacing + 160;
  const containerRef = useRef(null);

  const [active, setActive] = useState(null);
  const [revealedIds, setRevealedIds] = useState(() => new Set());
  const [expandedBranches, setExpandedBranches] = useState(() => new Set());

  const handleReveal = useCallback((id) => {
    setRevealedIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const toggleBranch = useCallback((branchId) => {
    setExpandedBranches((prev) => {
      const next = new Set(prev);
      if (next.has(branchId)) {
        next.delete(branchId);
      } else {
        next.add(branchId);
      }
      return next;
    });
  }, []);

  const pathD = useMemo(() => {
    const steps = 160;
    let d = "";
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = curveX(t, width);
      const y = height - t * height;
      d += i === 0 ? `M ${x} ${y}` : `L ${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    return d;
  }, [height]);

  const nodePositions = useMemo(
    () =>
      milestones.map((m, i) => {
        const t = i / (milestones.length - 1);
        return {
          ...m,
          x: curveX(t, width),
          y: height - t * height,
          side: i % 2 === 0 ? "right" : "left",
        };
      }),
    [height]
  );

  const posById = useMemo(() => {
    const map = {};
    nodePositions.forEach((n) => (map[n.id] = n));
    return map;
  }, [nodePositions]);

  return (
    <div className="min-h-screen overflow-x-auto bg-[#FAF6EC]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
        .font-display { font-family: 'Fredoka', sans-serif; }
        body { font-family: 'Inter', sans-serif; }
      `}</style>

      <section className="mx-auto flex max-w-3xl flex-col items-center px-6 pt-24 pb-16 text-center">
        <span className="inline-flex items-center gap-1 rounded-full bg-[#6E9C5C]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#4C6E40]">
          <Leaf size={12} /> Still growing
        </span>
        <h1 className="mt-5 font-display text-5xl font-semibold leading-tight text-stone-800 sm:text-6xl">
          Here's how I grew.
        </h1>
        <p className="mt-4 max-w-md text-stone-500">
          The main vine is the throughline. Side branches are the things
          that happened alongside it. Tap any bloom for the full story.
        </p>
      </section>

      <section
        ref={containerRef}
        className="relative mx-auto"
        style={{ width, height }}
      >
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="absolute inset-0"
        >
          <path d={pathD} fill="none" stroke="#6E9C5C" strokeWidth={5} strokeLinecap="round" />
        </svg>

        {nodePositions.map((m) => {
          const hasBranches = branches.some((b) => b.fromId === m.id);
          const branchForNode = branches.find((b) => b.fromId === m.id);

          return (
            <Node
              key={m.id}
              milestone={m}
              x={m.x}
              y={m.y}
              side={m.side}
              onOpen={setActive}
              onReveal={handleReveal}
              hasBranches={hasBranches}
              branchId={branchForNode?.id}
              onToggleBranch={toggleBranch}
              isBranchExpanded={branchForNode && expandedBranches.has(branchForNode.id)}
            />
          );
        })}

        {branches.map((branch) => {
          const anchor = posById[branch.fromId];
          const isExpanded = expandedBranches.has(branch.id);

          if (!anchor || !revealedIds.has(branch.fromId)) return null;

          return (
            <BranchGroup
              key={branch.id}
              branch={branch}
              anchor={anchor}
              onOpen={setActive}
              onReveal={handleReveal}
              isExpanded={isExpanded}
            />
          );
        })}
      </section>

      <div className="h-24" />
      <DetailModal milestone={active} onClose={() => setActive(null)} />
    </div>
  );
}