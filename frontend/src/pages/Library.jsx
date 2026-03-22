// frontend/src/pages/Library.jsx

import { useState } from "react";
import SignCard from "../components/library/SignCard";
import Loader from "../components/ui/Loader";
import ErrorMessage from "../components/ui/ErrorMessage";
import useApi from "../hooks/useApi";
import { subjectAPI, signAPI } from "../api/api";

const DIFFICULTY_OPTIONS = [
  { label: "All Levels",    value: ""             },
  { label: "Beginner",      value: "beginner"     },
  { label: "Intermediate",  value: "intermediate" },
  { label: "Advanced",      value: "advanced"     },
];

const Library = () => {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [difficulty, setDifficulty]           = useState("");
  const [search, setSearch]                   = useState("");

  const {
    data: subjects,
    loading: subjectsLoading,
    error: subjectsError,
    refetch: refetchSubjects,
  } = useApi(subjectAPI.getAll, null, []);

  const {
    data: signsData,
    loading: signsLoading,
    error: signsError,
    refetch: refetchSigns,
  } = useApi(
    selectedSubject
      ? () => signAPI.getBySubject(selectedSubject._id)
      : () => Promise.resolve({ data: [] }),
    null,
    [selectedSubject?._id]
  );

  const signs = signsData || [];

  const filteredSigns = signs.filter((sign) => {
    const matchesDifficulty =
      !difficulty || sign.difficultyLevel === difficulty;
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      sign.name.toLowerCase().includes(q) ||
      sign.meaning.toLowerCase().includes(q) ||
      sign.keywords?.some((k) => k.toLowerCase().includes(q));
    return matchesDifficulty && matchesSearch;
  });

  return (
    <div className="space-y-7">
      {/* ── Header ── */}
      <div className="animate-fade-up">
        <h1
          className="text-3xl font-black tracking-tight"
          style={{ fontFamily: "DM Sans, sans-serif", color: "var(--ink)" }}
        >
          Sign <span className="text-gradient">Library</span>
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--ink-muted)" }}>
          Browse all signs organized by subject
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* ── Subject Sidebar ── */}
        <div className="lg:col-span-1 animate-slide-right">
          <div
            className="rounded-2xl overflow-hidden sticky top-24"
            style={{
              border: "1.5px solid var(--border)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            {/* Header */}
            <div
              className="px-4 py-3.5"
              style={{
                background: "var(--surface-2)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <p className="section-label">Subjects</p>
            </div>

            {subjectsLoading ? (
              <div className="p-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="skeleton h-12 rounded-xl mb-2"
                    style={{ animationDelay: `${i * 100}ms` }}
                  />
                ))}
              </div>
            ) : subjectsError ? (
              <div className="p-4">
                <ErrorMessage
                  message={subjectsError}
                  onRetry={refetchSubjects}
                />
              </div>
            ) : (
              <div
                className="divide-y"
                style={{ "--tw-divide-color": "var(--border)" }}
              >
                {subjects?.map((subject, i) => (
                  <button
                    key={subject._id}
                    onClick={() => {
                      setSelectedSubject(subject);
                      setSearch("");
                      setDifficulty("");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3.5
                               text-left transition-all duration-200
                               hover:bg-surface-2 group"
                    style={{
                      borderBottom: "1px solid var(--border)",
                      background:
                        selectedSubject?._id === subject._id
                          ? "var(--brand-light)"
                          : "transparent",
                      animationDelay: `${i * 50}ms`,
                    }}
                  >
                    <span
                      className="text-xl w-8 h-8 rounded-lg flex
                                 items-center justify-center shrink-0
                                 transition-transform duration-200
                                 group-hover:scale-110"
                      style={{
                        background:
                          selectedSubject?._id === subject._id
                            ? "rgba(108,99,255,0.15)"
                            : "var(--surface-2)",
                      }}
                    >
                      {subject.icon || "📖"}
                    </span>
                    <div className="min-w-0">
                      <p
                        className="font-semibold text-sm truncate"
                        style={{
                          fontFamily: "DM Sans, sans-serif",
                          color:
                            selectedSubject?._id === subject._id
                              ? "var(--brand)"
                              : "var(--ink)",
                        }}
                      >
                        {subject.name}
                      </p>
                      {subject.description && (
                        <p
                          className="text-xs truncate"
                          style={{ color: "var(--ink-faint)" }}
                        >
                          {subject.description}
                        </p>
                      )}
                    </div>
                    {selectedSubject?._id === subject._id && (
                      <span
                        className="ml-auto text-xs font-bold shrink-0"
                        style={{ color: "var(--brand)" }}
                      >
                        →
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Signs Panel ── */}
        <div className="lg:col-span-3 space-y-5">
          {selectedSubject ? (
            <>
              {/* Toolbar */}
              <div
                className="flex flex-col sm:flex-row gap-3 sm:items-center
                           justify-between animate-fade-up"
              >
                <div>
                  <h2
                    className="text-xl font-black tracking-tight"
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      color: "var(--ink)",
                    }}
                  >
                    {selectedSubject.icon} {selectedSubject.name}
                  </h2>
                  {!signsLoading && (
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: "var(--ink-faint)" }}
                    >
                      {filteredSigns.length} sign
                      {filteredSigns.length !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Search signs..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input text-sm py-2 w-36"
                  />
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="input text-sm py-2 w-36"
                  >
                    {DIFFICULTY_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Grid */}
              {signsLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3
                                xl:grid-cols-4 gap-4">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="skeleton rounded-2xl"
                      style={{
                        height: "220px",
                        animationDelay: `${i * 60}ms`,
                      }}
                    />
                  ))}
                </div>
              ) : signsError ? (
                <ErrorMessage
                  message={signsError}
                  onRetry={refetchSigns}
                />
              ) : filteredSigns.length === 0 ? (
                <div className="text-center py-16 animate-fade-in">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center
                               justify-center text-2xl mx-auto mb-4"
                    style={{
                      background: "var(--surface-2)",
                      border: "1.5px solid var(--border)",
                    }}
                  >
                    🔍
                  </div>
                  <p
                    className="font-bold"
                    style={{ color: "var(--ink)" }}
                  >
                    No signs match your filters
                  </p>
                  <button
                    onClick={() => { setSearch(""); setDifficulty(""); }}
                    className="text-sm mt-2 font-semibold"
                    style={{ color: "var(--brand)" }}
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3
                                xl:grid-cols-4 gap-4">
                  {filteredSigns.map((sign, i) => (
                    <div
                      key={sign._id}
                      className="animate-fade-up"
                      style={{ animationDelay: `${i * 40}ms` }}
                    >
                      <SignCard sign={sign} />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            /* Empty state */
            <div
              className="flex flex-col items-center justify-center
                         h-72 text-center animate-fade-in rounded-2xl"
              style={{
                background: "var(--surface-2)",
                border: "2px dashed var(--border)",
              }}
            >
              <span className="text-5xl mb-3 animate-float">👈</span>
              <p
                className="font-bold"
                style={{
                  color: "var(--ink)",
                  fontFamily: "DM Sans, sans-serif",
                }}
              >
                Select a subject
              </p>
              <p
                className="text-sm mt-1"
                style={{ color: "var(--ink-muted)" }}
              >
                Choose from the list on the left
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Library;