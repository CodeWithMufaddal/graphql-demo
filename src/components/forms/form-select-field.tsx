import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form"

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type SelectOption = {
  label: string
  value: string
}

type FormSelectFieldProps<TValues extends FieldValues> = {
  control: Control<TValues>
  name: FieldPath<TValues>
  label: string
  placeholder?: string
  description?: string
  options: SelectOption[]
  triggerClassName?: string
}

export function FormSelectField<TValues extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Select an option",
  description,
  options,
  triggerClassName,
}: FormSelectFieldProps<TValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid || undefined}>
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          <FieldContent>
            <Select
              value={typeof field.value === "string" ? field.value : ""}
              onValueChange={field.onChange}
            >
              <SelectTrigger
                id={field.name}
                className={triggerClassName ?? "w-full"}
                aria-invalid={fieldState.invalid || undefined}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {description ? <FieldDescription>{description}</FieldDescription> : null}
            <FieldError errors={[fieldState.error]} />
          </FieldContent>
        </Field>
      )}
    />
  )
}
