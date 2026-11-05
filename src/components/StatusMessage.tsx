import { useEffect, useRef } from "react";
import type { StatusTone } from "../lib/messages.ts";

// The button under the line: "Try again" after a load error, "Clear filters"
// when nothing matches
export type StatusAction = {
  label: string;
  onClick: () => void;
};

export interface StatusMessageProps {
  id: string;
  tone: StatusTone;
  message: string;
  action?: StatusAction;
}

// A page's status line: "Loading…", the result count, an empty state or an
// error. It is a polite live region, always in the page, so screen readers
// read every new text. styles.css draws "empty" and "error" (data-state) as a
// card, and a following .status-action box as the bottom of that card (red for
// an id ending in "-retry", dashed for "-clear").
export function StatusMessage({
  id,
  tone,
  message,
  action,
}: StatusMessageProps) {
  const lineRef = useRef<HTMLParagraphElement>(null);

  // The line only has keyboard focus after its button was used (see below).
  // Emptied, it has nothing left to say, so focus moves on to the page's
  // heading ("Your cart" after "Try again" worked).
  useEffect(() => {
    const line = lineRef.current;
    if (message !== "" || !line || document.activeElement !== line) return;
    const heading = line.closest("main")?.querySelector("h1");
    if (heading instanceof HTMLElement) heading.focus();
  }, [message]);

  // The button disappears once it did its job, and focus would be lost with
  // it, so focus first moves to the line, which says what happens next
  // ("Loading products…")
  function handleAction(onClick: () => void): void {
    lineRef.current?.focus();
    onClick();
  }

  return (
    <>
      <p
        ref={lineRef}
        id={id}
        className="status"
        aria-live="polite"
        tabIndex={-1}
        data-state={tone === "normal" ? undefined : tone}
      >
        {message}
      </p>
      {action ? (
        <div
          id={`${id}-${tone === "error" ? "retry" : "clear"}`}
          className="status-action"
        >
          <button
            type="button"
            className="button button-small"
            onClick={() => handleAction(action.onClick)}
          >
            {action.label}
          </button>
        </div>
      ) : null}
    </>
  );
}
