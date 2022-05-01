import Link from "next/link"

const Menu = () => {
  return (
    <ul className="flex p-2">
      <li className="flex-1 mr-2">
        <Link href="/">
          <a className="text-center block border border-blue-500 rounded py-1 px-3 bg-blue-500 hover:bg-blue-700 text-white">
            Add Entry
          </a>
        </Link>
      </li>
      <li className="flex-1 mr-2">
        <Link href="/journal">
          <a className="text-center block border border-blue-500 rounded py-1 px-3 bg-blue-500 hover:bg-blue-700 text-white">
            Journal
          </a>
        </Link>
      </li>
    </ul>
  )
}

export default Menu
