"use client";
import { cn } from "@/lib/utils";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  className?: string;
}

export function ScoreRing({
  score,
  size = 56,
  strokeWidth = 4,
  showLabel = true,
  className,
}: ScoreRingProps) {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 70 ? "#10b981" : score >= 40 ? "#f59e0b" : "#ef4444";
  const label =
    score >= 70 ? "Strong" : score >= 40 ? "Medium" : "Weak";

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg
          width={size}
          height={size}
          style={{ transform: "rotate(-90deg)" }}
        >
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
          />
          {/* Progress ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.8s ease" }}
          />
        </svg>
        {/* Score number */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: size > 50 ? "14px" : "11px",
            fontWeight: 700,
            fontFamily: "var(--font-display)",
            color,
          }}
        >
          {score}
        </div>
      </div>
      {showLabel && (
        <span
          style={{
            fontSize: "10px",
            fontWeight: 600,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color,
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
