"use client";

import React from "react";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center" | "center-mobile-left";
  compact?: boolean;
  className?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  compact = false,
  className = "",
}: SectionHeaderProps) {
  const alignClass =
    align === "center"
      ? "text-center items-center"
      : align === "center-mobile-left"
        ? "text-center items-center sm:text-left sm:items-start"
        : "text-left items-start";

  return (
    <div
      className={`flex flex-col ${compact ? "gap-0.5 mb-0" : "gap-2 mb-8 sm:mb-10"} ${alignClass} ${className}`}
    >
      {eyebrow && (
        <span className={compact ? "text-[10px] font-[family-name:var(--font-display)] font-semibold uppercase tracking-wider text-[var(--accent)]" : "text-eyebrow"}>
          {eyebrow}
        </span>
      )}
      <h2 className={`text-display tracking-tight ${compact ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl lg:text-4xl"}`}>
        {title}
      </h2>
      {description && (
        <p className={`text-body max-w-2xl ${compact ? "text-xs sm:text-sm mt-0.5" : "text-sm sm:text-base mt-1"}`}>
          {description}
        </p>
      )}
      {!compact && (
        <div className={`section-divider w-full max-w-xs mt-3 ${align === "center" ? "mx-auto" : ""}`} />
      )}
    </div>
  );
}
