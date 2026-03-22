// frontend/src/pages/NotFound.jsx

import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col items-center justify-center
                 min-h-[70vh] text-center gap-6 animate-scale-in"
    >
      <div className="animate-float text-7xl">🤷</div>
      <div>
        <p
          className="text-8xl font-black mb-2 select-none"
          style={{
            fontFamily: "DM Sans, sans-serif",
            color: "var(--border)",
          }}
        >
          404
        </p>
        <h2
          className="text-2xl font-bold mb-2"
          style={{ color: "var(--ink)", fontFamily: "DM Sans, sans-serif" }}
        >
          Page Not Found
        </h2>
        <p className="text-sm max-w-sm" style={{ color: "var(--ink-muted)" }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>
      <div className="flex gap-3">
        <button onClick={() => navigate(-1)} className="btn-secondary">
          ← Go Back
        </button>
        <button onClick={() => navigate("/")} className="btn-primary">
          🏠 Go Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;