import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface HalalLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  textClassName?: string;
  subtextClassName?: string;
}

export function HalalLogo({
  className,
  size = 36,
  showText = false,
  textClassName,
  subtextClassName,
}: HalalLogoProps) {
  return (
    <div className={cn("inline-flex items-center gap-2.5", className)}>
      <div
        className="relative shrink-0 flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <Image
          src="/images/halal-indonesia-logo.png"
          alt="Logo Halal Indonesia Resmi"
          width={size}
          height={size}
          className="object-contain w-full h-full drop-shadow-sm"
          priority
        />
      </div>
      {showText && (
        <div className="leading-tight text-left">
          <span
            className={cn(
              "font-heading font-extrabold text-base tracking-tight text-slate-900 block leading-tight",
              textClassName
            )}
          >
            SIP-HALAL
          </span>
          <span
            className={cn(
              "block text-[9px] uppercase font-bold tracking-widest text-[#b87d28]",
              subtextClassName
            )}
          >
            Halal Indonesia
          </span>
        </div>
      )}
    </div>
  );
}
