import styles from "../styles/header.module.css"
import Image from "next/image"
import { Formik } from "formik"
import { useContext, useCallback, useState } from "react"
import AppContext from "./AppContext"
import * as yup from "yup"
import FormField from "./FormField"
import axios from "axios"
import { useRouter } from "next/router"


export default function FormLogin() {
    const router = useRouter()
    const { saveSessionTokenInLocalStorage } = useContext(AppContext)
    const [state, setState] = useState({ added: false })

    const initialValues = {
        email: "",
        password: ""
    }

    const validationSchema = yup.object().shape({
        email: yup.string().required().label("Username"),
        password: yup.string().required().label("Password"),
    })

    const handleFormSubmit = useCallback(
        async (userData) => {            
            axios.post("http://localhost:3001/sign-in", userData).then(res => {
                saveSessionTokenInLocalStorage(res.data)
                router.push("/")
            })
            setState({
                added: true,
            })
        },
        [saveSessionTokenInLocalStorage]
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
                            <div className="mb-6">
                                <FormField name="password" type="password" placeholder="Enter password...">
                                    Password
                                </FormField>
                                <p className="text-red text-xs italic">Please choose a password.</p>
                            </div>
                            <div className="flex items-center justify-between">

                                <button type="submit" className={styles.buttonPrimary}>
                                    Login
                                </button>
                                <a className="inline-block align-baseline font-bold text-sm text-blue hover:text-blue-darker" href="#">
                                    Forgot Password?
                                </a>
                            </div>
                        </div>
                    </div>

                </form>
            )}
        </Formik>
    )
}