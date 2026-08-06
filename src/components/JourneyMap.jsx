import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { Legend } from "./Legend";
import { MilestoneNode } from "./MilestoneNode";
import { RowDrawer } from "./RowDrawer";
import { DetailModal } from "./DetailModal";
import { ProgressBar } from "./ProgressBar";
import { useContainerWidth } from "../hooks/useContainerWidth";
import { useAnimatedPoints } from "../hooks/useAnimatedPoints";
import { useScrollProgress } from "../hooks/useScrollProgress";
import {
  CATEGORY_META,
  DOT_SIZE,
  ROW_CARD_ZONE,
  ROW_GAP,
  DRAWER_GAP,
} from "../utils/constants";
import { smoothPath, colsForWidth } from "../utils/pathUtils";
import { loadFonts } from "../utils/fonts";
import {
  computeRowInfo,
  computeRowTops,
  computeTargetPositions,
} from "../utils/calculations";
import { fetchMilestones } from "../services/contentfulClient";

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

  // --- Contentful data ---
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchMilestones();
        if (!cancelled) setMilestones(data ?? []);
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const cols = colsForWidth(width);
  const colWidth = width / cols;
  const rows = Math.ceil(milestones.length / cols);

  const onMeasureDrawer = useCallback((rowIndex, height) => {
    setDrawerHeights((prev) =>
      prev[rowIndex] === height ? prev : { ...prev, [rowIndex]: height }
    );
  }, []);

  const rowInfo = useMemo(
    () => computeRowInfo(rows, cols, colWidth, milestones),
    [rows, cols, colWidth, milestones]
  );

  const expandedByRow = useMemo(
    () =>
      rowInfo.map((items) =>
        items
          .filter(({ m }) => m.branches?.length && expanded[m.id])
          .map(({ m, dotX }) => ({ ...m, dotX }))
      ),
    [rowInfo, expanded]
  );

  const rowTops = useMemo(
    () => computeRowTops(rows, expandedByRow, drawerHeights),
    [rows, expandedByRow, drawerHeights]
  );

  const totalHeight = (rowTops[rows] ?? 0) + 20;

  const targetPositions = useMemo(
    () => computeTargetPositions(milestones, cols, colWidth, rowTops),
    [milestones, cols, colWidth, rowTops]
  );

  const positions = useAnimatedPoints(targetPositions);
  const pathPoints = positions.map((p) => ({
    x: p.x,
    y: p.y + DOT_SIZE / 2,
  }));
  const pathD = smoothPath(pathPoints);

  const toggleExpand = useCallback(
    (id) => setExpanded((p) => ({ ...p, [id]: !p[id] })),
    []
  );

  const openDetails = useCallback((details, color) => {
    setSelected(details);
    setSelectedColor(color);
  }, []);

  useScrollProgress(trailRef, setProgress);

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
          backgroundImage:
            "repeating-radial-gradient(circle at 15% 8%, rgba(35,43,56,0.035) 0, rgba(35,43,56,0.035) 1px, transparent 1px, transparent 46px)",
          opacity: 0.6,
        }}
      />

      <header className="relative pt-16 pb-8 px-4 text-center">
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            letterSpacing: "0.18em",
            color: "#5B7A5E",
            fontWeight: 500,
          }}
        >
          2022 — 2026
        </div>
        <h1
          style={{
            fontFamily: "'Fraunces', serif",
            fontWeight: 700,
            fontSize: "44px",
            color: "#232B38",
            marginTop: 8,
          }}
        >
          My Journey
        </h1>
        <p
          style={{
            fontFamily: "'Work Sans', sans-serif",
            fontSize: "14.5px",
            color: "#5B6472",
            marginTop: 10,
            maxWidth: 480,
            marginInline: "auto",
          }}
        >
          Every stamp is a stop along the way — tap one to read the story
          behind it.
        </p>
      </header>

      <Legend active={activeCategory} onToggle={setActiveCategory} />

      <ProgressBar progress={progress} />

      {/* Always mount the measuring container so useContainerWidth can get a
          real width — but only draw the path/nodes once we have both data
          and a measured width, so the trail never renders from a
          zero-width/empty-milestones layout. */}
      <div
        ref={trailRef}
        className="relative max-w-6xl mx-auto"
        style={{ minHeight: totalHeight, transition: "min-height 0.42s ease" }}
      >
        <div
          ref={containerRef}
          className="relative"
          style={{
            height: totalHeight,
            transition: "height 0.42s ease",
          }}
        >
          {error ? (
            <div
              className="max-w-xl mx-auto text-center px-4 py-16"
              style={{
                fontFamily: "'Work Sans', sans-serif",
                color: "#8B4A4A",
              }}
            >
              Couldn't load milestones from Contentful.
              <div style={{ fontSize: 12.5, color: "#8B93A0", marginTop: 6 }}>
                {error.message || "Please try again shortly."}
              </div>
            </div>
          ) : loading || width === 0 || milestones.length === 0 ? (
            <div
              className="text-center px-4 py-16"
              style={{
                fontFamily: "'Work Sans', sans-serif",
                fontSize: 13.5,
                color: "#8B93A0",
              }}
            >
              Loading your journey…
            </div>
          ) : (
            <>
              <svg
                width={width}
                height={totalHeight}
                className="absolute top-0 left-0"
                style={{ overflow: "visible" }}
              >
                <path
                  d={pathD}
                  fill="none"
                  stroke="#A99A7C"
                  strokeWidth={3}
                  strokeDasharray="1 12"
                  strokeLinecap="round"
                />
              </svg>

              {milestones.map((m, i) => {
                const dimmed =
                  activeCategory !== null && activeCategory !== m.category;
                return (
                  <div
                    key={m.id}
                    style={{
                      opacity: dimmed ? 0.22 : 1,
                      pointerEvents: dimmed ? "none" : "auto",
                      transition: "opacity 0.3s ease",
                    }}
                  >
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
            </>
          )}
        </div>
      </div>

      <footer
        className="text-center pb-16 pt-6"
        style={{
          fontFamily: "'Work Sans', sans-serif",
          fontSize: 12.5,
          color: "#8B93A0",
        }}
      >
        End of the trail — for now.
      </footer>

      <DetailModal
        item={selected}
        color={selectedColor}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}