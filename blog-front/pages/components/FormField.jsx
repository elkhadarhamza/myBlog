import { Field } from "formik"
import Input from "./Input"

const FormField = (props) => {
  const { children, as: Component = Input, ...otherProps } = props

  return (
    <label className="block">
      {children}
      <Field {...otherProps}>
        {({ field, meta: { touched, error } }) => (
          <>
            <Component className="w-full" {...field} {...otherProps} />
            {touched && error ? (
              <p className="text-red-500 p-2 text-sm">{error}</p>
            ) : null}
          </>
        )}
      </Field>
    </label>
  )
}

export default FormField
