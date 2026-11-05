import { useCallback, useEffect, useState } from "react";
import {
  getThemeChoice,
  saveThemeChoice,
} from "../modules/theme/theme.state.ts";
import type { ThemeChoice } from "../modules/theme/theme.types.ts";
import { useStorageSync } from "./useStorageSync.ts";

export interface ThemeControl {
  choice: ThemeChoice;
  changeTheme: (choice: ThemeChoice) => void;
}

// The System / Light / Dark switch. The <head> script already applied the
// saved theme before the page was drawn; this keeps it right afterwards.
export function useTheme(): ThemeControl {
  const [choice, setChoice] = useState<ThemeChoice>(getThemeChoice);

  // The CSS reads <html data-theme>: "light" or "dark" override the device
  // setting, and no attribute (System) follows the device
  useEffect(() => {
    const root = document.documentElement;
    if (choice === "system") {
      delete root.dataset.theme;
    } else {
      root.dataset.theme = choice;
    }
  }, [choice]);

  // A theme picked in another tab, or Back showing this page from the cache
  useStorageSync(() => setChoice(getThemeChoice()));

  // Only theme.state.ts saves the choice
  const changeTheme = useCallback((next: ThemeChoice) => {
    saveThemeChoice(next);
    setChoice(next);
  }, []);

  return { choice, changeTheme };
}
