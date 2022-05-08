import { useContext } from "react"
import Link from "next/link"
import AppContext from "./AppContext"

const Header = () => {
    const { state } = useContext(AppContext)

    let welcomeMessage = null

    if (state != null && state.displayName != undefined) {
        welcomeMessage = "Signed as [" + state.displayName + "]"
    }

    return (
        <>
            <nav className="w-full py-4 bg-blue-800 shadow">
                <div className="w-full container mx-auto flex flex-wrap items-center justify-between">

                    <nav>
                        <ul className="flex items-center justify-between font-bold text-sm text-white uppercase no-underline" suppressHydrationWarning>
                            <li><Link href="/"><a className="hover:text-gray-200 hover:underline px-4">Home</a></Link></li>                            
                            {
                                welcomeMessage != null && <>
                                    <li><Link href="/user-posts"><a className="hover:text-gray-200 hover:underline px-4" suppressHydrationWarning>My posts</a></Link></li>
                                    <li><Link href="/add-post"><a className="hover:text-gray-200 hover:underline px-4">Add post</a></Link></li>
                                </>
                            }
                            <li><Link href="/about"><a className="hover:text-gray-200 hover:underline px-4" suppressHydrationWarning>About</a></Link></li>
                        </ul>
                    </nav>

                    <div className="flex items-center text-lg no-underline text-white pr-6" suppressHydrationWarning>
                        {
                            welcomeMessage != null ?
                                <>
                                    <Link href="/sign-out"><a className="pl-6" suppressHydrationWarning>Sign Out</a></Link>
                                    <span className="pl-6 text-yellow-400" suppressHydrationWarning>{welcomeMessage}</span>
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
