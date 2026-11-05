export type SelectOption = {
  value: string;
  label: string;
};

export interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  options: readonly SelectOption[];
  disabled: boolean;
  // The chosen option's value as plain text: the caller checks it
  onChange: (value: string) => void;
}

// A labelled drop-down (.field: label above the select)
export function SelectField({
  id,
  label,
  value,
  options,
  disabled,
  onChange,
}: SelectFieldProps) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
