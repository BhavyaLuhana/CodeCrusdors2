// frontend/src/components/ui/ConfidenceBadge.jsx

import { formatConfidence } from "../../utils/helpers";

const ConfidenceBadge = ({ score }) => {
  if (score === null || score === undefined) return null;

  const getStyle = () => {
    if (score >= 0.8)
      return {
        background: "rgba(0,201,167,0.1)",
        color: "#00a88a",
        border: "1px solid rgba(0,201,167,0.25)",
      };
    if (score >= 0.6)
      return {
        background: "rgba(255,182,39,0.1)",
        color: "#c98600",
        border: "1px solid rgba(255,182,39,0.25)",
      };
    return {
      background: "rgba(239,68,68,0.1)",
      color: "#dc2626",
      border: "1px solid rgba(239,68,68,0.2)",
    };
  };

  return (
    <span className="badge animate-scale-in" style={getStyle()}>
      {score >= 0.8 ? "✓ " : score >= 0.6 ? "~ " : "✗ "}
      {formatConfidence(score)}
    </span>
  );
};

export default ConfidenceBadge;