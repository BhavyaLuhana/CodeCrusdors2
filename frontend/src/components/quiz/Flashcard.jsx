// frontend/src/components/quiz/Flashcard.jsx

import { useState } from "react";

const difficultyDot = {
  beginner:     "#00c9a7",
  intermediate: "#ffb627",
  advanced:     "#ff4d6d",
};

const Flashcard = ({ sign, onAnswer, isAnswered, userWasCorrect }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [imgError,  setImgError]  = useState(false);

  const handleFlip = () => {
    if (!isAnswered) setIsFlipped((p) => !p);
  };

  return (
    <div className="flex flex-col items-center gap-6">

      {/* ── 3D Flip Card ── */}
      <div
        className="relative w-full max-w-sm cursor-pointer select-none"
        style={{ perspective: "1200px" }}
        onClick={handleFlip}
      >
        <div
          className="relative w-full transition-transform duration-[600ms]"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            height: "360px",
          }}
        >
          {/* ── Front ── */}
          <div
            className="absolute inset-0 rounded-3xl overflow-hidden
                       flex flex-col"
            style={{
              backfaceVisibility: "hidden",
              background: "var(--surface)",
              border: "1.5px solid var(--border)",
              boxShadow: "var(--shadow-hover)",
            }}
          >
            {/* Difficulty indicator */}
            <div
              className="h-1 w-full"
              style={{
                background: difficultyDot[sign.difficultyLevel] || "#6c63ff",
              }}
            />

            {/* Image */}
            <div
              className="flex-1 flex items-center justify-center p-8"
              style={{ background: "var(--brand-light)" }}
            >
              {!imgError ? (
                <img
                  src={sign.imageUrl}
                  alt="Sign to identify"
                  className="w-full h-full object-contain
                             transition-transform duration-500
                             hover:scale-105"
                  onError={() => setImgError(true)}
                />
              ) : (
                <span className="text-8xl animate-float">🤟</span>
              )}
            </div>

            {/* Footer hint */}
            <div
              className="px-5 py-4 flex items-center justify-between"
              style={{ borderTop: "1px solid var(--border)" }}
            >
              <span className="section-label">What sign is this?</span>
              <span
                className="text-xs font-bold flex items-center gap-1.5"
                style={{ color: "var(--brand)" }}
              >
                <span>Tap to reveal</span>
                <span className="text-base">👆</span>
              </span>
            </div>
          </div>

          {/* ── Back ── */}
          <div
            className="absolute inset-0 rounded-3xl overflow-hidden
                       flex flex-col"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              background: isAnswered
                ? userWasCorrect
                  ? "linear-gradient(135deg, #f0fdf4, #dcfce7)"
                  : "linear-gradient(135deg, #fff1f2, #ffe4e6)"
                : "linear-gradient(135deg, var(--brand-light), #f0f0ff)",
              border: `1.5px solid ${
                isAnswered
                  ? userWasCorrect
                    ? "#86efac"
                    : "#fca5a5"
                  : "rgba(108,99,255,0.2)"
              }`,
              boxShadow: "var(--shadow-hover)",
            }}
          >
            {/* Answer */}
            <div className="flex-1 flex flex-col items-center
                            justify-center gap-3 px-6">
              <p className="section-label">This sign means</p>
              <p
                className="text-7xl font-black tracking-tight"
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  color: isAnswered
                    ? userWasCorrect
                      ? "#16a34a"
                      : "#dc2626"
                    : "var(--brand)",
                }}
              >
                {sign.name}
              </p>
              <p
                className="text-sm text-center max-w-xs leading-relaxed"
                style={{ color: "var(--ink-muted)" }}
              >
                {sign.meaning}
              </p>

              {sign.keywords?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 justify-center mt-1">
                  {sign.keywords.slice(0, 4).map((kw) => (
                    <span
                      key={kw}
                      className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{
                        background: "rgba(255,255,255,0.8)",
                        color: "var(--ink-muted)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom */}
            <div
              className="px-5 py-4"
              style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
            >
              <p className="section-label text-center">
                {isAnswered
                  ? userWasCorrect
                    ? "🎉 Well done!"
                    : "😅 Keep practicing"
                  : "Did you get it right?"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Answer Buttons ── */}
      {isFlipped && !isAnswered && (
        <div className="flex gap-3 w-full max-w-sm animate-bounce-soft">
          <button
            onClick={() => onAnswer(false)}
            className="flex-1 py-3.5 rounded-2xl font-bold text-sm
                       transition-all duration-200 hover:-translate-y-1
                       flex items-center justify-center gap-2"
            style={{
              background: "rgba(239,68,68,0.08)",
              color: "#dc2626",
              border: "1.5px solid rgba(239,68,68,0.2)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(239,68,68,0.15)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(239,68,68,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(239,68,68,0.08)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <span className="text-lg">❌</span> Got it Wrong
          </button>
          <button
            onClick={() => onAnswer(true)}
            className="flex-1 py-3.5 rounded-2xl font-bold text-sm
                       transition-all duration-200 hover:-translate-y-1
                       flex items-center justify-center gap-2"
            style={{
              background: "rgba(0,201,167,0.08)",
              color: "#00a88a",
              border: "1.5px solid rgba(0,201,167,0.2)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(0,201,167,0.15)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(0,201,167,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(0,201,167,0.08)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <span className="text-lg">✅</span> Got it Right
          </button>
        </div>
      )}

      {/* Hint */}
      {!isFlipped && !isAnswered && (
        <p
          className="text-sm text-center animate-fade-in"
          style={{ color: "var(--ink-faint)" }}
        >
          Study the sign, then tap to reveal the answer
        </p>
      )}
    </div>
  );
};

export default Flashcard;