import { Formik } from "formik"
import * as yup from "yup"
import Button from "./Button"
import FormField from "./FormField"
import Menu from "./Menu"
import { useContext, useCallback, useState } from "react"
import AppContext from "./AppContext"

export default function Home() {
  const { addEntry } = useContext(AppContext)
  const [state, setState] = useState({ added: false })

  const initialValues = {
    amount: "",
    description: "",
    type: "in",
  }

  const validationSchema = yup.object().shape({
    amount: yup.number().notOneOf([0]).positive().required().label("Amount"),
    description: yup.string().required().label("Description"),
    type: yup.string().required().label("Entry Type"),
  })

  const handleFormSubmit = useCallback(
    async (values, { resetForm }) => {
      addEntry(values)
      resetForm({ values: "" })
      setState({
        added: true,
      })
    },
    [addEntry]
  )

  return (
    <div>
      <Menu />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={validationSchema}
      >
        {({ handleSubmit, isValid, isSubmitting }) => (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-4 p-4"
          >
            {state.added && (
              <div>
                <div
                  className="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md"
                  role="alert"
                >
                  <div>
                    <p className="font-bold">Entry added successfully</p>
                  </div>
                </div>
              </div>
            )}
            <div className="mt-4">
              <span className="text-gray-700">Entry Type</span>
              <div className="mt-2 flex">
                <FormField
                  type="radio"
                  className="form-radio flex-2 px-4 py-2 m-2"
                  name="type"
                  value="in"
                ></FormField>{" "}
                INCOMING
                <FormField
                  type="radio"
                  className="form-radio flex-2 px-4 py-2 m-2"
                  name="type"
                  value="out"
                ></FormField>{" "}
                OUTGOING
              </div>
            </div>
            <FormField name="amount" placeholder="Enter amount...">
              Amount
            </FormField>
            <FormField name="description" placeholder="Enter description...">
              Description
            </FormField>
            <Button type="submit" disabled={!isValid || isSubmitting}>
              Add Entry
            </Button>
          </form>
        )}
      </Formik>
    </div>
  )
}
