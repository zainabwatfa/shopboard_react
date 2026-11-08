import { use } from "react";
import { useFormContext } from "react-hook-form";
import { FormFieldContext, FormItemContext } from "./formContexts.ts";

export function useFormField() {
  const fieldContext = use(FormFieldContext);
  const itemContext = use(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const name = fieldContext?.name ?? "";
  const id = itemContext?.id ?? name;

  const fieldState = getFieldState(name, formState);

  return {
    id,
    name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    error: fieldState.error,
    isDirty: fieldState.isDirty,
    isTouched: fieldState.isTouched,
    invalid: fieldState.invalid,
  };
}
