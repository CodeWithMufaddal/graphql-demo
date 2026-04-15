# Forms Architecture

This project uses a reusable form stack:

1. `zod` schema for validation and typed payloads.
2. `useZodForm` from `@/lib/forms` for RHF + zod resolver wiring.
3. Reusable controlled fields from `@/components/forms` for consistent UI and errors.
4. Module-local form files under `src/modules/<module>/forms`.

## Recommended Structure

```text
src/modules/<module>/forms/
  <entity>-form-schema.ts
  <entity>-form.tsx
  index.ts
```

## Create a New Form

1. Define schema in module form schema file.
2. Infer type from schema (`z.infer<typeof schema>`).
3. Build form component using `useZodForm`.
4. Compose fields with:
   - `FormTextField`
   - `FormTextareaField`
   - `FormSelectField`
   - `FormSwitchField`
5. Keep submit logic in the module form component; page should only place cards/layout.
