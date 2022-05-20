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


export default function FormLogin() {
    const router = useRouter()
    const { saveSessionTokenInLocalStorage } = useContext(AppContext)
    const [error, setError] = useState("")

    const initialValues = {
        email: "",
        password: ""
    }

    const validationSchema = yup.object().shape({
        email: yup.string().trim().required().label("Username"),
        password: yup.string().trim().required().label("Password"),
    })

    const handleFormSubmit = useCallback(
        async (userData) => {
            axios.post("http://localhost:3001/sign-in", userData).then(res => {
                saveSessionTokenInLocalStorage(res.data)

                if (res.data.userType === "supper-admin") {
                    router.push("/manage-users")
                }
                else {
                    router.push("/")
                }
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
                                <FormField name="email" placeholder="Enter your email...">Email</FormField>
                            </div>
                            <div className="mb-6">
                                <FormField name="password" type="password" placeholder="Enter password...">Password</FormField>
                            </div>
                            <div className="flex items-center justify-between">
                                <button type="submit" className={styles.buttonPrimary}>Login</button>
                                <Link href="/sign-up">
                                    <a className="inline-block align-baseline font-bold text-sm text-blue hover:text-blue-darker" href="#">Don't have an account yet? Sign up.</a>
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