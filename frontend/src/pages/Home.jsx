// frontend/src/pages/Home.jsx

import { useState, useCallback, useRef } from "react";
import { useAuth, SignInButton } from "@clerk/clerk-react";
import WebcamCapture from "../components/home/WebcamCapture";
import ConfidenceBadge from "../components/ui/ConfidenceBadge";
import { historyAPI } from "../api/api";

const STABLE_FRAMES_REQUIRED = 6;
const SPACE_DELAY_MS          = 1500;
const CAPTURE_INTERVAL_MS     = 300;

// ── Feature card for landing ───────────────────────────────────────────────
const FeatureCard = ({ icon, title, desc, delay }) => (
  <div
    className="card card-hover animate-fade-up cursor-default"
    style={{ animationDelay: delay }}
  >
    <div
      className="w-11 h-11 rounded-xl flex items-center justify-center
                 text-2xl mb-4"
      style={{ background: "var(--brand-light)" }}
    >
      {icon}
    </div>
    <h3
      className="font-bold mb-1.5"
      style={{ color: "var(--ink)", fontFamily: "DM Sans, sans-serif" }}
    >
      {title}
    </h3>
    <p className="text-sm leading-relaxed" style={{ color: "var(--ink-muted)" }}>
      {desc}
    </p>
  </div>
);

