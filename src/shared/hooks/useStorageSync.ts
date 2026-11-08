import { useEffect, useEffectEvent } from "react";

// Calls onSync when what this tab shows may be out of date:
// - "storage": the browser fires it in the other open tabs of this site when
//   saved data changes (a cart or theme change made in another tab);
// - "pageshow" with persisted: Back or Forward showed this page from the
//   browser's cache, exactly as it was when the user left it.
// It doesn't know which key changed, so onSync reads what it needs again.
// The listeners are added once; useEffectEvent always calls the latest onSync.
export function useStorageSync(onSync: () => void): void {
  const sync = useEffectEvent(onSync);

  useEffect(() => {
    const handleStorage = (): void => sync();
    const handlePageShow = (event: PageTransitionEvent): void => {
      if (event.persisted) sync();
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("pageshow", handlePageShow);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);
}
