import { UserForm } from "./user-form"
import type { UserFormSubmitValues, UserFormValues } from "./user-form-schema"

type UpdateUserFormProps = {
  initialValues?: Partial<UserFormValues>
  onSubmit?: (values: UserFormSubmitValues) => Promise<void> | void
}

export function UpdateUserForm({ initialValues, onSubmit }: UpdateUserFormProps) {
  return (
    <UserForm
      mode="update"
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitLabel="Update User"
    />
  )
}
