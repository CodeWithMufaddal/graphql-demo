import { UserForm } from "./user-form"
import type { UserFormSubmitValues, UserFormValues } from "./user-form-schema"

type CreateUserFormProps = {
  initialValues?: Partial<UserFormValues>
  onSubmit?: (values: UserFormSubmitValues) => Promise<void> | void
}

export function CreateUserForm({ initialValues, onSubmit }: CreateUserFormProps) {
  return (
    <UserForm
      mode="create"
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitLabel="Create User"
    />
  )
}
