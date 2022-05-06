import { useContext } from "react"
import Link from "next/link"
import styles from "../styles/header.module.css"
import Image from "next/image"
import AppContext from "./AppContext"

const Header = () => {
    const { state } = useContext(AppContext)

    console.log(state)

    if (state != null && state.displayName != undefined) {
        const welcomeMessage = "Welcome " + state.displayName

        return (
            <header suppressHydrationWarning> 
                <div className={styles.container} suppressHydrationWarning>
                    <div><Link href="/"><a><Image src="/logo.png" alt="MyBlog" width={120} height={75} /></a></Link></div>
                    <div className="m-auto" suppressHydrationWarning>{welcomeMessage}</div>
                    <div className="mt-2" suppressHydrationWarning>
                        <Link href="/sign-out"><a className={styles.buttonPrimary} suppressHydrationWarning>SIGN OUT</a></Link>
                    </div>
                </div>
            </header>
        )
    } else {
        return (
            <header>
                <div className={styles.container} suppressHydrationWarning>
                    <div><Link href="/"><a><Image src="/logo.png" alt="MyBlog" width={120} height={75} /></a></Link></div>
                    <div className="mt-2" suppressHydrationWarning>
                        <Link href="/sign-in"><a className={styles.buttonPrimary} suppressHydrationWarning>SIGN IN</a></Link>
                        <Link href="/sign-up"><a className={styles.buttonPrimary} suppressHydrationWarning>SIGN UP</a></Link>
                    </div>
                </div>
            </header>
        )
    }
}

export default Header
