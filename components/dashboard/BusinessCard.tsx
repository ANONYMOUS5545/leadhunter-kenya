"use client";
import { useState } from "react";
import {
  Phone,
  Mail,
  Globe,
  MapPin,
  Share2,
  Link2,
  Star,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  PhoneCall,
  Lock,
} from "lucide-react";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { Badge } from "@/components/ui/index";
import type { Business } from "@/lib/schema";
import type { ColdCallSuggestion } from "@/lib/schema";
import { truncate } from "@/lib/utils";

interface BusinessCardProps {
  business: Partial<Business> & {
    name: string;
    city: string;
    weaknesses?: string[];
    coldCallSuggestions?: ColdCallSuggestion[];
    onlinePresenceScore?: number;
    industryName?: string | null;
  };
  isDemo?: boolean;
  isLocked?: boolean;
}

export function BusinessCard({ business, isDemo, isLocked }: BusinessCardProps) {
  const [expanded, setExpanded] = useState(false);
  const score = business.onlinePresenceScore ?? 0;
  const weaknesses = (business.weaknesses as string[]) ?? [];
  const suggestions = (business.coldCallSuggestions as ColdCallSuggestion[]) ?? [];

  return (
    <div
      className="card"
      style={{
        padding: 20,
        transition: "all 0.2s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Demo watermark */}
      {isDemo && (
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
          }}
        >
          <span className="badge badge-cyan">Demo</span>
        </div>
      )}

      {/* Header row */}
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        <ScoreRing score={score} size={56} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 15,
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: 4,
              letterSpacing: "-0.01em",
            }}
          >
            {isLocked ? (
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Lock size={13} style={{ color: "var(--text-muted)" }} />
                {truncate(business.name, 20)}{"•".repeat(8)}
              </span>
            ) : (
              business.name
            )}
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            <span className="badge badge-blue">{business.city}</span>
            {business.industryName && (
              <span className="badge badge-purple">
                {business.industryName}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Contact info */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
          marginTop: 14,
        }}
      >
        {business.phone && (
          <ContactItem
            icon={<Phone size={12} />}
            value={isLocked ? "••• •••••••" : business.phone}
          />
        )}
        {business.email && (
          <ContactItem
            icon={<Mail size={12} />}
            value={isLocked ? "••••@••••.com" : business.email}
          />
        )}
        {business.website && (
          <ContactItem
            icon={<Globe size={12} />}
            value={isLocked ? "••••.co.ke" : business.website}
            href={isLocked ? undefined : business.website}
          />
        )}
        {business.address && (
          <ContactItem
            icon={<MapPin size={12} />}
            value={business.address}
          />
        )}
      </div>

      {/* Social & Google */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginTop: 12,
          flexWrap: "wrap",
        }}
      >
        {business.facebookUrl && (
          <SocialBadge
            icon={<Share2 size={11} />}
            label="Facebook"
            followers={business.facebookFollowers}
            color="#60a5fa"
            href={isLocked ? undefined : business.facebookUrl}
          />
        )}
        {business.instagramUrl && (
          <SocialBadge
            icon={<Link2 size={11} />}
            label="Instagram"
            followers={business.instagramFollowers}
            color="#c084fc"
            href={isLocked ? undefined : business.instagramUrl}
          />
        )}
        {business.googleRating && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              padding: "3px 8px",
              borderRadius: 100,
              background: "rgba(245,158,11,0.1)",
              border: "1px solid rgba(245,158,11,0.2)",
              fontSize: 11,
              fontWeight: 600,
              color: "#fbbf24",
            }}
          >
            <Star size={10} />
            {business.googleRating}
            {business.googleReviewCount !== undefined &&
              ` (${business.googleReviewCount})`}
          </div>
        )}
      </div>

      {/* Weaknesses preview */}
      {weaknesses.length > 0 && (
        <div style={{ marginTop: 14 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              fontFamily: "var(--font-display)",
              marginBottom: 6,
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <AlertTriangle size={11} style={{ color: "#fbbf24" }} />
            {weaknesses.length} weakness{weaknesses.length !== 1 ? "es" : ""} found
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {weaknesses.slice(0, expanded ? undefined : 2).map((w, i) => (
              <div
                key={i}
                style={{
                  fontSize: 12,
                  color: "var(--text-secondary)",
                  padding: "5px 10px",
                  background: "rgba(245,158,11,0.06)",
                  borderLeft: "2px solid rgba(245,158,11,0.3)",
                  borderRadius: "0 4px 4px 0",
                }}
              >
                {w}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cold call scripts */}
      {expanded && suggestions.length > 0 && !isLocked && (
        <div style={{ marginTop: 14 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              fontFamily: "var(--font-display)",
              marginBottom: 8,
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <PhoneCall size={11} style={{ color: "#60a5fa" }} />
            Cold Call Scripts
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {suggestions.slice(0, 2).map((s, i) => (
              <div
                key={i}
                style={{
                  padding: 12,
                  background: "rgba(59,130,246,0.05)",
                  border: "1px solid rgba(59,130,246,0.1)",
                  borderRadius: 8,
                }}
              >
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#60a5fa",
                    marginBottom: 6,
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {s.topic}
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--text-secondary)",
                    lineHeight: 1.5,
                    marginBottom: 6,
                  }}
                >
                  <strong style={{ color: "var(--text-primary)" }}>Opener:</strong> {s.opener}
                </p>
                <p
                  style={{
                    fontSize: 11,
                    color: "var(--text-muted)",
                    lineHeight: 1.5,
                  }}
                >
                  <strong style={{ color: "var(--text-secondary)" }}>CTA:</strong> {s.callToAction}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locked overlay hint */}
      {isLocked && (
        <div
          style={{
            marginTop: 12,
            padding: "8px 12px",
            background: "rgba(59,130,246,0.06)",
            border: "1px solid rgba(59,130,246,0.12)",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 12,
            color: "#60a5fa",
          }}
        >
          <Lock size={12} />
          Upgrade to unlock contact details & cold call scripts
        </div>
      )}

      {/* Expand toggle */}
      {(weaknesses.length > 2 || suggestions.length > 0) && !isLocked && (
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            marginTop: 10,
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontSize: 12,
            color: "var(--text-muted)",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "2px 0",
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--text-secondary)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--text-muted)")
          }
        >
          {expanded ? (
            <>
              <ChevronUp size={13} /> Show less
            </>
          ) : (
            <>
              <ChevronDown size={13} /> Show weaknesses & scripts
            </>
          )}
        </button>
      )}
    </div>
  );
}

function ContactItem({
  icon,
  value,
  href,
}: {
  icon: React.ReactNode;
  value: string;
  href?: string;
}) {
  const content = (
    <span
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        fontSize: 12,
        color: "var(--text-secondary)",
      }}
    >
      <span style={{ color: "var(--text-muted)", flexShrink: 0 }}>{icon}</span>
      <span
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          maxWidth: 140,
        }}
      >
        {value}
      </span>
    </span>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none" }}
      >
        {content}
      </a>
    );
  }
  return content;
}

function SocialBadge({
  icon,
  label,
  followers,
  color,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  followers?: number | null;
  color: string;
  href?: string;
}) {
  const badge = (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "3px 8px",
        borderRadius: 100,
        background: `${color}15`,
        border: `1px solid ${color}25`,
        fontSize: 11,
        fontWeight: 600,
        color,
        textDecoration: "none",
        cursor: href ? "pointer" : "default",
      }}
    >
      {icon}
      {label}
      {followers !== undefined && followers !== null && (
        <span style={{ opacity: 0.8 }}>
          {followers >= 1000 ? `${(followers / 1000).toFixed(1)}K` : followers}
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {badge}
      </a>
    );
  }
  return badge;
}
