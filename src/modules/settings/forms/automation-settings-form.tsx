import { useState } from "react"

import { FormSwitchField } from "@/components/forms"
import { Button } from "@/components/ui/button"
import { FieldGroup } from "@/components/ui/field"
import { useZodForm } from "@/lib/forms"

import {
  automationSettingsDefaultValues,
  automationSettingsFormSchema,
  type AutomationSettingsFormValues,
} from "./automation-settings-form-schema"

type AutomationSettingsFormProps = {
  initialValues?: Partial<AutomationSettingsFormValues>
  onSubmit?: (values: AutomationSettingsFormValues) => Promise<void> | void
}

export function AutomationSettingsForm({
  initialValues,
  onSubmit,
}: AutomationSettingsFormProps) {
  const [submitMessage, setSubmitMessage] = useState<string | null>(null)
  const form = useZodForm({
    schema: automationSettingsFormSchema,
    defaultValues: {
      ...automationSettingsDefaultValues,
      ...initialValues,
    },
  })

  async function handleSubmit(values: AutomationSettingsFormValues) {
    await onSubmit?.(values)
    setSubmitMessage("Automation settings saved.")
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(handleSubmit)}>
      <FieldGroup className="gap-3">
        <div className="rounded-lg border p-3">
          <FormSwitchField control={form.control} name="dailySummaryEmail" label="Daily summary email" />
        </div>
        <div className="rounded-lg border p-3">
          <FormSwitchField control={form.control} name="anomalyAlerts" label="Anomaly alerts" />
        </div>
        <div className="rounded-lg border p-3">
          <FormSwitchField control={form.control} name="autoCloseStaleTasks" label="Auto-close stale tasks" />
        </div>
      </FieldGroup>

      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">{submitMessage ?? "Toggles are form-managed and typed."}</p>
        <Button type="submit" variant="outline" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : "Save Automation"}
        </Button>
      </div>
    </form>
  )
}
