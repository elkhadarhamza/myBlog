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

    useEffect(() => {
        async function fetchData(id) {
            if (id != undefined) {
                await axios.get("http://localhost:3001/posts/" + id).then(res => {
                    setPost(res.data)
                })
            } else {
                router.push("/")
            }
        }
        fetchData(postId)
    }, [postId, router])

    const deleteComment = async (commentId) => {
        await axios.delete("http://localhost:3001/comments/" + commentId, { headers: { authentification: state.jwt } }).then(() => {    
            document.getElementById("dev_comment_" + commentId).style.display = "none"        
            document.getElementById("dev_comment_" + commentId).style.display = "none"                
        })
    }

    if (post != undefined) {
        return (
            <>
                <div className="container mx-auto flex flex-wrap py-6">
                    <div className="w-full md:w-3/3 flex flex-col items-center px-3">
                        <Article post={post} deleteEvent={deleteComment}/>
                    </div>
                </div>
            </>
        )
    } else {
        return <div></div>
    }
}
