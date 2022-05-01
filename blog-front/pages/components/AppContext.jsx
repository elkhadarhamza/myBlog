import { createContext, useCallback, useState } from "react"
import deepmerge from "deepmerge"

const AppContext = createContext()

export const AppContextProvider = (props) => {
  const [state, setState] = useState(props.journalData)

  const addEntry = useCallback((entry) => {
    setState((currentState) => {
      const finalState = deepmerge(currentState, {
        data: [
          {
            type: entry.type,
            amount: entry.amount,
            description: entry.description,
          },
        ],
        totalIn:
          currentState.totalIn + (entry.type === "in" ? +entry.amount : 0),
        totalOut:
          currentState.totalOut + (entry.type === "out" ? +entry.amount : 0),
      })
      localStorage.setItem("data_journal", JSON.stringify(finalState))

      return finalState
    }
    )
  }, [])

  return <AppContext.Provider {...props} value={{ state, addEntry }} />
}
export default AppContext
