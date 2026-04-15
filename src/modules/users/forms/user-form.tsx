import { useState } from "react"

import { FormTextField } from "@/components/forms"
import { Button } from "@/components/ui/button"
import { FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field"
import { useZodForm } from "@/lib/forms"

import {
  userFormDefaultValues,
  userFormSchema,
  type UserFormSubmitValues,
  type UserFormValues,
} from "./user-form-schema"

type UserFormProps = {
  mode?: "create" | "update"
  initialValues?: Partial<UserFormValues>
  submitLabel?: string
  onSubmit?: (values: UserFormSubmitValues) => Promise<void> | void
  showPayloadPreview?: boolean
}

function buildDefaultValues(initialValues: Partial<UserFormValues> | undefined): UserFormValues {
  return {
    ...userFormDefaultValues,
    ...initialValues,
    company: {
      ...userFormDefaultValues.company,
      ...initialValues?.company,
    },
    address: {
      ...userFormDefaultValues.address,
      ...initialValues?.address,
      geo: {
        ...userFormDefaultValues.address.geo,
        ...initialValues?.address?.geo,
      },
    },
  }
}

export function UserForm({
  mode = "create",
  initialValues,
  submitLabel,
  onSubmit,
  showPayloadPreview = false,
}: UserFormProps) {
  const [lastPayload, setLastPayload] = useState<UserFormSubmitValues | null>(null)
  const form = useZodForm({
    schema: userFormSchema,
    mode: "onBlur",
    defaultValues: buildDefaultValues(initialValues),
  })

  async function handleSubmit(values: UserFormValues) {
    const parsedValues = userFormSchema.parse(values)
    await onSubmit?.(parsedValues)
    setLastPayload(parsedValues)
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={form.handleSubmit(handleSubmit)}>
      <FieldSet>
        <FieldLegend>Primary</FieldLegend>
        <FieldGroup>
          <FormTextField control={form.control} name="name" label="Name" />
          <FormTextField control={form.control} name="username" label="Username" />
          <FormTextField control={form.control} name="email" label="Email" type="email" />
          <FormTextField control={form.control} name="phone" label="Phone" />
          <FormTextField control={form.control} name="website" label="Website" />
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend>Company</FieldLegend>
        <FieldGroup>
          <FormTextField control={form.control} name="company.name" label="Company name" />
          <FormTextField
            control={form.control}
            name="company.catchPhrase"
            label="Catch phrase"
          />
          <FormTextField control={form.control} name="company.bs" label="BS" />
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend>Address</FieldLegend>
        <FieldGroup>
          <FormTextField control={form.control} name="address.zipcode" label="Zipcode" />
          <FormTextField control={form.control} name="address.suite" label="Suite" />
          <FormTextField control={form.control} name="address.street" label="Street" />
          <FormTextField control={form.control} name="address.city" label="City" />
          <FormTextField
            control={form.control}
            name="address.geo.lat"
            label="Latitude"
            type="number"
            step="any"
          />
          <FormTextField
            control={form.control}
            name="address.geo.lng"
            label="Longitude"
            type="number"
            step="any"
          />
        </FieldGroup>
      </FieldSet>

      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          {mode === "create"
            ? "Create form validates nested payload and optional fields."
            : "Update form validates nested payload and optional fields."}
        </p>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting
            ? "Saving..."
            : submitLabel ?? (mode === "create" ? "Create User" : "Update User")}
        </Button>
      </div>

      {showPayloadPreview && lastPayload ? (
        <div className="rounded-lg border bg-muted/40 p-3">
          <p className="mb-2 text-xs font-medium text-muted-foreground">Last payload</p>
          <pre className="overflow-x-auto text-xs">{JSON.stringify(lastPayload, null, 2)}</pre>
        </div>
      ) : null}
    </form>
  )
}
