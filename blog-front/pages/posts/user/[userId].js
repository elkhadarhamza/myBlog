import axios from "axios"
import React, { useState } from "react"
import { useContext, useEffect } from "react"
import AppContext from "../../../components/AppContext"
import { useRouter } from "next/router"
import Articles from "../../../components/Articles"
import ReactPaginate from "react-paginate"

export default function UserPosts() {
    const [data, setPosts] = useState([])
    const { state } = useContext(AppContext)
    
    const router = useRouter()
    const { userId } = router.query

    const nbpost = 5
    let currentPage = 0

    const pagginationHandler = (page) => {
        axios.get("http://localhost:3001/users/" + userId + "/posts/?page=" + page.selected + "&nbpost=" + nbpost
        ).then(res => {
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
                        marginPagesDisplayed={3}
                        pageRangeDisplayed={nbpost}
                        onPageChange={pagginationHandler}
                    />
                </div>
            </div>
        </>
    )
}
