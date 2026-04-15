import { z } from "zod"

export const automationSettingsFormSchema = z.object({
  dailySummaryEmail: z.boolean(),
  anomalyAlerts: z.boolean(),
  autoCloseStaleTasks: z.boolean(),
})

export type AutomationSettingsFormValues = z.infer<
  typeof automationSettingsFormSchema
>

export const automationSettingsDefaultValues: AutomationSettingsFormValues = {
  dailySummaryEmail: true,
  anomalyAlerts: true,
  autoCloseStaleTasks: false,
}
