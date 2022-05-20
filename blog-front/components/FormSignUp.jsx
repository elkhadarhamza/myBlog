import styles from "../styles/header.module.css"
import Image from "next/image"
import { Formik } from "formik"
import { useContext, useCallback, useState } from "react"
import AppContext from "./AppContext"
import * as yup from "yup"
import FormField from "./FormField"
import axios from "axios"
import { useRouter } from "next/router"
import Link from "next/link"

export default function FormSignUp() {
    const router = useRouter()
    const { saveSessionTokenInLocalStorage } = useContext(AppContext)
    const [error, setError] = useState("")
    const initialValues = {
        email: "",
        password: "",
        displayName: "",
        confirmpassword: ""
    }

    const validationSchema = yup.object().shape({
        email: yup.string().trim().required().label("Username"),
        password: yup.string().trim().required().label("Password"),
        confirmpassword: yup.string().trim().required().oneOf([yup.ref("password"), null], "Passwords must match").label("Password"),
        displayName: yup.string().trim().required().label("Display name")
    })

    const handleFormSubmit = useCallback(
        async (userData) => {            
            axios.post("http://localhost:3001/users", userData).then(res => {
                saveSessionTokenInLocalStorage(res.data)
                router.push("/")
            }).catch(function (error) {
                error
                setError("Your email address and/or password could not be validated. Please check them and try again")
            })
        }, [router, saveSessionTokenInLocalStorage]
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
                    <div className=" border h-screen overflow-hidden items-center justify-center flex bg-gray-50">
                        <div className="border bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col w-1/3">
                            <div className="mb-4 items-center justify-center flex">
                                <Image src="/logo.png" alt="MyBlog" width={100} height={100} />
                            </div>
                            <div className="mb-4">
                                <FormField name="email" placeholder="Enter your email...">
                                    Email
                                </FormField>
                            </div>
                            <div className="mb-4">
                                <FormField name="displayName" placeholder="Enter your name...">
                                    Display Name
                                </FormField>
                            </div>
                            <div className="mb-6">
                                <FormField name="password" type="password" placeholder="Enter password...">
                                    Password
                                </FormField>
                            </div>
                            <div className="mb-6">
                                <FormField name="confirmpassword" type="password" placeholder="Enter password...">
                                    Confirm Password
                                </FormField>
                            </div>
                            <div className="flex items-center justify-between">

                                <button type="submit" className={styles.buttonPrimary}>
                                    Sign up
                                </button>
                                <Link href="/sign-in">
                                <a className="inline-block align-baseline font-bold text-sm text-blue hover:text-blue-darker" href="#">
                                    Already have an account? Sign in.
                                </a>
                                </Link>
                            </div>
                            <p className="text-red text-red-500">{error}</p>
                        </div>
                    </div>

                </form>
            )}
        </Formik>
    )
}