const Home = () => {
  const { isSignedIn } = useAuth();

  const [isCapturing, setIsCapturing] = useState(false);
  const [currentLetter, setCurrentLetter] = useState("");
  const [currentWord, setCurrentWord] = useState("");
  const [sentence, setSentence] = useState("");
  const [confidence, setConfidence] = useState(null);
  const [loading, setLoading]= useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [stableCount, setStableCount] = useState(0);

  const stableCountRef       = useRef(0);
  const lastPredictedRef     = useRef("");
  const acceptedLetterRef    = useRef("");
  const lastConfidentTimeRef = useRef(Date.now());
  const spaceAddedRef        = useRef(false);
  const currentWordRef       = useRef("");

  const handleCapture = useCallback(async (imageSrc) => {
    if (loading) return;
    try {
      setLoading(true);
      setError(null);
      const response = await historyAPI.predict(imageSrc);
      const { predictedSign, confidenceScore } = response.data;
      setConfidence(confidenceScore);
      const now = Date.now();

      if (response.data.metadata?.is_confident) {
        lastConfidentTimeRef.current = now;
        setCurrentLetter(predictedSign);
        if (predictedSign === lastPredictedRef.current) {
          stableCountRef.current += 1;
        } else {
          stableCountRef.current   = 1;
          lastPredictedRef.current = predictedSign;
        }
        setStableCount(stableCountRef.current);
        if (stableCountRef.current === STABLE_FRAMES_REQUIRED &&
            predictedSign !== acceptedLetterRef.current) {
          currentWordRef.current    += predictedSign;
          acceptedLetterRef.current  = predictedSign;
          spaceAddedRef.current      = false;
          setCurrentWord(currentWordRef.current);
        }
      } else {
        setCurrentLetter("—");
        if (currentWordRef.current && !spaceAddedRef.current &&
            now - lastConfidentTimeRef.current > SPACE_DELAY_MS) {
          setSentence((prev) => prev + currentWordRef.current + " ");
          currentWordRef.current    = "";
          acceptedLetterRef.current = "";
          lastPredictedRef.current  = "";
          stableCountRef.current    = 0;
          spaceAddedRef.current     = true;
          setCurrentWord("");
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const handleStartStop = () => {
    if (isCapturing && currentWordRef.current) {
      setSentence((prev) => prev + currentWordRef.current);
      currentWordRef.current = "";
      setCurrentWord("");
    }
    setIsCapturing((prev) => !prev);
    setCurrentLetter("");
    setError(null);
  };

  const handleClear = () => {
    setSentence("");
    setCurrentWord("");
    setCurrentLetter("");
    setConfidence(null);
    currentWordRef.current    = "";
    acceptedLetterRef.current = "";
    lastPredictedRef.current  = "";
    stableCountRef.current    = 0;
    spaceAddedRef.current     = false;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(sentence + currentWord);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Landing ──────────────────────────────────────────────────────────────
  if (!isSignedIn) {
    return (
      <div className="space-y-20">
        {/* Hero */}
        <div className="text-center space-y-6 pt-10">
          {/* Floating badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2
                          rounded-full border animate-fade-in"
               style={{ background: "var(--brand-light)",
                        borderColor: "rgba(108,99,255,0.2)",
                        color: "var(--brand)" }}>
            <span className="w-2 h-2 rounded-full bg-current
                             animate-pulse" />
            <span className="text-sm font-semibold">
              AI-Powered Sign Recognition
            </span>
          </div>

          <h1
            className="text-5xl sm:text-7xl font-black tracking-tight
                       animate-fade-up"
            style={{ fontFamily: "DM Sans, sans-serif",
                     color: "var(--ink)" }}
          >
            Learn Signs
            <br />
            <span className="text-gradient">Effortlessly</span>
          </h1>

          <p
            className="text-lg max-w-xl mx-auto leading-relaxed
                       animate-fade-up delay-150"
            style={{ color: "var(--ink-muted)" }}
          >
            Show your hand to the camera. Our CNN model recognizes
            Indian Sign Language letters in real-time and builds
            complete sentences.
          </p>

          <div className="flex items-center justify-center gap-3
                          animate-fade-up delay-300">
            <SignInButton mode="modal">
              <button className="btn-primary text-base px-8 py-3">
                Start Learning →
              </button>
            </SignInButton>
            <a href="/library">
              <button className="btn-secondary text-base px-6 py-3">
                Browse Library
              </button>
            </a>
          </div>

          {/* Floating emoji row */}
          <div className="flex items-center justify-center gap-6
                          pt-4 animate-fade-up delay-400">
            {["🤟", "✋", "🤙", "👌", "🖐️"].map((e, i) => (
              <span
                key={i}
                className="text-3xl animate-float"
                style={{ animationDelay: `${i * 0.4}s` }}
              >
                {e}
              </span>
            ))}
          </div>
        </div>

        {/* Feature grid */}
        <div>
          <p
            className="section-label text-center mb-8 animate-fade-in"
          >
            Everything you need
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
                          gap-4">
            <FeatureCard
              icon="📷"
              title="Real-time Detection"
              desc="CNN model detects signs frame by frame with 6-frame stability check."
              delay="0ms"
            />
            <FeatureCard
              icon="🔤"
              title="35 Signs Supported"
              desc="Numbers 1–9 and all A–Z letters of the Indian Sign Language."
              delay="75ms"
            />
            <FeatureCard
              icon="🧠"
              title="Quiz Mode"
              desc="Test yourself with flashcards. Track accuracy across sessions."
              delay="150ms"
            />
            <FeatureCard
              icon="📚"
              title="Sign Library"
              desc="Browse all signs organized by subject with meanings and keywords."
              delay="225ms"
            />
          </div>
        </div>
      </div>
    );
  }

  // ── Main Detector ─────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div className="animate-fade-up">
        <h1
          className="text-3xl font-black tracking-tight"
          style={{ fontFamily: "DM Sans, sans-serif", color: "var(--ink)" }}
        >
          Sign{" "}
          <span className="text-gradient">Detector</span>
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--ink-muted)" }}>
          Hold a sign steady for 6 frames to register a letter
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* ── Webcam ── */}
        <div className="lg:col-span-3 space-y-4 animate-fade-up delay-75">
          <WebcamCapture
            onCapture={handleCapture}
            isCapturing={isCapturing}
            interval={CAPTURE_INTERVAL_MS}
            stableCount={stableCount}        // ← add
            maxStable={STABLE_FRAMES_REQUIRED}
          />

          <div className="flex gap-3">
            <button
              onClick={handleStartStop}
              className="flex-1 py-3 rounded-full font-bold text-sm
                         transition-all duration-300"
              style={isCapturing ? {
                background: "linear-gradient(135deg,#ef4444,#dc2626)",
                color: "white",
                boxShadow: "0 4px 16px rgba(239,68,68,0.3)",
              } : {}}
              {...(!isCapturing && { className: "flex-1 py-3 btn-primary" })}
            >
              {isCapturing ? "⏹ Stop Detection" : "▶ Start Detection"}
            </button>
            <button
              onClick={handleClear}
              className="btn-secondary px-5"
              disabled={!sentence && !currentWord}
            >
              Clear
            </button>
          </div>

          {error && (
            <div
              className="rounded-xl p-3.5 text-sm animate-scale-in"
              style={{
                background: "rgba(239,68,68,0.06)",
                border: "1px solid rgba(239,68,68,0.15)",
                color: "#dc2626",
              }}
            >
              {error}
            </div>
          )}
        </div>

        {/* ── Results ── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Letter display */}
          <div
            className="card text-center py-8 animate-fade-up delay-150
                       relative overflow-hidden"
          >
            {/* Background glow */}
            {currentLetter && currentLetter !== "—" && (
              <div
                className="absolute inset-0 opacity-5 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at center, var(--brand) 0%, transparent 70%)",
                }}
              />
            )}
            <p className="section-label mb-3">Detecting</p>
            <div
              className="text-9xl font-black leading-none min-h-[108px]
                         flex items-center justify-center transition-all
                         duration-200"
              style={{
                fontFamily: "DM Sans, sans-serif",
                color: currentLetter && currentLetter !== "—"
                  ? "var(--brand)"
                  : "var(--border-2)",
              }}
            >
              {currentLetter || "—"}
            </div>
            <div className="mt-3 min-h-[22px] flex justify-center">
              <ConfidenceBadge score={confidence} />
            </div>
          </div>

          {/* Word */}
          <div className="card animate-fade-up delay-225">
            <p className="section-label mb-2">Current Word</p>
            <p
              className="text-3xl font-black tracking-[0.15em] min-h-[44px]
                         transition-all duration-200"
              style={{
                fontFamily: "DM Sans, sans-serif",
                color: currentWord ? "var(--ink)" : "var(--border-2)",
              }}
            >
              {currentWord || "···"}
            </p>
          </div>

          {/* Sentence */}
          <div className="card animate-fade-up delay-300">
            <div className="flex items-center justify-between mb-2">
              <p className="section-label">Sentence</p>
              {(sentence || currentWord) && (
                <button
                  onClick={handleCopy}
                  className="text-xs font-semibold transition-all duration-200"
                  style={{
                    color: copied ? "#00a88a" : "var(--brand)",
                  }}
                >
                  {copied ? "✓ Copied!" : "Copy"}
                </button>
              )}
            </div>
            <p
              className="text-base leading-relaxed min-h-[26px]
                         transition-all duration-200"
              style={{
                color: (sentence || currentWord)
                  ? "var(--ink)"
                  : "var(--border-2)",
              }}
            >
              {sentence + currentWord || "Your sentence appears here..."}
            </p>
          </div>

          {/* Tips */}
          <div
            className="rounded-xl p-4 animate-fade-up delay-400"
            style={{
              background: "var(--brand-light)",
              border: "1px solid rgba(108,99,255,0.12)",
            }}
          >
            <p
              className="text-xs font-bold mb-2"
              style={{ color: "var(--brand)", fontFamily: "DM Sans, sans-serif" }}
            >
              💡 How it works
            </p>
            <ul className="text-xs space-y-1.5"
                style={{ color: "var(--ink-muted)" }}>
              <li>• Hold sign steady — registers after 6 stable frames</li>
              <li>• Pause your hand 1.5s to add a space</li>
              <li>• Good lighting improves accuracy significantly</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;