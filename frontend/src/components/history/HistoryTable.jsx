// frontend/src/components/history/HistoryTable.jsx

import { useState } from "react";
import ConfidenceBadge from "../ui/ConfidenceBadge";
import { formatDate, truncate } from "../../utils/helpers";
import { historyAPI } from "../../api/api";

const inputTypeConfig = {
  image:  { icon: "📷", label: "Image",  bg: "rgba(108,99,255,0.08)",  color: "#6c63ff" },
  speech: { icon: "🎤", label: "Speech", bg: "rgba(0,201,167,0.08)",   color: "#00a88a" },
  text:   { icon: "✏️", label: "Text",   bg: "rgba(255,182,39,0.08)",  color: "#c98600" },
};

// ── Top-K Bar Chart ────────────────────────────────────────────────────────────
const TopKChart = ({ topK }) => (
  <div className="space-y-2 mt-2">
    {topK.map((p, i) => (
      <div key={i} className="flex items-center gap-3">
        <span
          className="w-5 text-xs font-bold text-right shrink-0"
          style={{ color: "var(--ink-faint)" }}
        >
          {p.label}
        </span>
        <div
          className="flex-1 rounded-full overflow-hidden h-2"
          style={{ background: "var(--surface-3)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${(p.confidence * 100).toFixed(0)}%`,
              background:
                i === 0
                  ? "linear-gradient(90deg, #6c63ff, #9c4dff)"
                  : "var(--border-2)",
            }}
          />
        </div>
        <span
          className="text-xs font-semibold w-10 text-right shrink-0"
          style={{ color: i === 0 ? "var(--brand)" : "var(--ink-faint)" }}
        >
          {(p.confidence * 100).toFixed(1)}%
        </span>
      </div>
    ))}
  </div>
);

// ── Detail Modal ───────────────────────────────────────────────────────────────
const DetailModal = ({ entry, onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center px-4"
    style={{ background: "rgba(15,15,26,0.4)", backdropFilter: "blur(4px)" }}
    onClick={onClose}
  >
    <div
      className="bg-white rounded-3xl shadow-2xl max-w-md w-full
                 overflow-hidden animate-scale-in"
      style={{ border: "1.5px solid var(--border)" }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div
        className="px-6 py-5 flex items-center justify-between"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <h3
          className="text-lg font-bold"
          style={{ fontFamily: "DM Sans, sans-serif", color: "var(--ink)" }}
        >
          Prediction Detail
        </h3>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full flex items-center justify-center
                     transition-colors duration-200 hover:bg-surface-2 text-lg"
          style={{ color: "var(--ink-muted)" }}
        >
          ×
        </button>
      </div>

      {/* Big letter */}
      <div
        className="mx-6 mt-5 rounded-2xl py-8 text-center relative
                   overflow-hidden"
        style={{ background: "var(--brand-light)" }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background:
              "radial-gradient(ellipse at center, var(--brand) 0%, transparent 70%)",
          }}
        />
        <p
          className="text-8xl font-black leading-none relative z-10"
          style={{ fontFamily: "DM Sans, sans-serif", color: "var(--brand)" }}
        >
          {entry.predictedSign}
        </p>
        <div className="mt-3 flex justify-center relative z-10">
          <ConfidenceBadge score={entry.confidenceScore} />
        </div>
      </div>

      {/* Details */}
      <div className="px-6 py-5 space-y-4">
        {[
          { label: "Input Type", value: entry.inputType },
          { label: "Date", value: formatDate(entry.createdAt) },
          {
            label: "Favorited",
            value: entry.isFavorited ? "⭐ Yes" : "Not favorited",
          },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between items-center">
            <span className="section-label">{label}</span>
            <span
              className="text-sm font-semibold capitalize"
              style={{ color: "var(--ink)" }}
            >
              {value}
            </span>
          </div>
        ))}

        {/* Top-K */}
        {entry.metadata?.top_k?.length > 0 && (
          <div>
            <p className="section-label mb-3">Top Predictions</p>
            <TopKChart topK={entry.metadata.top_k} />
          </div>
        )}

        {/* Inference time */}
        {entry.metadata?.inference_time_ms !== undefined && (
          <div
            className="flex items-center justify-between pt-2"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <span className="section-label">Inference Time</span>
            <span
              className="text-xs font-semibold px-2 py-1 rounded-full"
              style={{
                background: "var(--surface-2)",
                color: "var(--ink-muted)",
              }}
            >
              {entry.metadata.inference_time_ms}ms
            </span>
          </div>
        )}
      </div>

      <div
        className="px-6 pb-6"
      >
        <button onClick={onClose} className="btn-secondary w-full">
          Close
        </button>
      </div>
    </div>
  </div>
);

