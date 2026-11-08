import type { Ref } from "react";

export interface SearchFieldProps {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  disabled: boolean;
  onChange: (value: string) => void;
  // Lets the page move keyboard focus here (after "Clear filters")
  ref?: Ref<HTMLInputElement>;
}

// A labelled search box (.field: label above the input)
export function SearchField({
  id,
  label,
  value,
  placeholder,
  disabled,
  onChange,
  ref,
}: SearchFieldProps) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        ref={ref}
        id={id}
        type="search"
        placeholder={placeholder}
        autoComplete="off"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
