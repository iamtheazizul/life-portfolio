import { CATEGORY_META } from "../utils/constants";

export function Legend({ active, onToggle }) {
  return (
    <div
      className="sticky top-0 z-30 backdrop-blur-sm"
      style={{
        background: "rgba(237,230,210,0.9)",
        borderBottom: "1px solid rgba(35,43,56,0.12)",
      }}
    >
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