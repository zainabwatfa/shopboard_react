import { useCallback, useState } from "react";

// The link button in a toast, e.g. "View cart" → cart.html
export type ToastAction = {
  label: string;
  href: string;
};

// id changes with every new message, so the same text twice still counts as new.
// A closed toast keeps its text, so nothing jumps while it fades out.
export type ToastMessage = {
  id: number;
  message: string;
  action: ToastAction | null;
  open: boolean;
};

export interface ToastControl {
  toast: ToastMessage | null;
  showToast: (message: string, action?: ToastAction) => void;
  dismissToast: () => void;
}

// What <Toast> shows. The toast itself hides after a few seconds.
export function useToast(): ToastControl {
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = useCallback((message: string, action?: ToastAction) => {
    setToast((previous) => ({
      id: (previous?.id ?? 0) + 1,
      message,
      action: action ?? null,
      open: true,
    }));
  }, []);

  const dismissToast = useCallback(() => {
    setToast((previous) => (previous ? { ...previous, open: false } : null));
  }, []);

  return { toast, showToast, dismissToast };
}
