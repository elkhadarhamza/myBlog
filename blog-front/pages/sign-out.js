import { useRouter } from "next/router"
import AppContext from "../components/AppContext"
import { useContext } from "react"

export default function SignOut() {
    const router = useRouter()
    const { saveSessionTokenInLocalStorage } = useContext(AppContext)

    if (typeof window !== "undefined") {
        saveSessionTokenInLocalStorage(null)
        router.push("/")
    }

    return <div></div>
}
