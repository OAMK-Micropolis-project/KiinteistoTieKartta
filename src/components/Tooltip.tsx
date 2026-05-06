import React, { useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";

type TooltipProps = {
  label: React.ReactNode;
  children: React.ReactNode;
  minWidth?: number;
  maxWidth?: number;
  placement?: "bottom" | "top";
  offset?: number;
  zIndex?: number;
};

const baseStyles = {
  wrapper: {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
  } as CSSProperties,

  target: {
    outline: "none",
    cursor: "help",
    display: "inline-flex",
    alignItems: "center",
  } as CSSProperties,

  bubble: {
    position: "fixed", // ✅ fixed = suhteessa viewportiin
    background: "rgba(17, 24, 39, 0.95)",
    color: "#ffffff",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "10px",
    padding: "10px 12px",
    fontSize: "12px",
    lineHeight: 1.35,
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    pointerEvents: "auto",
  } as CSSProperties,

  arrow: {
    position: "absolute",
    width: "10px",
    height: "10px",
    transform: "rotate(45deg)",
    background: "rgba(17, 24, 39, 0.95)",
    borderLeft: "1px solid rgba(255,255,255,0.08)",
    borderTop: "1px solid rgba(255,255,255,0.08)",
  } as CSSProperties,
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function Tooltip({
  label,
  children,
  minWidth = 240,
  maxWidth = 360,
  placement = "bottom",
  offset = 8,
  zIndex = 9999,
}: TooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);

  const targetRef = useRef<HTMLSpanElement | null>(null);
  const bubbleRef = useRef<HTMLSpanElement | null>(null);

  const [pos, setPos] = useState<{
    top: number;
    left: number;
    actualPlacement: "bottom" | "top";
    arrowLeft: number; // nuolen x bubbleen sisällä
  } | null>(null);

  useLayoutEffect(() => {
    if (!open) return;

    const targetEl = targetRef.current;
    const bubbleEl = bubbleRef.current;
    if (!targetEl || !bubbleEl) return;

    const margin = 12; // etäisyys viewportin reunoista

    const targetRect = targetEl.getBoundingClientRect();

    // Asetetaan ensin maxWidth/minWidth jotta mittaus on oikein
    bubbleEl.style.minWidth = `${minWidth}px`;
    bubbleEl.style.maxWidth = `${maxWidth}px`;

    const bubbleRect = bubbleEl.getBoundingClientRect();

    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;

    const targetCenterX = targetRect.left + targetRect.width / 2;

    // Ehdotettu left keskelle
    let left = targetCenterX - bubbleRect.width / 2;
    // ✅ clamp ikkunan sisään
    left = clamp(left, margin, viewportW - bubbleRect.width - margin);

    // placement flip jos alhaalla ei tilaa
    const spaceBelow = viewportH - targetRect.bottom;
    const spaceAbove = targetRect.top;

    let actualPlacement: "bottom" | "top" = placement;

    if (placement === "bottom" && spaceBelow < bubbleRect.height + offset && spaceAbove > bubbleRect.height + offset) {
      actualPlacement = "top";
    }
    if (placement === "top" && spaceAbove < bubbleRect.height + offset && spaceBelow > bubbleRect.height + offset) {
      actualPlacement = "bottom";
    }

    let top =
      actualPlacement === "bottom"
        ? targetRect.bottom + offset
        : targetRect.top - bubbleRect.height - offset;

    // clamp myös y-suuntaan varmuuden vuoksi
    top = clamp(top, margin, viewportH - bubbleRect.height - margin);

    // Nuolen paikka bubbleen sisällä: kohdista targetin keskelle
    const arrowLeft = clamp(targetCenterX - left, 12, bubbleRect.width - 12);

    setPos({ top, left, actualPlacement, arrowLeft });
  }, [open, minWidth, maxWidth, placement, offset]);

  const bubbleStyle = useMemo((): CSSProperties => {
    if (!pos) return { ...baseStyles.bubble, visibility: "hidden" };
    return {
      ...baseStyles.bubble,
      top: pos.top,
      left: pos.left,
      zIndex,
      minWidth,
      maxWidth,
    };
  }, [pos, zIndex, minWidth, maxWidth]);

  const arrowStyle = useMemo((): CSSProperties => {
    if (!pos) return { ...baseStyles.arrow, display: "none" };

    return pos.actualPlacement === "bottom"
      ? {
          ...baseStyles.arrow,
          top: "-6px",
          left: pos.arrowLeft,
        }
      : {
          ...baseStyles.arrow,
          bottom: "-6px",
          left: pos.arrowLeft,
        };
  }, [pos]);

  return (
    <span
      style={baseStyles.wrapper}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <span
        ref={targetRef}
        tabIndex={0}
        aria-describedby={id}
        style={baseStyles.target}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        {children}
      </span>

      {open && (
        <span
          ref={bubbleRef}
          role="tooltip"
          id={id}
          style={bubbleStyle}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <span aria-hidden="true" style={arrowStyle} />
          {label}
        </span>
      )}
    </span>
  );
}