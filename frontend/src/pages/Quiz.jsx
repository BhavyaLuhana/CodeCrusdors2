// frontend/src/pages/Quiz.jsx

import { useState, useCallback, useRef } from "react";
import Flashcard from "../components/quiz/Flashcard";
import Loader from "../components/ui/Loader";
import ErrorMessage from "../components/ui/ErrorMessage";
import useApi from "../hooks/useApi";
import { quizAPI, subjectAPI } from "../api/api";

const QUIZ_SIZES = [5, 10, 15, 20];

// ── Stats Preview ──────────────────────────────────────────────────────────────
const StatsPreview = () => {
  const { data, loading } = useApi(quizAPI.getStats, null, []);
  if (loading || !data || data.total === 0) return null;

  return (
    <div
      className="rounded-2xl p-5 animate-fade-up delay-300"
      style={{
        background: "var(--brand-light)",
        border: "1.5px solid rgba(108,99,255,0.15)",
      }}
    >
      <p
        className="section-label mb-4"
        style={{ color: "var(--brand)" }}
      >
        Your Stats
      </p>
      <div className="grid grid-cols-3 gap-4 text-center mb-4">
        {[
          { label: "Attempts", value: data.total,           color: "var(--brand)"  },
          { label: "Correct",  value: data.correct,         color: "#00a88a"       },
          { label: "Accuracy", value: `${data.accuracyPercent}%`, color: "var(--ink)" },
        ].map(({ label, value, color }) => (
          <div key={label}>
            <p
              className="text-2xl font-black"
              style={{ fontFamily: "DM Sans, sans-serif", color }}
            >
              {value}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--ink-faint)" }}>
              {label}
            </p>
          </div>
        ))}
      </div>
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ background: "rgba(108,99,255,0.15)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{
            width: `${data.accuracyPercent}%`,
            background: "linear-gradient(90deg, #6c63ff, #9c4dff)",
          }}
        />
      </div>
    </div>
  );
};

// ── Quiz Setup ─────────────────────────────────────────────────────────────────
const QuizSetup = ({ subjects, onStart }) => {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [difficulty,      setDifficulty]      = useState("");
  const [quizSize,        setQuizSize]        = useState(10);
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState(null);

  const handleStart = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = { limit: quizSize };
      if (selectedSubject) params.subjectId  = selectedSubject;
      if (difficulty)      params.difficulty = difficulty;
      const res = await quizAPI.getSigns(params);
      onStart({ signs: res.data, sessionId: res.sessionId });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-5">
      {/* Hero */}
      <div className="text-center space-y-3 animate-fade-up">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center
                     text-3xl mx-auto animate-float"
          style={{
            background: "var(--brand-light)",
            border: "1.5px solid rgba(108,99,255,0.2)",
          }}
        >
          🧠
        </div>
        <h1
          className="text-3xl font-black tracking-tight"
          style={{ fontFamily: "DM Sans, sans-serif", color: "var(--ink)" }}
        >
          Quiz <span className="text-gradient">Mode</span>
        </h1>
        <p className="text-sm" style={{ color: "var(--ink-muted)" }}>
          Test your sign language knowledge with flashcards
        </p>
      </div>

      {/* Config card */}
      <div className="card space-y-6 animate-fade-up delay-75">
        {/* Subject */}
        <div>
          <p className="section-label mb-2">Subject</p>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="input"
          >
            <option value="">All Subjects</option>
            {subjects?.map((s) => (
              <option key={s._id} value={s._id}>
                {s.icon} {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty */}
        <div>
          <p className="section-label mb-3">Difficulty</p>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "All",    value: "",             dot: null      },
              { label: "Easy",   value: "beginner",     dot: "#00c9a7" },
              { label: "Medium", value: "intermediate", dot: "#ffb627" },
              { label: "Hard",   value: "advanced",     dot: "#ff4d6d" },
            ].map((d) => (
              <button
                key={d.value}
                onClick={() => setDifficulty(d.value)}
                className="py-2.5 rounded-xl text-xs font-bold border
                           transition-all duration-200 hover:-translate-y-0.5
                           flex items-center justify-center gap-1.5"
                style={
                  difficulty === d.value
                    ? {
                        background:
                          "linear-gradient(135deg, #6c63ff, #4c3de4)",
                        color: "white",
                        border: "1.5px solid transparent",
                        boxShadow: "0 4px 12px rgba(108,99,255,0.3)",
                      }
                    : {
                        background: "var(--surface-2)",
                        color: "var(--ink-muted)",
                        border: "1.5px solid var(--border)",
                      }
                }
              >
                {d.dot && (
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: d.dot }}
                  />
                )}
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Card count */}
        <div>
          <p className="section-label mb-3">Number of Cards</p>
          <div className="grid grid-cols-4 gap-2">
            {QUIZ_SIZES.map((size) => (
              <button
                key={size}
                onClick={() => setQuizSize(size)}
                className="py-2.5 rounded-xl text-sm font-black border
                           transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  ...(quizSize === size
                    ? {
                        background:
                          "linear-gradient(135deg, #6c63ff, #4c3de4)",
                        color: "white",
                        border: "1.5px solid transparent",
                        boxShadow: "0 4px 12px rgba(108,99,255,0.3)",
                      }
                    : {
                        background: "var(--surface-2)",
                        color: "var(--ink-muted)",
                        border: "1.5px solid var(--border)",
                      }),
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div
            className="rounded-xl p-3 text-sm animate-scale-in"
            style={{
              background: "rgba(239,68,68,0.06)",
              border: "1px solid rgba(239,68,68,0.15)",
              color: "#dc2626",
            }}
          >
            {error}
          </div>
        )}

        <button
          onClick={handleStart}
          disabled={loading}
          className="btn-primary w-full py-3.5 text-base"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span
                className="w-4 h-4 rounded-full border-2
                           border-white/30 border-t-white animate-spin"
              />
              Loading signs...
            </span>
          ) : (
            "Start Quiz 🚀"
          )}
        </button>
      </div>

      <StatsPreview />
    </div>
  );
};

