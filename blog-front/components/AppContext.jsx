import { createContext, useCallback, useState } from "react"

const AppContext = createContext()

export const AppContextProvider = (props) => {
  const [state, setState] = useState(props)

  const saveSessionTokenInLocalStorage = useCallback((sessionToken) => {
    setState(sessionToken)

    if (typeof window !== "undefined") {
      localStorage.setItem("blog_session_token", JSON.stringify(sessionToken))
    }
  }, [])

  return <AppContext.Provider {...props} value={{ state, saveSessionTokenInLocalStorage }} />
}
export default AppContext
