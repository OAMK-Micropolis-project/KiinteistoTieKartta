import React, { useId, useState } from "react";
import { tt, ttTarget, ttBubble, ttArrow } from "./Tooltip.styles";

export default function Tooltip({
  label,
  children,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);

  return (
    <span
      style={tt}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <span
        tabIndex={0}
        aria-describedby={id}
        style={ttTarget}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        {children}
      </span>

      {open && (
        <span role="tooltip" id={id} style={ttBubble}>
          <span aria-hidden="true" style={ttArrow} />
          {label}
        </span>
      )}
    </span>
  );
}