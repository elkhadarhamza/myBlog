import Link from "next/link"
import { useContext } from "react"
import AppContext from "./AppContext"
import { useRouter } from "next/router"
import axios from "axios"

const Articles = (props) => {
    const { posts } = props
    const router = useRouter()
    const { state } = useContext(AppContext)

    const deletePost = async (postId) => {
        await axios.delete("http://localhost:3001/posts/" + postId, { headers: { authentification: state.jwt } }).then(() => {
            document.getElementById("dev_post_" + postId).style.display = "none"
        })
    }


    if (posts != undefined && posts.length > 0) {
        return (
            posts.map((post, index) => {
                return (
                    <article className="flex flex-col shadow my-4 w-3/4" key={index} id={"dev_post_" + post.id}>
                        <div className="bg-white flex flex-col justify-start p-6">
                            <span href="#" className="text-3xl font-bold hover:text-gray-700 pb-4">{post.title}</span>
                            <p href="#" className="text-sm pb-3">
                                By <Link href={"/posts/user/" + post.user_id}><a className="font-semibold hover:text-gray-800 underline">{post.author}</a></Link>,
                                <span className={post.is_published != true ? "text-red-500" : ""}>{post.is_published == true ? " Published on " + post.publication_date : " Not Published, Created on " + post.publication_date}
                                </span><span className="text-green-600 text-xs italic">{post.nbComments > 0 ? ", " + post.nbComments + " Comments" : ""}</span>
                            </p>
                            <span className="pb-6">{post.content}...</span>
                            {
                                post.is_published == true ? <Link href={"/posts/" + post.id}><a className="text-blue-700 text-sm font-bold uppercase pb-4">Continue Reading</a></Link> : ""
                            }
                            {
                                (state?.id === post.user_id || state?.userType === "admin") && <>
                                    <div className="self-end">
                                        {state?.id === post.user_id &&
                                            <button className="mt-1 w-auto bg-blue-600 hover:bg-blue-500 text-green-100 border py-1 px-5 font-semibold text-md rounded"
                                                onClick={() => router.push("/posts/edit/" + post.id)}>
                                                Edit
                                            </button>
                                        }
                                        <button className="mt-1 w-auto bg-red-600 hover:bg-blue-500 text-green-100 border py-1 px-5 font-semibold text-md rounded"
                                            onClick={() => deletePost(post.id)}>
                                            Delete
                                        </button>
                                    </div>
                                </>
                            }

                        </div>

                    </article>
                )
            })
        )
    } else {
        return (<h3>No posts yet</h3>)
    }
}

export default Articles