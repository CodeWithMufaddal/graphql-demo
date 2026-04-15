import { z } from "zod"

function optionalStringField(label: string, maxLength = 200) {
  return z
    .string()
    .trim()
    .max(maxLength, `${label} must be at most ${maxLength} characters.`)
    .or(z.literal(""))
    .optional()
    .transform((value) => {
      if (value === undefined || value === "") {
        return undefined
      }
      return value
    })
}

function optionalFloatField(label: string) {
  return z
    .union([z.number(), z.string().trim(), z.literal(""), z.undefined()])
    .transform((value) => {
      if (value === undefined || value === "") {
        return undefined
      }

      const numericValue = typeof value === "number" ? value : Number(value)
      return Number.isFinite(numericValue) ? numericValue : Number.NaN
    })
    .refine(
      (value) => value === undefined || !Number.isNaN(value),
      `${label} must be a valid number.`
    )
}

const geoInputSchema = z
  .object({
    lng: optionalFloatField("Longitude"),
    lat: optionalFloatField("Latitude"),
  })
  .transform((value) => {
    if (value.lng === undefined && value.lat === undefined) {
      return undefined
    }

    return value
  })

const companyInputSchema = z
  .object({
    name: optionalStringField("Company name", 120),
    catchPhrase: optionalStringField("Company catch phrase", 200),
    bs: optionalStringField("Company BS", 200),
  })
  .transform((value) => {
    if (value.name === undefined && value.catchPhrase === undefined && value.bs === undefined) {
      return undefined
    }

    return value
  })

const addressInputSchema = z
  .object({
    zipcode: optionalStringField("Zipcode", 40),
    suite: optionalStringField("Suite", 120),
    street: optionalStringField("Street", 120),
    city: optionalStringField("City", 120),
    geo: geoInputSchema,
  })
  .transform((value) => {
    if (
      value.zipcode === undefined &&
      value.suite === undefined &&
      value.street === undefined &&
      value.city === undefined &&
      value.geo === undefined
    ) {
      return undefined
    }

    return value
  })

export const userFormSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Username is required.")
    .max(80, "Username must be at most 80 characters."),
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(120, "Name must be at most 120 characters."),
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Enter a valid email address."),
  website: optionalStringField("Website", 200),
  phone: optionalStringField("Phone", 80),
  company: companyInputSchema,
  address: addressInputSchema,
})

export type UserFormValues = z.input<typeof userFormSchema>
export type UserFormSubmitValues = z.output<typeof userFormSchema>

export const userFormDefaultValues: UserFormValues = {
  username: "",
  name: "",
  email: "",
  website: "",
  phone: "",
  company: {
    name: "",
    catchPhrase: "",
    bs: "",
  },
  address: {
    zipcode: "",
    suite: "",
    street: "",
    city: "",
    geo: {
      lng: "",
      lat: "",
    },
  },
}
