import { useEffect, useRef, useState } from "react";
import type { FocusEvent, MouseEvent } from "react";
import type { ToastMessage } from "../hooks/useToast.ts";

export interface ToastProps {
  // null until the first message
  toast: ToastMessage | null;
  onDismiss: () => void;
  // How long it stays, in milliseconds (paused while the mouse or keyboard is on it)
  duration?: number;
}

// A short message at the bottom of the screen, with an optional link button.
// It is always in the page (invisible while closed), so it stays a live
// region (role="status") that screen readers watch.
export function Toast({ toast, onDismiss, duration = 6000 }: ToastProps) {
  const [text, setText] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);
  // The animation frame that will show the text (so it can be cancelled)
  const frame = useRef(0);
  const open = toast?.open ?? false;
  const id = toast?.id;
  const message = toast?.message ?? "";

  // A new message: the toast opens now and its text arrives two frames later
  // (the fade-in starts from visibility: hidden for one frame), so the region
  // is already visible when its text changes and the change is announced.
  // Then it hides itself after `duration`, unless the mouse or keyboard is
  // already on it.
  useEffect(() => {
    if (!open) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = requestAnimationFrame(() => setText(message));
    });
    const root = rootRef.current;
    const inUse =
      root !== null &&
      (root.matches(":hover") || root.contains(document.activeElement));
    if (!inUse) timer.current = window.setTimeout(onDismiss, duration);
    return () => {
      cancelAnimationFrame(frame.current);
      window.clearTimeout(timer.current);
    };
  }, [id, open, message, duration, onDismiss]);

  // The timer stops while the mouse or keyboard is on the toast (reading it or
  // reaching "View cart" can take longer than a few seconds) and starts again
  // only when both have left
  function stopTimer(): void {
    window.clearTimeout(timer.current);
  }

  function startTimer(): void {
    window.clearTimeout(timer.current);
    if (open) timer.current = window.setTimeout(onDismiss, duration);
  }

  function handleMouseLeave(event: MouseEvent<HTMLDivElement>): void {
    if (!event.currentTarget.contains(document.activeElement)) startTimer();
  }

  // relatedTarget is where focus goes next: still inside means still in use
  function handleBlur(event: FocusEvent<HTMLDivElement>): void {
    const root = event.currentTarget;
    if (!root.contains(event.relatedTarget) && !root.matches(":hover")) {
      startTimer();
    }
  }

  return (
    <div
      ref={rootRef}
      className={open ? "toast is-open" : "toast"}
      role="status"
      onMouseEnter={stopTimer}
      onFocus={stopTimer}
      onMouseLeave={handleMouseLeave}
      onBlur={handleBlur}
    >
      <p className="toast-text">{text}</p>
      {toast?.action ? (
        <a className="button toast-action" href={toast.action.href}>
          {toast.action.label}
        </a>
      ) : null}
      <button
        className="toast-close"
        type="button"
        aria-label="Dismiss message"
        onClick={onDismiss}
      >
        ×
      </button>
    </div>
  );
}
