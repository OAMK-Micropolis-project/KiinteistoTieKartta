import React, { useId, useMemo, useState } from "react";
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
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    background: "rgba(17, 24, 39, 0.95)",
    color: "#ffffff",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "10px",
    padding: "10px 12px",
    fontSize: "12px",
    lineHeight: 1.35,
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
    whiteSpace: "pre-wrap",

    // ✅ TÄRKEÄ: anna bubblelle pointer events
    // jotta hiiri "osuu" siihen ja wrapper ei laukaise mouseleavea
    pointerEvents: "auto",
  } as CSSProperties,

  arrow: {
    position: "absolute",
    left: "50%",
    width: "10px",
    height: "10px",
    transform: "translateX(-50%) rotate(45deg)",
    background: "rgba(17, 24, 39, 0.95)",
    borderLeft: "1px solid rgba(255,255,255,0.08)",
    borderTop: "1px solid rgba(255,255,255,0.08)",
  } as CSSProperties,
};

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

  const bubblePos = useMemo((): CSSProperties => {
    const common: CSSProperties = { minWidth, maxWidth, zIndex };

    return placement === "top"
      ? { ...common, bottom: `calc(100% + ${offset}px)` }
      : { ...common, top: `calc(100% + ${offset}px)` };
  }, [minWidth, maxWidth, placement, offset, zIndex]);

  const arrowPos = useMemo((): CSSProperties => {
    return placement === "top"
      ? { ...baseStyles.arrow, bottom: "-6px" }
      : { ...baseStyles.arrow, top: "-6px" };
  }, [placement]);

  return (
    <span
      style={baseStyles.wrapper}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <span
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
          role="tooltip"
          id={id}
          style={{ ...baseStyles.bubble, ...bubblePos }}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <span aria-hidden="true" style={arrowPos} />
          {label}
        </span>
      )}
    </span>
  );
}