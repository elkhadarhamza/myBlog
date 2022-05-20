import axios from "axios"
import React, {  useState } from "react"
import Articles from "../components/Articles"
import ReactPaginate from "react-paginate"

export default function Home() {
  const [data, setPosts] = useState([])
  const nbpost = 5
  let currentPage = 0

  const pagginationHandler = (page) => {    
    axios.get("http://localhost:3001/posts/?page=" + page.selected + "&nbpost=" + nbpost).then(res => {
      currentPage = page
      setPosts(res.data)
    })
  }

  return (
    <>
      <div className="container mx-auto flex flex-wrap py-6">
        <div className="w-full md:w-3/3 flex flex-col items-center px-3">
          <Articles posts={data.posts} />
          <ReactPaginate
            previousLabel={"previous"}
            nextLabel={"next"}
            breakLabel={"..."}
            breakClassName={"break-me"}
            activeClassName={"active"}
            containerClassName={"pagination"}
            subContainerClassName={"pages pagination"}
            initialPage={currentPage}
            pageCount={Math.ceil(data.total / nbpost)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={nbpost}
            onPageChange={pagginationHandler}
          />
        </div>
      </div>
    </>
  )
}
