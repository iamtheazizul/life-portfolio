import { CATEGORY_META, DOT_SIZE } from "../utils/constants";
import { useInView } from "../hooks/useInView";

export function MilestoneNode({
  milestone,
  pos,
  colWidth,
  expanded,
  onToggleExpand,
  onOpenDetails,
}) {
  const meta = CATEGORY_META[milestone.category];
  const hasBranches = !!milestone.branches?.length;
  const [ref, inView] = useInView();
  const cardWidth = Math.min(colWidth - 22, 188);

  const handleClick = () =>
    hasBranches
      ? onToggleExpand(milestone.id)
      : onOpenDetails({ title: milestone.title, ...milestone.details }, meta.color);

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
          width: DOT_SIZE,
          height: DOT_SIZE,
          background: meta.color,
          border: "3px solid #EDE6D2",
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
          style={{
            background: "#FBF8EF",
            border: `1px solid ${expanded ? meta.color + "66" : "rgba(35,43,56,0.10)"}`,
          }}
        >
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "10.5px",
              color: meta.color,
              fontWeight: 500,
            }}
          >
            {milestone.year}
            {milestone.term && <span style={{ opacity: 0.65 }}> · {milestone.term}</span>}
          </div>
          <div
            style={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 600,
              fontSize: "14.5px",
              color: "#232B38",
              marginTop: 3,
              lineHeight: 1.25,
            }}
          >
            {milestone.title}
          </div>
          {hasBranches && (
            <div
              style={{
                fontFamily: "'Work Sans', sans-serif",
                fontSize: "10.5px",
                color: "#8B93A0",
                marginTop: 4,
              }}
            >
              {expanded ? "tap to close ▲" : `${milestone.branches.length} courses ▾`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}