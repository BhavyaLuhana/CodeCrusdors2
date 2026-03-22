// frontend/src/components/ui/ErrorMessage.jsx

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div
      className="flex flex-col items-center justify-center gap-5
                 py-16 animate-scale-in"
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center
                   text-3xl"
        style={{ background: "var(--surface-2)",
                 border: "1.5px solid var(--border)" }}
      >
        ⚠️
      </div>
      <div className="text-center">
        <h3
          className="text-lg font-bold mb-1"
          style={{ color: "var(--ink)", fontFamily: "DM Sans, sans-serif" }}
        >
          Something went wrong
        </h3>
        <p className="text-sm max-w-md" style={{ color: "var(--ink-muted)" }}>
          {message || "An unexpected error occurred. Please try again."}
        </p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary">
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;