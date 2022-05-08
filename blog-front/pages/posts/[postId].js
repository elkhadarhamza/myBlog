import axios from "axios"
import React, { useState } from "react"
import Article from "../../components/Article"
import { useContext, useEffect } from "react"
import AppContext from "../../components/AppContext"
import { useRouter } from "next/router"

export default function UserPosts() {
    const [post, setPost] = useState()
    const { state } = useContext(AppContext)
    const router = useRouter()
    const { postId } = router.query

    const getData = async () => {
        await axios.get("http://localhost:3001/posts/" + postId).then(res => {
            setPost(res.data)
        })
    }

    useEffect(() => {
        getData()
    }, [])

    if(post != undefined) {
        return (
            <>
                <div className="container mx-auto flex flex-wrap py-6">
                    <div className="w-full md:w-3/3 flex flex-col items-center px-3">
                        <Article post={post} />   
                    </div>
                </div>
            </>
        )
    } else {
        return <div></div>
    }
}
