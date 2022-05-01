import { useContext } from "react"
import AppContext from "./AppContext"

const Journal = () => {
  const {
    state: { data, totalIn, totalOut },
  } = useContext(AppContext)

  return (
    <div className="flex flex-col p-6 border-gray-200">
      <p className="text-center text-3xl">Dashboard</p>
      <table className="border-collapse border border-gray-400">
        <thead>
          <tr>
            <th
              className="border border-gray-300 text-center w-1/2"
              colSpan={2}
            >
              INCOMING
            </th>
            <th
              className="border border-gray-300 text-center w-1/2"
              colSpan={2}
            >
              OUTGOING
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).map(
            ([itemId, { type, description, amount }]) => (
              <tr key={itemId}>
                <td className="border border-gray-300 text-center">
                  {type === "in" ? description : "-"}
                </td>
                <td className="border border-gray-300 text-center w-1/6">
                  {type === "in" ? amount : "-"}
                </td>
                <td className="border border-gray-300 text-center">
                  {type === "out" ? description : "-"}
                </td>
                <td className="border border-gray-300 text-center w-1/6">
                  {type === "out" ? amount : "-"}
                </td>
              </tr>
            )
          )}
          <tr>
            <th className="border border-gray-300 text-center">
              Total incoming
            </th>
            <th className="border border-gray-300 text-center">{totalIn}</th>
            <th className="border border-gray-300 text-center">
              Total outgoing
            </th>
            <th className="border border-gray-300 text-center">{totalOut}</th>
          </tr>
        </tbody>
      </table>
      <p className="text-center text-2xl">Total = {totalIn - totalOut}</p>
    </div>
  )
}

export default Journal
