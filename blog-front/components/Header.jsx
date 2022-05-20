import { useContext } from "react"
import Link from "next/link"
import AppContext from "./AppContext"
import Popup from "reactjs-popup"
import "reactjs-popup/dist/index.css"
import axios from "axios"
import { useRouter } from "next/router"

const Header = () => {
    const { state, saveSessionTokenInLocalStorage } = useContext(AppContext)
    const router = useRouter()

    let welcomeMessage = null

    if (state != null && state.displayName != undefined) {
        welcomeMessage = "Signed as [" + state.displayName + "] (" + state.userType + ")"
    }

    const deleteAccount = async () => {
        if (state !== null && state.id !== undefined) {
            await axios.delete("http://localhost:3001/users/" + state.id, { headers: { authentification: state.jwt } }).then(() => {
                saveSessionTokenInLocalStorage(null)
                router.reload()
            })
        }
    }

    return (
        <>
            <nav className="w-full py-4 bg-blue-800 shadow">
                <div className="w-full container mx-auto flex flex-wrap items-center justify-between">
                    <nav>
                        <ul className="flex items-center justify-between font-bold text-sm text-white uppercase no-underline" suppressHydrationWarning>
                            {
                                state?.userType !== "supper-admin" ? <li><Link href="/"><a className="hover:text-gray-200 hover:underline px-4">Home</a></Link></li> : <></>
                            }
                            {
                                state?.id !== undefined && <>
                                    {
                                        (state?.userType === "autheur" || state?.userType === "admin") &&
                                        <>
                                            <li><Link href="/user-posts"><a className="hover:text-gray-200 hover:underline px-4" suppressHydrationWarning>My posts</a></Link></li>
                                            <li><Link href="/add-post"><a className="hover:text-gray-200 hover:underline px-4">Add post</a></Link></li>
                                        </>
                                    }
                                </>
                            }
                            {
                                (state?.userType === "supper-admin" || state?.userType === "admin") &&
                                <li><Link href="/manage-users"><a className="hover:text-gray-200 hover:underline px-4">Manage users</a></Link></li>
                            }
                            <li><Link href="/about"><a className="hover:text-gray-200 hover:underline px-4" suppressHydrationWarning>About</a></Link></li>
                        </ul>
                    </nav>

                    <div className="flex items-center text-lg no-underline text-white pr-6" suppressHydrationWarning>
                        {
                            state?.id !== undefined ?
                                <>
                                    <Link href="/sign-out"><a className="pl-6" suppressHydrationWarning>Logout</a></Link>
                                    <span className="pl-6 text-yellow-400" suppressHydrationWarning>{welcomeMessage}</span>
                                    {(state?.userType === "reader" || state?.userType === "autheur" || state?.userType === "admin") &&
                                        <Popup
                                            trigger={<button className="bg-red-600 text-xs hover:bg-blue-500 text-green-100 border m-1 font-semibold text-md rounded">Remove account</button>}
                                            modal
                                            nested
                                        >
                                            {close => (
                                                <div className="modal">
                                                    <button className="close" onClick={close}>
                                                        &times;
                                                    </button>
                                                    <div className="header"> Remove Account </div>
                                                    <div className="content">
                                                        <p className="text-2xl text-center">Are you sure you want to delete your account ? all posts and comments will be deleted</p>
                                                    </div>
                                                    <div className="actions">
                                                        <button className="bg-red-600 text-xs p-1 hover:bg-blue-500 text-green-100 border m-1 font-semibold text-md rounded"
                                                            onClick={() => deleteAccount()}
                                                        >Remove account</button>
                                                        <button className="bg-green-600 text-xs p-1 hover:bg-blue-500 text-green-100 border m-1 font-semibold text-md rounded"
                                                            onClick={() => { close() }}>Cancel</button>
                                                    </div>
                                                </div>
                                            )}
                                        </Popup>
                                    }
                                </> :
                                <>
                                    <Link href="/sign-up"><a className="pl-6" suppressHydrationWarning>Sign Up</a></Link>
                                    <Link href="/sign-in"><a className="pl-6" suppressHydrationWarning>Sign In</a></Link>
                                </>
                        }
                    </div>
                </div>
            </nav>

            <header className="w-full container mx-auto">
                <div className="flex flex-col items-center p-8 border">
                    <a className="font-bold text-gray-800 uppercase hover:text-gray-700 text-5xl" href="#">
                        Hamza's Blog
                    </a>
                </div>
            </header>
        </>
    )
}

export default Header
