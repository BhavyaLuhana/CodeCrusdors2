// frontend/src/components/ui/Loader.jsx

const Loader = ({ size = "md", text = "Loading..." }) => {
  const sizes = {
    sm: "h-5 w-5 border-2",
    md: "h-9 w-9 border-[2.5px]",
    lg: "h-14 w-14 border-[3px]",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16
                    animate-fade-in">
      <div className="relative">
        <div
          className={`animate-spin rounded-full ${sizes[size]}`}
          style={{
            borderColor: "var(--border)",
            borderTopColor: "var(--brand)",
          }}
        />
        {/* Glow ring */}
        <div
          className={`absolute inset-0 rounded-full ${sizes[size]}
                      animate-pulse-glow opacity-30`}
          style={{ borderColor: "transparent",
                   boxShadow: "0 0 12px rgba(108,99,255,0.5)" }}
        />
      </div>
      {text && (
        <p
          className="text-sm font-medium animate-pulse"
          style={{ color: "var(--ink-faint)" }}
        >
          {text}
        </p>
      )}
    </div>
  );
};

export default Loader;