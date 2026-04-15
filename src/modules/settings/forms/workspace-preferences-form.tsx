import { useState } from "react"

import { FormSelectField, FormTextField, FormTextareaField } from "@/components/forms"
import { Button } from "@/components/ui/button"
import { FieldGroup } from "@/components/ui/field"
import { useZodForm } from "@/lib/forms"

import {
  workspacePreferencesDefaultValues,
  workspacePreferencesFormSchema,
  type WorkspacePreferencesFormValues,
} from "./workspace-preferences-form-schema"

type WorkspacePreferencesFormProps = {
  initialValues?: Partial<WorkspacePreferencesFormValues>
  onSubmit?: (values: WorkspacePreferencesFormValues) => Promise<void> | void
}

const timezoneOptions = [
  { label: "Asia/Kolkata (IST)", value: "ist" },
  { label: "UTC", value: "utc" },
  { label: "America/Los_Angeles (PST)", value: "pst" },
]

export function WorkspacePreferencesForm({
  initialValues,
  onSubmit,
}: WorkspacePreferencesFormProps) {
  const [submitMessage, setSubmitMessage] = useState<string | null>(null)
  const form = useZodForm({
    schema: workspacePreferencesFormSchema,
    mode: "onBlur",
    defaultValues: {
      ...workspacePreferencesDefaultValues,
      ...initialValues,
    },
  })

  async function handleSubmit(values: WorkspacePreferencesFormValues) {
    await onSubmit?.(values)
    setSubmitMessage("Preferences saved.")
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(handleSubmit)}>
      <FieldGroup>
        <div className="grid gap-3 md:grid-cols-2">
          <FormTextField
            control={form.control}
            name="workspaceName"
            label="Workspace name"
          />
          <FormTextField
            control={form.control}
            name="workspaceUrl"
            label="Workspace URL"
          />
        </div>

        <FormSelectField
          control={form.control}
          name="timezone"
          label="Default timezone"
          options={timezoneOptions}
          triggerClassName="w-full"
        />

        <FormTextareaField
          control={form.control}
          name="notes"
          label="Admin notes"
          placeholder="Future mutation body goes here..."
        />
      </FieldGroup>

      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          {submitMessage ?? "Changes are validated with Zod before submit."}
        </p>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  )
}