// ── Quiz Results ───────────────────────────────────────────────────────────────
const QuizResults = ({ results, total, onRestart }) => {
  const correct  = results.filter((r) => r.isCorrect).length;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  const [saved,  setSaved]  = useState(false);
  const [saving, setSaving] = useState(false);

  const save = useCallback(async () => {
    if (saved || saving) return;
    try {
      setSaving(true);
      await quizAPI.submitBatch({
        attempts:  results,
        sessionId: results[0]?.sessionId,
      });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }, [results, saved, saving]);

  useState(() => { save(); });

  const emoji =
    accuracy >= 80 ? "🏆"
    : accuracy >= 60 ? "🎯"
    : accuracy >= 40 ? "💪"
    : "📚";

  const accentColor =
    accuracy >= 80 ? "#00a88a"
    : accuracy >= 60 ? "#ffb627"
    : "#dc2626";

  return (
    <div className="max-w-lg mx-auto space-y-5 animate-fade-up">
      {/* Score card */}
      <div className="card text-center py-8 space-y-4">
        <div className="text-6xl animate-bounce-soft">{emoji}</div>
        <div>
          <p
            className="text-6xl font-black"
            style={{
              fontFamily: "DM Sans, sans-serif",
              color: accentColor,
            }}
          >
            {accuracy}%
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--ink-muted)" }}>
            {correct} of {total} correct
          </p>
        </div>

        {/* Progress bar */}
        <div
          className="h-3 rounded-full overflow-hidden mx-4"
          style={{ background: "var(--surface-2)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${accuracy}%`,
              background: `linear-gradient(90deg, ${accentColor}, ${accentColor}99)`,
            }}
          />
        </div>

        <p className="text-sm" style={{ color: "var(--ink-muted)" }}>
          {accuracy >= 80
            ? "Excellent! You're mastering sign language! 🌟"
            : accuracy >= 60
            ? "Good job! Keep practicing to improve."
            : accuracy >= 40
            ? "You're getting there! Review the Library."
            : "Keep going! Check the Library to study signs."}
        </p>

        {/* Save status */}
        <p className="text-xs" style={{ color: "var(--ink-faint)" }}>
          {saving && "Saving results..."}
          {saved && (
            <span style={{ color: "#00a88a" }}>✅ Results saved</span>
          )}
        </p>
      </div>

      {/* Breakdown */}
      <div className="card">
        <p
          className="section-label mb-4"
        >
          Card Breakdown
        </p>
        <div
          className="space-y-2 max-h-56 overflow-y-auto
                     scrollbar-hide pr-1"
        >
          {results.map((r, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-3.5
                         py-2.5 rounded-xl text-sm font-semibold
                         animate-fade-up"
              style={{
                animationDelay: `${i * 30}ms`,
                background: r.isCorrect
                  ? "rgba(0,201,167,0.08)"
                  : "rgba(239,68,68,0.06)",
                color: r.isCorrect ? "#00a88a" : "#dc2626",
                border: `1px solid ${
                  r.isCorrect
                    ? "rgba(0,201,167,0.2)"
                    : "rgba(239,68,68,0.15)"
                }`,
              }}
            >
              <span style={{ fontFamily: "DM Sans, sans-serif" }}>
                {i + 1}. {r.signName}
              </span>
              <span>{r.isCorrect ? "✅" : "❌"}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button onClick={onRestart} className="btn-secondary flex-1">
          Change Settings
        </button>
        <button onClick={onRestart} className="btn-primary flex-1">
          Quiz Again 🔄
        </button>
      </div>
    </div>
  );
};

// ── Main Quiz Page ─────────────────────────────────────────────────────────────
const Quiz = () => {
  const [phase,        setPhase]        = useState("setup");
  const [signs,        setSigns]        = useState([]);
  const [sessionId,    setSessionId]    = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results,      setResults]      = useState([]);
  const [isAnswered,   setIsAnswered]   = useState(false);
  const [userWasCorrect, setUserWasCorrect] = useState(null);
  const startTimeRef = useRef(null);

  const { data: subjects, loading, error } = useApi(
    subjectAPI.getAll, null, []
  );

  const handleStart = ({ signs, sessionId }) => {
    setSigns(signs);
    setSessionId(sessionId);
    setCurrentIndex(0);
    setResults([]);
    setIsAnswered(false);
    setUserWasCorrect(null);
    startTimeRef.current = Date.now();
    setPhase("playing");
  };

  const handleAnswer = (isCorrect) => {
    const timeTakenMs = Date.now() - startTimeRef.current;
    const sign = signs[currentIndex];
    setUserWasCorrect(isCorrect);
    setIsAnswered(true);
    setResults((prev) => [
      ...prev,
      {
        signId:      sign._id,
        subjectId:   sign.subjectId,
        signName:    sign.name,
        isCorrect,
        timeTakenMs,
        sessionId,
      },
    ]);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= signs.length) {
      setPhase("results");
    } else {
      setCurrentIndex((p) => p + 1);
      setIsAnswered(false);
      setUserWasCorrect(null);
      startTimeRef.current = Date.now();
    }
  };

  const handleRestart = () => {
    setPhase("setup");
    setSigns([]);
    setSessionId(null);
    setCurrentIndex(0);
    setResults([]);
    setIsAnswered(false);
    setUserWasCorrect(null);
  };

  if (phase === "setup") {
    if (loading) return <Loader text="Loading quiz options..." />;
    if (error)   return <ErrorMessage message={error} />;
    return <QuizSetup subjects={subjects} onStart={handleStart} />;
  }

  if (phase === "results") {
    return (
      <QuizResults
        results={results}
        total={signs.length}
        onRestart={handleRestart}
      />
    );
  }

  const currentSign = signs[currentIndex];
  const progress    = ((currentIndex + (isAnswered ? 1 : 0)) /
                        signs.length) * 100;

  return (
    <div className="max-w-lg mx-auto space-y-6 animate-fade-up">

      {/* ── Progress Header ── */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleRestart}
          className="flex items-center gap-1.5 text-sm font-semibold
                     transition-colors duration-200"
          style={{ color: "var(--ink-muted)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--ink)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--ink-muted)")
          }
        >
          ← Exit
        </button>

        <div
          className="px-4 py-1.5 rounded-full text-sm font-bold"
          style={{
            background: "var(--surface-2)",
            color: "var(--ink-muted)",
            fontFamily: "DM Sans, sans-serif",
          }}
        >
          {currentIndex + 1} / {signs.length}
        </div>

        <div className="flex items-center gap-2 text-sm font-bold">
          <span style={{ color: "#00a88a" }}>
            ✅ {results.filter((r) => r.isCorrect).length}
          </span>
          <span style={{ color: "var(--border-2)" }}>/</span>
          <span style={{ color: "#dc2626" }}>
            ❌ {results.filter((r) => !r.isCorrect).length}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ background: "var(--surface-3)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg, #6c63ff, #9c4dff)",
          }}
        />
      </div>

      {/* ── Flashcard ── */}
      <Flashcard
        key={currentSign._id}
        sign={currentSign}
        onAnswer={handleAnswer}
        isAnswered={isAnswered}
        userWasCorrect={userWasCorrect}
      />

      {/* ── Next Button ── */}
      {isAnswered && (
        <button
          onClick={handleNext}
          className="btn-primary w-full py-3.5 text-base animate-bounce-soft"
        >
          {currentIndex + 1 >= signs.length
            ? "See Results 🏆"
            : "Next Card →"}
        </button>
      )}
    </div>
  );
};

export default Quiz;