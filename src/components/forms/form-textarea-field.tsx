import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form"

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"

type FormTextareaFieldProps<TValues extends FieldValues> = {
  control: Control<TValues>
  name: FieldPath<TValues>
  label: string
  description?: string
} & Omit<
  React.ComponentProps<typeof Textarea>,
  "name" | "value" | "defaultValue" | "onChange" | "onBlur" | "ref" | "id"
>

export function FormTextareaField<TValues extends FieldValues>({
  control,
  name,
  label,
  description,
  ...textareaProps
}: FormTextareaFieldProps<TValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid || undefined}>
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          <FieldContent>
            <Textarea
              id={field.name}
              {...textareaProps}
              name={field.name}
              value={typeof field.value === "string" ? field.value : ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              ref={field.ref}
              aria-invalid={fieldState.invalid || undefined}
            />
            {description ? <FieldDescription>{description}</FieldDescription> : null}
            <FieldError errors={[fieldState.error]} />
          </FieldContent>
        </Field>
      )}
    />
  )
}
