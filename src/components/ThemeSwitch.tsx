import { Fragment } from "react";
import type { ReactNode, SVGAttributes } from "react";
import type { ThemeChoice } from "../modules/theme/theme.types.ts";

export interface ThemeSwitchProps {
  choice: ThemeChoice;
  onChange: (choice: ThemeChoice) => void;
}

type ThemeOption = {
  value: ThemeChoice;
  label: string;
  icon: ReactNode;
};

// The same icons as the first ShopBoard site. Decorative: the label is hidden text.
const iconProps: SVGAttributes<SVGSVGElement> = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

const options: readonly ThemeOption[] = [
  {
    value: "system",
    label: "System",
    icon: (
      <svg {...iconProps}>
        <rect x="3" y="4" width="18" height="12" rx="2" />
        <path d="M8 20h8M12 16v4" />
      </svg>
    ),
  },
  {
    value: "light",
    label: "Light",
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    ),
  },
  {
    value: "dark",
    label: "Dark",
    icon: (
      <svg {...iconProps}>
        <path d="M20.5 13.5A8.5 8.5 0 1 1 10.5 3.5a7.5 7.5 0 0 0 10 10z" />
      </svg>
    ),
  },
];

// A pill with three round options. The radios are visually hidden; their
// labels show the icons. autoComplete="off" stops the browser from putting
// back an old choice after Back/Forward.
export function ThemeSwitch({ choice, onChange }: ThemeSwitchProps) {
  return (
    <fieldset id="theme-switch" className="theme-switch">
      <legend className="visually-hidden">Theme</legend>
      {options.map((option) => (
        <Fragment key={option.value}>
          <input
            id={`theme-${option.value}`}
            type="radio"
            name="theme"
            value={option.value}
            autoComplete="off"
            checked={choice === option.value}
            onChange={() => onChange(option.value)}
          />
          <label htmlFor={`theme-${option.value}`} title={option.label}>
            {option.icon}
            <span className="visually-hidden">{option.label}</span>
          </label>
        </Fragment>
      ))}
    </fieldset>
  );
}
