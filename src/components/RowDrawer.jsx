import { useRef, useState, useEffect, useLayoutEffect } from "react";
import { CATEGORY_META, DRAWER_GAP } from "../utils/constants";

export function RowDrawer({ rowIndex, items, top, width, onOpenDetails, onMeasure }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  const svgRef = useRef(null);

  const lineDataMap = useRef({});

  useEffect(() => {
    items.forEach((m) => {
      if (!lineDataMap.current[m.id]) {
        lineDataMap.current[m.id] = {
          isLeft: Math.random() > 0.5,
          edgeOffset: 30 + Math.random() * 60,
          verticalOffset: 20 + Math.random() * 160,
        };
      }
    });
  }, [items]);

  const pathData = useRef(null);

  useEffect(() => {
    const drawerWidth = Math.min(width - 32, 30 + items.length * 260, 980);
    const drawerLeft = width / 2;
    const drawerStartX = drawerLeft - drawerWidth / 2;
    const drawerEndX = drawerLeft + drawerWidth / 2;
    const drawerTopY = top + DRAWER_GAP + 20;

    pathData.current = items.map((m) => {
      const meta = CATEGORY_META[m.category];
      const line = lineDataMap.current[m.id];
      if (!line) return null;

      const startX = m.dotX;
      const startY = top - 2;
      const endX = line.isLeft
        ? drawerStartX + line.edgeOffset
        : drawerEndX - line.edgeOffset;
      const endY = drawerTopY + line.verticalOffset;
      const controlX = line.isLeft ? startX - 100 : startX + 100;
      const controlY = (startY + endY) / 2 - 40;
      const pathD = `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`;

      return { id: m.id, pathD, color: meta.color };
    }).filter(Boolean);
  }, [items, top, width]);

  useEffect(() => {
    const t = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(t);
  }, []);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    let lastHeight = null;
    const report = (height) => {
      if (lastHeight !== null && Math.abs(height - lastHeight) < 2) return;
      lastHeight = height;
      onMeasure(rowIndex, height);
    };
    report(el.offsetHeight);
    const ro = new ResizeObserver((entries) => {
      report(entries[0].contentRect.height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [rowIndex, onMeasure, items.length]);

  const drawerWidth = Math.min(width - 32, 30 + items.length * 260, 980);

  return (
    <>
      {/* Connection lines - simple fade-in, no stroke-draw animation */}
      <svg
        ref={svgRef}
        className="absolute"
        style={{
          left: 0,
          top: 0,
          width: width,
          height: top + 300,
          pointerEvents: "none",
          overflow: "visible",
          zIndex: 1,
        }}
      >
        {pathData.current && pathData.current.map((path) => (
          <path
            key={`line-${path.id}`}
            d={path.pathD}
            fill="none"
            stroke={path.color}
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{
              opacity: shown ? 0.6 : 0,
              transition: "opacity 0.3s ease",
            }}
          />
        ))}
      </svg>

      {/* Vertical connecting ticks */}
      {items.map((m) => (
        <div
          key={`tick-${m.id}`}
          className="absolute"
          style={{
            left: m.dotX,
            top: top - DRAWER_GAP + 2,
            width: 2,
            height: DRAWER_GAP - 2,
            background: `${CATEGORY_META[m.category].color}88`,
            transform: "translateX(-50%)",
            opacity: shown ? 1 : 0,
            transition: "opacity 0.3s ease",
            zIndex: 1,
          }}
        />
      ))}

      {/* Main drawer container with gap */}
      <div
        ref={ref}
        className="absolute left-1/2"
        style={{
          top: top + DRAWER_GAP,
          transform: `translateX(-50%) translateY(${shown ? 0 : -6}px)`,
          width: drawerWidth,
          opacity: shown ? 1 : 0,
          transition: "opacity 0.3s ease, transform 0.3s ease",
          zIndex: 2,
        }}
      >
        <div
          className="rounded-2xl p-4 shadow-sm"
          style={{
            background: "#FBF8EF",
            border: "1px solid rgba(35,43,56,0.10)",
          }}
        >
          {items.map((m, idx) => {
            const meta = CATEGORY_META[m.category];
            return (
              <div
                key={m.id}
                style={{
                  marginTop: idx > 0 ? 14 : 0,
                  paddingTop: idx > 0 ? 14 : 0,
                  borderTop:
                    idx > 0 ? "1px dashed rgba(35,43,56,0.14)" : "none",
                }}
              >
                <div
                  className="flex items-center gap-1.5"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "11px",
                    color: meta.color,
                    fontWeight: 600,
                  }}
                >
                  <span>{meta.emoji}</span>
                  {m.title}
                </div>
                <div
                  className="grid gap-2 mt-2.5"
                  style={{
                    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                  }}
                >
                  {m.branches.map((b) => (
                    <button
                      key={b.id}
                      onClick={() =>
                        onOpenDetails(
                          { title: b.title, ...b.details },
                          meta.color
                        )
                      }
                      className="px-2.5 py-1.5 rounded-md text-left transition-colors hover:brightness-95"
                      style={{
                        fontFamily: "'Work Sans', sans-serif",
                        fontSize: "12.5px",
                        fontWeight: 500,
                        color: "#232B38",
                        background: "rgba(35,43,56,0.04)",
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