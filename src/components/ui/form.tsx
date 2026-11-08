import { cloneElement, isValidElement, useId } from "react";
import type { ComponentProps, ReactNode } from "react";
import { Controller, FormProvider } from "react-hook-form";
import type { ControllerProps, FieldPath, FieldValues } from "react-hook-form";
import { cn } from "../../lib/utils.ts";
import { FormFieldContext, FormItemContext } from "./formContexts.ts";
import { useFormField } from "./useFormField.ts";
import { Label } from "./label.tsx";

export const Form = FormProvider;

export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext>
  );
}

export function FormItem({
  className,
  children,
  ...props
}: ComponentProps<"div">) {
  const id = useId();

  return (
    <FormItemContext value={{ id }}>
      <div className={cn("field", className)} {...props}>
        {children}
      </div>
    </FormItemContext>
  );
}

export function FormLabel({
  className,
  children,
  ...props
}: ComponentProps<"label">) {
  const { error, formItemId } = useFormField();

  return (
    <Label
      htmlFor={formItemId}
      className={cn(error ? "field-label-error" : undefined, className)}
      {...props}
    >
      {children}
    </Label>
  );
}

interface FormElementProps {
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
}

export function FormControl({ children }: { children: ReactNode }) {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  if (!isValidElement<FormElementProps>(children)) {
    return children;
  }

  const describedBy = error
    ? `${formDescriptionId} ${formMessageId}`
    : formDescriptionId;

  return cloneElement<FormElementProps>(children, {
    id: formItemId,
    "aria-describedby": describedBy,
    "aria-invalid": Boolean(error),
  });
}

export function FormDescription({
  className,
  children,
  ...props
}: ComponentProps<"p">) {
  const { formDescriptionId } = useFormField();

  return (
    <p id={formDescriptionId} className={cn("hint", className)} {...props}>
      {children}
    </p>
  );
}

export function FormMessage({
  className,
  children,
  ...props
}: ComponentProps<"p">) {
  const { error, formMessageId } = useFormField();
  const body = error ? error.message : children;

  if (!body) {
    return null;
  }

  return (
    <p
      id={formMessageId}
      role="alert"
      className={cn("field-error", className)}
      {...props}
    >
      {body}
    </p>
  );
}
