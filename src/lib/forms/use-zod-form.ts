import { zodResolver } from "@hookform/resolvers/zod"
import {
  useForm,
  type FieldValues,
  type UseFormProps,
  type UseFormReturn,
} from "react-hook-form"
import { type z, type ZodTypeAny } from "zod"

type SchemaInput<TSchema extends ZodTypeAny> = z.input<TSchema> & FieldValues

type UseZodFormOptions<
  TSchema extends ZodTypeAny,
  TContext,
> = Omit<UseFormProps<SchemaInput<TSchema>, TContext>, "resolver"> & {
  schema: TSchema
}

export function useZodForm<
  TSchema extends ZodTypeAny,
  TContext = object,
>(
  options: UseZodFormOptions<TSchema, TContext>
): UseFormReturn<SchemaInput<TSchema>, TContext> {
  const { schema, ...formOptions } = options

  return useForm<SchemaInput<TSchema>, TContext>({
    ...formOptions,
    resolver: zodResolver(schema as never),
  })
}

export type FormValues<TSchema extends ZodTypeAny> = z.input<TSchema>
export type FormSubmitValues<TSchema extends ZodTypeAny> = z.output<TSchema>
export type AnyFormValues = FieldValues
