// frontend/src/components/library/SignCard.jsx

import { useState } from "react";
import { getDifficultyColor } from "../../utils/helpers";

const difficultyConfig = {
  beginner:     { label: "Beginner",     dot: "#00c9a7" },
  intermediate: { label: "Intermediate", dot: "#ffb627" },
  advanced:     { label: "Advanced",     dot: "#ff4d6d" },
};

// ── Sign Detail Modal ──────────────────────────────────────────────────────────
const SignModal = ({ sign, imgError, onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center px-4"
    style={{ background: "rgba(15,15,26,0.45)", backdropFilter: "blur(6px)" }}
    onClick={onClose}
  >
    <div
      className="bg-white rounded-3xl shadow-2xl max-w-sm w-full
                 overflow-hidden animate-scale-in"
      style={{ border: "1.5px solid var(--border)" }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Image */}
      <div
        className="relative aspect-square flex items-center justify-center
                   overflow-hidden"
        style={{ background: "var(--brand-light)" }}
      >
        {!imgError ? (
          <img
            src={sign.imageUrl}
            alt={sign.name}
            className="w-full h-full object-contain p-8
                       transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <span className="text-8xl animate-float">🤟</span>
        )}

        {/* Difficulty pill */}
        <div className="absolute top-3 right-3">
          <span
            className="badge"
            style={{
              background: "white",
              color: "var(--ink-muted)",
              border: "1.5px solid var(--border)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full mr-1.5"
              style={{
                background:
                  difficultyConfig[sign.difficultyLevel]?.dot || "#6b6b8a",
                display: "inline-block",
              }}
            />
            {difficultyConfig[sign.difficultyLevel]?.label ||
              sign.difficultyLevel}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-6 space-y-4">
        <div>
          <h2
            className="text-3xl font-black tracking-tight"
            style={{
              fontFamily: "DM Sans, sans-serif",
              color: "var(--ink)",
            }}
          >
            {sign.name}
          </h2>
          <p
            className="text-sm mt-1 leading-relaxed"
            style={{ color: "var(--ink-muted)" }}
          >
            {sign.meaning}
          </p>
        </div>

        {sign.keywords?.length > 0 && (
          <div>
            <p className="section-label mb-2">Keywords</p>
            <div className="flex flex-wrap gap-1.5">
              {sign.keywords.map((kw) => (
                <span
                  key={kw}
                  className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background: "var(--brand-light)",
                    color: "var(--brand)",
                    border: "1px solid rgba(108,99,255,0.15)",
                  }}
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}

        <button onClick={onClose} className="btn-secondary w-full">
          Close
        </button>
      </div>
    </div>
  </div>
);

// ── Sign Card ──────────────────────────────────────────────────────────────────
const SignCard = ({ sign }) => {
  const [imgError,    setImgError]    = useState(false);
  const [showDetail,  setShowDetail]  = useState(false);
  const [isHovered,   setIsHovered]   = useState(false);

  return (
    <>
      <div
        onClick={() => setShowDetail(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="rounded-2xl overflow-hidden cursor-pointer
                   transition-all duration-300 animate-fade-up"
        style={{
          background: "var(--surface)",
          border: "1.5px solid var(--border)",
          boxShadow: isHovered
            ? "var(--shadow-hover)"
            : "var(--shadow-card)",
          transform: isHovered
            ? "translateY(-4px) scale(1.01)"
            : "translateY(0) scale(1)",
        }}
      >
        {/* Image area */}
        <div
          className="relative aspect-square overflow-hidden"
          style={{ background: "var(--brand-light)" }}
        >
          {!imgError ? (
            <img
              src={sign.imageUrl}
              alt={`Sign: ${sign.name}`}
              className="w-full h-full object-cover transition-transform
                         duration-500"
              style={{ transform: isHovered ? "scale(1.08)" : "scale(1)" }}
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center
                         text-5xl"
            >
              🤟
            </div>
          )}

          {/* Difficulty dot */}
          <div className="absolute top-2.5 right-2.5">
            <span
              className="w-2.5 h-2.5 rounded-full block shadow-sm"
              style={{
                background:
                  difficultyConfig[sign.difficultyLevel]?.dot || "#6b6b8a",
                boxShadow: `0 0 6px ${
                  difficultyConfig[sign.difficultyLevel]?.dot || "#6b6b8a"
                }88`,
              }}
            />
          </div>

          {/* Hover overlay */}
          <div
            className="absolute inset-0 flex items-center justify-center
                       transition-opacity duration-300"
            style={{
              background: "rgba(108,99,255,0.85)",
              opacity: isHovered ? 1 : 0,
            }}
          >
            <span className="text-white text-sm font-bold tracking-wide">
              View Details →
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-3.5">
          <p
            className="font-black text-base tracking-tight"
            style={{
              fontFamily: "DM Sans, sans-serif",
              color: "var(--ink)",
            }}
          >
            {sign.name}
          </p>
          <p
            className="text-xs mt-0.5 line-clamp-1"
            style={{ color: "var(--ink-faint)" }}
          >
            {sign.meaning}
          </p>

          {sign.keywords?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {sign.keywords.slice(0, 2).map((kw) => (
                <span
                  key={kw}
                  className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                  style={{
                    background: "var(--surface-2)",
                    color: "var(--ink-faint)",
                  }}
                >
                  {kw}
                </span>
              ))}
              {sign.keywords.length > 2 && (
                <span
                  className="text-[10px]"
                  style={{ color: "var(--ink-faint)" }}
                >
                  +{sign.keywords.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {showDetail && (
        <SignModal
          sign={sign}
          imgError={imgError}
          onClose={() => setShowDetail(false)}
        />
      )}
    </>
  );
};

export default SignCard;