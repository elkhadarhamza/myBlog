import Link from "next/link"
const Articles = (props) => {
    const { posts } = props

    if (posts != undefined && posts.length > 0) {
        return (
            posts.map((post, index) => {
                return (
                    <article className="flex flex-col shadow my-4 w-3/4" key={index}>
                        <div className="bg-white flex flex-col justify-start p-6">
                            <span href="#" className="text-3xl font-bold hover:text-gray-700 pb-4">{post.title}</span>
                            <p href="#" className="text-sm pb-3">
                                By <Link href={"/posts/user/" + post.user_id}><a className="font-semibold hover:text-gray-800">{post.author}</a></Link>,
                                <span className={post.is_published != true ? "text-red-500" : ""}>{post.is_published == true ? " Published on " + post.publication_date : " Not Published, Created on " + post.publication_date}</span>
                            </p>
                            <span href="#" className="pb-6">{post.content}...</span>
                            {
                                post.is_published == true ? <Link href={"/posts/" + post.id}><a className="text-blue-700 text-sm font-bold uppercase pb-4">Continue Reading</a></Link> : ""
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