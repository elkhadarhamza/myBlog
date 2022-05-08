import Link from "next/link"
const Article = (props) => {
    const { post } = props

    return (
        <article className="flex flex-col shadow my-4 w-3/4">
            <div className="bg-white flex flex-col justify-start p-6">
                <a href="#" className="text-3xl font-bold hover:text-gray-700 pb-4">{post.title}</a>
                <p href="#" className="text-sm pb-3">
                    By <a href="#" className="font-semibold hover:text-gray-800">{post.author}</a>, Published on {post.publication_date}
                </p>
                <a href="#" className="pb-6">{post.content}</a>
                <Link href={"/posts/" + post.id}><a className="text-blue-700 text-sm font-bold uppercase pb-4">Continue Reading</a></Link>
            </div>
        </article>
        
    )
}

export default Article