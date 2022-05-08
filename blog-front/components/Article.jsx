import Link from "next/link"
import { Formik } from "formik"
import FormField from "./FormField"
import { useContext, useCallback, useState } from "react"
import * as yup from "yup"
import axios from "axios"
import AppContext from "./AppContext"

const Article = (props) => {
    const { post } = props
    const { state } = useContext(AppContext)
    const [currentpost, setPost] = useState(post)

    const initialValues = {
        content: ""
    }

    const validationSchema = yup.object().shape({
        content: yup.string().required().label("Comment content"),
    })

    const handleFormSubmit = useCallback(
        async (comment) => {
            axios.post("http://localhost:3001/posts/" + currentpost.id + "/comments", comment, { headers: { authentification: state.jwt } }).then(res => {
                setPost(res.data)
            })
        }, []
    )

    return (
        <>
            <article className="flex flex-col shadow my-4 w-3/4">
                <div className="bg-white flex flex-col justify-start p-6">
                    <span className="text-3xl font-bold hover:text-gray-700 pb-4">{currentpost.title}</span>
                    <p href="#" className="text-sm pb-3">
                        By <a href="#" className="font-semibold hover:text-gray-800">{currentpost.author}</a>, Published on {currentpost.publication_date}
                    </p>
                    <span className="pb-6">{currentpost.content}</span>
                </div>

                <Formik
                    onSubmit={handleFormSubmit}
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                >
                    {({ handleSubmit }) => (
                        <form
                            onSubmit={handleSubmit}
                            noValidate
                        >
                            <div className="flex flex-col m-5">
                                <div className="flex flex-col items-center w-full my-4">
                                    <h1 className="text-center text-4xl font-semibold mb-5">Comments</h1>
                                    <div className="w-full">
                                        <FormField className="border-solid border-gray-300 border py-3 px-3 h-40 w-full rounded text-gray-700" name="content" as="textarea">
                                            Content
                                        </FormField>
                                    </div>
                                    <button className="mt-4 w-auto bg-blue-600 hover:bg-blue-500 text-green-100 border py-3 px-6 font-semibold text-md rounded" type="submit">
                                        Add comment
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </Formik>
            </article>
        </>
    )
}

export default Article