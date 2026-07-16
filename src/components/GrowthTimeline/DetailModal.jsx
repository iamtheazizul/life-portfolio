import React from "react";

export default function DetailModal({ details, color, onClose }) {
  if (!details) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-[420px] max-w-[90vw] p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-stone-400 hover:text-stone-700 text-xl leading-none"
          aria-label="Close"
        >
          ×
        </button>

        <span className="text-sm font-semibold" style={{ color }}>
          Details
        </span>
        <h3 className="text-xl font-bold text-stone-800 mt-1 mb-3">
          {details.title}
        </h3>

        {details.image && (
          <img
            src={details.image}
            alt={details.title}
            className="w-full h-40 object-cover rounded-lg mb-3"
          />
        )}

        {details.description && (
          <p className="text-stone-600 text-sm mb-3">{details.description}</p>
        )}

        {details.links?.length > 0 && (
          <div className="flex flex-col gap-1">
            {details.links.map((link, i) => (
            <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium underline"
                style={{ color }}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}