import * as XLSX from "xlsx";
import type { Business } from "./schema";

export function exportBusinessesToExcel(businesses: Business[]): Buffer {
  const worksheetData = [
    // Header row
    [
      "Business Name",
      "City",
      "Industry",
      "Phone",
      "Email",
      "Website",
      "Address",
      "Facebook",
      "Instagram",
      "TikTok",
      "Twitter",
      "LinkedIn",
      "FB Followers",
      "IG Followers",
      "Google Rating",
      "Google Reviews",
      "Online Presence Score",
      "Weaknesses",
      "Cold Call Topic 1",
      "Cold Call Opener 1",
      "Data Source",
    ],
    // Data rows
    ...businesses.map((b) => {
      const weaknesses = Array.isArray(b.weaknesses)
        ? (b.weaknesses as string[]).join(" | ")
        : "";
      const suggestions = Array.isArray(b.coldCallSuggestions)
        ? b.coldCallSuggestions
        : [];
      const firstSuggestion = suggestions[0] as {
        topic?: string;
        opener?: string;
      } | undefined;

      return [
        b.name,
        b.city,
        b.industryName || "",
        b.phone || "",
        b.email || "",
        b.website || "",
        b.address || "",
        b.facebookUrl || "",
        b.instagramUrl || "",
        b.tiktokUrl || "",
        b.twitterUrl || "",
        b.linkedinUrl || "",
        b.facebookFollowers || "",
        b.instagramFollowers || "",
        b.googleRating || "",
        b.googleReviewCount || "",
        b.onlinePresenceScore || 0,
        weaknesses,
        firstSuggestion?.topic || "",
        firstSuggestion?.opener || "",
        b.dataSource || "",
      ];
    }),
  ];

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Style header row
  worksheet["!cols"] = [
    { wch: 30 }, // Business Name
    { wch: 12 }, // City
    { wch: 25 }, // Industry
    { wch: 18 }, // Phone
    { wch: 30 }, // Email
    { wch: 35 }, // Website
    { wch: 40 }, // Address
    { wch: 35 }, // Facebook
    { wch: 35 }, // Instagram
    { wch: 35 }, // TikTok
    { wch: 35 }, // Twitter
    { wch: 35 }, // LinkedIn
    { wch: 12 }, // FB Followers
    { wch: 12 }, // IG Followers
    { wch: 14 }, // Rating
    { wch: 14 }, // Reviews
    { wch: 16 }, // Score
    { wch: 80 }, // Weaknesses
    { wch: 40 }, // Cold Call Topic
    { wch: 80 }, // Cold Call Opener
    { wch: 20 }, // Source
  ];

  XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");

  // Second sheet: Cold Call Scripts
  const scriptData = [
    ["Business Name", "City", "Industry", "Topic", "Opener", "Pain Point", "Value Proposition", "Call to Action"],
    ...businesses.flatMap((b) => {
      const suggestions = Array.isArray(b.coldCallSuggestions)
        ? b.coldCallSuggestions
        : [];
      return (suggestions as Array<{topic?: string; opener?: string; painPoint?: string; valueProposition?: string; callToAction?: string}>).map((s) => [
        b.name,
        b.city,
        b.industryName || "",
        s.topic || "",
        s.opener || "",
        s.painPoint || "",
        s.valueProposition || "",
        s.callToAction || "",
      ]);
    }),
  ];

  const scriptSheet = XLSX.utils.aoa_to_sheet(scriptData);
  scriptSheet["!cols"] = [
    { wch: 30 }, { wch: 12 }, { wch: 25 }, { wch: 40 },
    { wch: 80 }, { wch: 60 }, { wch: 80 }, { wch: 60 },
  ];
  XLSX.utils.book_append_sheet(workbook, scriptSheet, "Cold Call Scripts");

  return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }) as Buffer;
}