// ── Main Table ─────────────────────────────────────────────────────────────────
const HistoryTable = ({ data, onRefresh }) => {
  const [deletingId,   setDeletingId]   = useState(null);
  const [favoritingId, setFavoritingId] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this entry?")) return;
    try {
      setDeletingId(id);
      await historyAPI.delete(id);
      onRefresh();
    } catch (err) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleFavorite = async (id) => {
    try {
      setFavoritingId(id);
      await historyAPI.toggleFavorite(id);
      onRefresh();
    } catch (err) {
      alert(err.message);
    } finally {
      setFavoritingId(null);
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center
                     text-3xl mx-auto mb-4"
          style={{ background: "var(--surface-2)",
                   border: "1.5px solid var(--border)" }}
        >
          📭
        </div>
        <p
          className="font-bold text-lg mb-1"
          style={{ color: "var(--ink)", fontFamily: "DM Sans, sans-serif" }}
        >
          No history yet
        </p>
        <p className="text-sm" style={{ color: "var(--ink-muted)" }}>
          Start detecting signs on the Home page.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden animate-fade-up"
        style={{ border: "1.5px solid var(--border)",
                 boxShadow: "var(--shadow-card)" }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "var(--surface-2)",
                         borderBottom: "1px solid var(--border)" }}>
              {["Date", "Type", "Input", "Prediction",
                "Confidence", "★", ""].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3.5 text-left"
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--ink-faint)",
                    fontFamily: "DM Sans, sans-serif",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((entry, i) => {
              const typeConf =
                inputTypeConfig[entry.inputType] || inputTypeConfig.text;
              return (
                <tr
                  key={entry._id}
                  className="group transition-colors duration-150"
                  style={{
                    borderBottom: "1px solid var(--border)",
                    animationDelay: `${i * 40}ms`,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--surface-2)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  {/* Date */}
                  <td
                    className="px-4 py-3.5 whitespace-nowrap text-xs"
                    style={{ color: "var(--ink-faint)" }}
                  >
                    {formatDate(entry.createdAt)}
                  </td>

                  {/* Type */}
                  <td className="px-4 py-3.5">
                    <span
                      className="badge"
                      style={{
                        background: typeConf.bg,
                        color: typeConf.color,
                      }}
                    >
                      {typeConf.icon} {typeConf.label}
                    </span>
                  </td>

                  {/* Input */}
                  <td
                    className="px-4 py-3.5 max-w-[140px]"
                    style={{ color: "var(--ink-muted)" }}
                  >
                    {truncate(entry.inputContent, 28)}
                  </td>

                  {/* Prediction */}
                  <td className="px-4 py-3.5">
                    <span
                      className="text-2xl font-black"
                      style={{
                        fontFamily: "DM Sans, sans-serif",
                        color: "var(--brand)",
                      }}
                    >
                      {entry.predictedSign}
                    </span>
                  </td>

                  {/* Confidence */}
                  <td className="px-4 py-3.5">
                    <ConfidenceBadge score={entry.confidenceScore} />
                  </td>

                  {/* Favorite */}
                  <td className="px-4 py-3.5 text-center">
                    <button
                      onClick={() => handleFavorite(entry._id)}
                      disabled={favoritingId === entry._id}
                      className="text-xl transition-all duration-200
                                 hover:scale-125 disabled:opacity-40"
                      title={entry.isFavorited ? "Unfavorite" : "Favorite"}
                    >
                      {entry.isFavorited ? "⭐" : "☆"}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3
                                    opacity-0 group-hover:opacity-100
                                    transition-opacity duration-200">
                      <button
                        onClick={() => setSelectedEntry(entry)}
                        className="text-xs font-bold transition-colors
                                   duration-150"
                        style={{ color: "var(--brand)" }}
                      >
                        View
                      </button>
                      <span style={{ color: "var(--border-2)" }}>|</span>
                      <button
                        onClick={() => handleDelete(entry._id)}
                        disabled={deletingId === entry._id}
                        className="text-xs font-bold transition-colors
                                   duration-150 disabled:opacity-40"
                        style={{ color: "#e11d48" }}
                      >
                        {deletingId === entry._id ? "..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedEntry && (
        <DetailModal
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
        />
      )}
    </>
  );
};

export default HistoryTable;