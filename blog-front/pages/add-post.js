import React from "react"
import { Formik, Field } from "formik"
import { useContext, useCallback, useState } from "react"
import AppContext from "../components/AppContext"
import * as yup from "yup"
import FormField from "../components/FormField"
import axios from "axios"
import { useRouter } from "next/router"

const AddPost = () => {
    const router = useRouter()
    const { state } = useContext(AppContext)

    const initialValues = {
        title: "",
        content: "",
        is_published: true
    }

    const validationSchema = yup.object().shape({
        title: yup.string().required().label("Post title"),
        content: yup.string().required().label("Post content"),
        is_published: yup.boolean()
    })

    const handleFormSubmit = useCallback(
        async (userData) => {            
            axios.post("http://localhost:3001/posts", userData, { headers: { authentification: state.jwt } }).then(res => {
                router.push("/")
            })
        }, []
    )

    return (
        <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
            validationSchema={validationSchema}
        >
            {({ handleSubmit }) => (
                <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="flex flex-col gap-4 p-4"
                >
                    <div className="container mx-auto flex flex-wrap py-6">
                        <div className="w-full md:w-3/3 flex flex-col items-center px-3">
                            <div className="flex flex-col my-4 w-2/4">
                                <h1 className="text-center text-4xl font-semibold">Add a post</h1>
                                <FormField className="border-solid border-gray-300 mb-4 border py-2 px-4 w-full rounded text-gray-700" name="title" autoFocus>
                                    Title
                                </FormField>
                                <FormField className="border-solid border-gray-300 border py-3 px-3 h-40 w-full rounded text-gray-700" name="content" as="textarea">
                                    Content
                                </FormField>
                                <label className="ml-4 inline-block">
                                    <Field className="mt-4 mr-1" name="is_published" type="checkbox" />
                                    Publish after add
                                </label>
                                <div className="flex flex-col items-center">
                                    <button className="mt-4 w-auto bg-blue-600 hover:bg-blue-500 text-green-100 border py-3 px-6 font-semibold text-md rounded" type="submit">
                                        Add post
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                </form>
            )}
        </Formik>
    )
}

export default AddPost