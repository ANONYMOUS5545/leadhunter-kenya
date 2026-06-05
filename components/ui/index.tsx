"use client";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

// ─── Badge ───────────────────────────────────────────────────────────────────
type BadgeVariant = "blue" | "green" | "amber" | "red" | "purple" | "cyan" | "muted";

export function Badge({
  children,
  variant = "blue",
  className,
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span className={cn(`badge badge-${variant}`, className)}>{children}</span>
  );
}

// ─── Button ──────────────────────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const variantClasses = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white",
    secondary: "bg-transparent border border-white/10 hover:bg-white/5 text-white",
    danger: "bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400",
    ghost: "bg-transparent hover:bg-white/5 text-[var(--text-secondary)]",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center gap-2 rounded-lg font-semibold transition-all duration-200",
        "font-[family-name:var(--font-display)]",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 size={14} className="animate-spin" />}
      {children}
    </button>
  );
}

// ─── Input ───────────────────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function Input({ label, error, icon, className, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && <label className="label">{label}</label>}
      <div style={{ position: "relative" }}>
        {icon && (
          <div
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
              pointerEvents: "none",
            }}
          >
            {icon}
          </div>
        )}
        <input
          className={cn("input", icon && "pl-10", className)}
          {...props}
        />
      </div>
      {error && (
        <p style={{ fontSize: 12, color: "var(--danger)", marginTop: 4 }}>
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Select ──────────────────────────────────────────────────────────────────
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className, ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && <label className="label">{label}</label>}
      <select
        className={cn("input", className)}
        style={{ cursor: "pointer" }}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ─── Card ────────────────────────────────────────────────────────────────────
export function Card({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      className={cn("card", className)}
      onClick={onClick}
      style={onClick ? { cursor: "pointer" } : undefined}
    >
      {children}
    </div>
  );
}

// ─── Stat Card ───────────────────────────────────────────────────────────────
export function StatCard({
  label,
  value,
  icon,
  trend,
  color = "blue",
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  color?: "blue" | "green" | "amber" | "purple";
}) {
  const colorMap = {
    blue: "rgba(59,130,246,0.1)",
    green: "rgba(16,185,129,0.1)",
    amber: "rgba(245,158,11,0.1)",
    purple: "rgba(168,85,247,0.1)",
  };
  const textMap = {
    blue: "#60a5fa",
    green: "#34d399",
    amber: "#fbbf24",
    purple: "#c084fc",
  };

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              marginBottom: 8,
              fontFamily: "var(--font-display)",
            }}
          >
            {label}
          </p>
          <p
            style={{
              fontSize: 28,
              fontWeight: 800,
              fontFamily: "var(--font-display)",
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
            }}
          >
            {value}
          </p>
          {trend && (
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
              {trend}
            </p>
          )}
        </div>
        <div
          style={{
            padding: 10,
            borderRadius: 10,
            background: colorMap[color],
            color: textMap[color],
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

// ─── Empty State ─────────────────────────────────────────────────────────────
export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "64px 24px",
        textAlign: "center",
        gap: 12,
        color: "var(--text-muted)",
      }}
    >
      <div style={{ fontSize: 48 }}>{icon}</div>
      <h3
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: "var(--text-secondary)",
          fontFamily: "var(--font-display)",
        }}
      >
        {title}
      </h3>
      <p style={{ fontSize: 13, maxWidth: 320 }}>{description}</p>
      {action && <div style={{ marginTop: 8 }}>{action}</div>}
    </div>
  );
}

// ─── Skeleton ────────────────────────────────────────────────────────────────
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton", className)} />;
}
