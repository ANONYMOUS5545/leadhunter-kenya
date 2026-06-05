"use client";
import { Search, SlidersHorizontal, RefreshCw } from "lucide-react";
import { Input, Select, Button } from "@/components/ui/index";
import { CITIES, INDUSTRIES } from "@/lib/utils";

interface FilterBarProps {
  city: string;
  industry: string;
  search: string;
  onCityChange: (v: string) => void;
  onIndustryChange: (v: string) => void;
  onSearchChange: (v: string) => void;
  onRefresh: () => void;
  loading?: boolean;
  totalResults?: number;
}

export function FilterBar({
  city,
  industry,
  search,
  onCityChange,
  onIndustryChange,
  onSearchChange,
  onRefresh,
  loading,
  totalResults,
}: FilterBarProps) {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: "16px 20px",
        display: "flex",
        gap: 12,
        alignItems: "flex-end",
        flexWrap: "wrap",
      }}
    >
      <div style={{ flex: "1 1 200px" }}>
        <Input
          label="Search businesses"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          icon={<Search size={14} />}
        />
      </div>

      <div style={{ flex: "0 1 160px" }}>
        <Select
          label="City"
          value={city}
          onChange={(e) => onCityChange(e.target.value)}
          options={[
            { value: "", label: "All Cities" },
            ...CITIES.map((c) => ({ value: c, label: c })),
          ]}
        />
      </div>

      <div style={{ flex: "0 1 200px" }}>
        <Select
          label="Industry"
          value={industry}
          onChange={(e) => onIndustryChange(e.target.value)}
          options={[
            { value: "", label: "All Industries" },
            ...INDUSTRIES.map((i) => ({ value: i.id, label: i.name })),
          ]}
        />
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Button
          variant="secondary"
          size="md"
          onClick={onRefresh}
          loading={loading}
        >
          <RefreshCw size={14} />
          Refresh
        </Button>
        {totalResults !== undefined && (
          <span
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              whiteSpace: "nowrap",
            }}
          >
            {totalResults.toLocaleString()} leads
          </span>
        )}
      </div>
    </div>
  );
}
