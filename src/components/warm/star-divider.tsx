import React from "react";

interface StarDividerProps {
  subtitle?: string;
  title: string;
  className?: string;
  dark?: boolean;
}

export function StarDivider({
  subtitle,
  title,
  className = "",
  dark = false,
}: StarDividerProps) {
  return (
    <div className={`text-center space-y-2.5 max-w-2xl mx-auto ${className}`}>
      {/* 8-Point Islamic Star Motif */}
      <div className="inline-flex items-center justify-center">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          className="text-[#e5a952]"
        >
          <path
            d="M12 2L14.5 7.5L20 8.5L16 13L17 19L12 16L7 19L8 13L4 8.5L9.5 7.5L12 2Z"
            fill="currentColor"
            opacity="0.85"
          />
          <circle cx="12" cy="12" r="3" fill="#ffffff" />
          <circle cx="12" cy="12" r="1.5" fill="#e5a952" />
        </svg>
      </div>

      {subtitle && (
        <p
          className={`text-xs font-semibold uppercase tracking-widest ${
            dark ? "text-[#e5a952]" : "text-[#b87d28]"
          }`}
        >
          {subtitle}
        </p>
      )}

      <h2
        className={`font-heading font-bold text-2xl sm:text-3xl lg:text-4xl tracking-tight ${
          dark ? "text-white" : "text-slate-900"
        }`}
      >
        {title}
      </h2>
    </div>
  );
}
