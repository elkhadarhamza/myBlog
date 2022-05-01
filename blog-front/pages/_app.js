import "../styles/globals.css"
import { AppContextProvider } from "./components/AppContext"

const initialState = {
  totalIn: 0,
  totalOut: 0,
  data: [],
}

function MyApp({ Component, pageProps }) {
  const isServer = typeof window === "undefined"

  let journalData = initialState

  if(!isServer) {
    const str_data = localStorage.getItem("data_journal")
    journalData = str_data != null ? JSON.parse(str_data) : initialState
  }

  return (
    <AppContextProvider journalData={journalData}>
      <Component {...pageProps} />
    </AppContextProvider>
  )
}

export default MyApp
