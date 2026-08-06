import { useEffect } from "react";
import { X, ExternalLink } from "lucide-react";

export function DetailModal({ item, color, onClose }) {
  useEffect(() => {
    if (!item) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(35,43,56,0.55)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full overflow-hidden rounded-2xl shadow-2xl"
        style={{
          maxWidth: 480,
          maxHeight: "88vh",
          overflowY: "auto",
          background: "#FBF8EF",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="absolute flex items-center justify-center rounded-full"
          style={{
            top: 18,
            right: 18,
            width: 46,
            height: 46,
            border: `2px dashed ${color}`,
            color,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            fontWeight: 600,
            zIndex: 2,
            background: "rgba(251,248,239,0.9)",
          }}
        >
          ✓ visited
        </div>

        <button
          onClick={onClose}
          className="absolute z-20 rounded-full p-1.5 transition-colors"
          style={{ top: 18, left: 18, background: "rgba(35,43,56,0.08)" }}
        >
          <X size={16} color="#232B38" />
        </button>

        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="w-full object-cover"
            style={{ height: 200 }}
          />
        ) : (
          <div
            className="w-full flex items-center justify-center"
            style={{
              height: 130,
              background: `linear-gradient(135deg, ${color}22, ${color}0a)`,
              borderBottom: `1px solid ${color}33`,
            }}
          >
            <span style={{ fontSize: 34, opacity: 0.55 }}>🗺️</span>
          </div>
        )}

        <div className="px-7 py-6">
          <div
            style={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 700,
              fontSize: "24px",
              color: "#232B38",
              lineHeight: 1.2,
              paddingRight: item.image ? 0 : 56,
            }}
          >
            {item.title}
          </div>

          {item.description ? (
            <div
              style={{
                fontFamily: "'Work Sans', sans-serif",
                fontSize: "14.5px",
                color: "#454F5C",
                marginTop: 14,
                lineHeight: 1.65,
              }}
            >
              {item.description
                .split("\n")
                .filter(Boolean)
                .map((para, i) => (
                  <p key={i} style={{ marginTop: i === 0 ? 0 : 10 }}>
                    {para}
                  </p>
                ))}
            </div>
          ) : (
            <div
              style={{
                fontFamily: "'Work Sans', sans-serif",
                fontSize: "13.5px",
                color: "#8B93A0",
                marginTop: 14,
                fontStyle: "italic",
              }}
            >
              No notes added yet — fill in the `description` field for this
              entry.
            </div>
          )}

          {item.links?.length > 0 && (
            <div className="flex flex-col gap-2 mt-5">
              {item.links.map((l, i) => (
                <a
                  key={i}
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 transition-colors"
                  style={{
                    fontFamily: "'Work Sans', sans-serif",
                    fontSize: "13.5px",
                    fontWeight: 600,
                    color,
                  }}
                >
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