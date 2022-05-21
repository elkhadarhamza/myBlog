import styles from "../styles/header.module.css"
import Image from "next/image"
import { Formik } from "formik"
import { useContext, useCallback, useState, useEffect } from "react"
import AppContext from "./AppContext"
import * as yup from "yup"
import FormField from "./FormField"
import axios from "axios"
import { useRouter } from "next/router"

export default function FormEditAccount() {
    const router = useRouter()
    const { state, saveSessionTokenInLocalStorage } = useContext(AppContext)
    const [error, setError] = useState("")
    const [user, setUserData] = useState({})

    useEffect(() => {
        async function fetchData(id) {
            if (id != undefined) {
                await axios.get("http://localhost:3001/users/" + id, { headers: { authentification: state?.jwt } }).then(res => {
                    setUserData(res.data)
                })
            } else {
                router.push("/")
            }
        }
        fetchData(state?.id)
    }, [router, state?.id, state?.jwt])

    const validationSchema = yup.object().shape({
        password: yup.string().trim().required().label("Password"),
        confirmpassword: yup.string().trim().required().oneOf([yup.ref("password"), null], "Passwords must match").label("Password"),
        displayName: yup.string().trim().required().label("Display name")
    })

    const handleFormSubmit = useCallback(
        async (userData) => {
            axios.put("http://localhost:3001/users/" + user.id, userData, { headers: { authentification: state?.jwt } }).then(() => { 
                saveSessionTokenInLocalStorage({...state, displayName: userData.displayName})               
                router.push("/")
            }).catch(function (error) {
                error
                setError("Your password could not be validated. Please check them and try again")
            })
        }, [router, saveSessionTokenInLocalStorage, state, user.id]
    )

    return (
        <Formik
            onSubmit={handleFormSubmit}
            initialValues={{
                password: "",
                displayName: user?.displayName,
                confirmpassword: ""
            }}
            validationSchema={validationSchema}
            enableReinitialize
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
                                <FormField name="email" placeholder="Enter your email..." value={user?.email} disabled>
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
                            <div className="items-center">
                                <button className={styles.buttonPrimary} onClick={() => router.back()}>
                                    Cancel
                                </button>
                                <button type="submit" className={styles.buttonPrimary}>
                                    Save
                                </button>
                            </div>
                            <p className="text-red text-red-500">{error}</p>
                        </div>
                    </div>

                </form>
            )}
        </Formik>
    )
}