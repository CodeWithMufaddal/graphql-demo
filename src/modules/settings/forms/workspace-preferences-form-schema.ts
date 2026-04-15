import { z } from "zod"

export const workspacePreferencesFormSchema = z.object({
  workspaceName: z
    .string()
    .trim()
    .min(2, "Workspace name must be at least 2 characters.")
    .max(80, "Workspace name must be less than 80 characters."),
  workspaceUrl: z
    .string()
    .trim()
    .min(3, "Workspace URL is required.")
    .max(120, "Workspace URL is too long.")
    .regex(
      /^[a-z0-9-]+(\.[a-z0-9-]+)*$/,
      "Use lowercase letters, numbers, dashes, and dots only."
    ),
  timezone: z.enum(["ist", "utc", "pst"]),
  notes: z.string().trim().max(500, "Notes must be 500 characters or less."),
})

export type WorkspacePreferencesFormValues = z.infer<
  typeof workspacePreferencesFormSchema
>

export const workspacePreferencesDefaultValues: WorkspacePreferencesFormValues = {
  workspaceName: "Atlas Admin",
  workspaceUrl: "atlas-admin.local",
  timezone: "ist",
  notes: "",
}
