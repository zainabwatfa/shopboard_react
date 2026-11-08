import { createContext } from "react";

export interface FormFieldContextValue {
  name: string;
}

export const FormFieldContext = createContext<FormFieldContextValue | null>(
  null,
);

export interface FormItemContextValue {
  id: string;
}

export const FormItemContext = createContext<FormItemContextValue | null>(null);
