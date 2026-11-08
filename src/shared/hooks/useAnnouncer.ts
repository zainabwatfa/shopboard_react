import { useCallback, useEffect, useRef, useState } from "react";

export interface Announcer {
  // The text for a visually hidden role="status" element
  announcement: string;
  announce: (message: string) => void;
}

// Says something to screen reader users, e.g. what changed in the cart.
// The text is emptied first and filled on the next frame, so the same
// sentence twice in a row is read out again.
export function useAnnouncer(): Announcer {
  const [announcement, setAnnouncement] = useState("");
  const frame = useRef(0);

  const announce = useCallback((message: string) => {
    setAnnouncement("");
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => setAnnouncement(message));
  }, []);

  // Leaving the page: no update after it is gone
  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  return { announcement, announce };
}
