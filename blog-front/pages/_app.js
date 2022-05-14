import React, { useState, useEffect } from "react"
import "../styles/globals.css"
import { AppContextProvider } from "../components/AppContext"
import Layout from "../components/Layout"
import axios from "axios"

function MyApp({ Component, pageProps }) {
  const [state, setState] = useState({ userId: undefined, userName: undefined, userType: undefined })

  const isServer = typeof window === "undefined"

  let jwt = null

  if (!isServer) {
    const blog_session_token = localStorage.getItem("blog_session_token")
    jwt = blog_session_token != null ? JSON.parse(blog_session_token) : undefined
  }

  useEffect(() => {
    if (jwt != null) {
      async () => {
        await axios.get("http://localhost:3001/users/auto-sign-in", {
          headers: { authentification: jwt.jwt }
        }).then(res => {
          setState({ userId: res.data.id, userName: res.data.displayName, userType: res.data.userType })
        })
      }
    }
  }, [jwt])

  if (Component.name == "SignIn") {
    return (
      <AppContextProvider {...jwt}>
        <Component {...pageProps} />
      </AppContextProvider>
    )
  } else {
    return (
      <AppContextProvider {...jwt}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AppContextProvider>
    )
  }
}

export default MyApp
