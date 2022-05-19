import PostModel from "../db/models/PostModel.js"
import CommentsModel from "../db/models/CommentsModel.js"
import auth from "../middlewares/auth.js"

const postsRoute = ({ app }) => {
  //add post
  app.post("/posts", auth, async (req, res) => {
    const {
      body: { title, content, is_published },
      session: { userId: user_id }
    } = req

    const post = await PostModel.query().insertAndFetch({
      title,
      content,
      is_published,
      user_id
    })
    res.send(post)
  })

  //add comment
  app.post("/posts/:postId/comments", auth, async (req, res) => {
    const {
      params: { postId },
      body: { content },
      session: { userId: sessionUserId }
    } = req

    await CommentsModel.query().insertAndFetch({
      content,
      post_id: postId,
      user_id: sessionUserId
    })
    

    const post = await PostModel.query().findById(postId).where("posts.is_published", true)

    if (!post) {
      res.status(404).send({ error: "post not found, or not published" })

      return
    }

    const comments = await post.$relatedQuery("comments").orderBy("id", "DESC")
    let postComments = []
    for (let i in comments) {
      const comment = comments[i]
      const commentAuthor = await comment.$relatedQuery("author")
      const commentdate = new Date(comment.created_at)
      postComments.push({id: comment.id, content: comment.content, created_at: commentdate.toLocaleDateString(), author: commentAuthor.displayName, user_id: commentAuthor.id})
    }
    const author = await post.$relatedQuery("author")
    const date = new Date(post.publication_date)
    res.send({
      id: post.id, title: post.title, content: post.content, publication_date: date.toLocaleDateString(), user_id: post.user_id,
      author: author.displayName, comments: postComments
    })
  })

  app.get("/posts", async (req, res) => {
    let page = Number(req.query.page)
    let nbpost = Number(req.query.nbpost)

    if (isNaN(page)) {
      page = 0
    }

    if (isNaN(nbpost)) {
      nbpost = 0
    }

    const posts = await PostModel.query().where("posts.is_published", true).orderBy("id", "DESC").page(page, nbpost)
    let postsToSend = []
    for (let i in posts.results) {
      const post = posts.results[i]
      const comments = await post.$relatedQuery("comments")
      const author = await post.$relatedQuery("author")
      const date = new Date(post.publication_date)
      postsToSend.push({
        id: post.id, title: post.title, content: post.content.substring(0, 250), publication_date: date.toLocaleDateString(), user_id: post.user_id,
        author: author.displayName, nbComments: comments.length, is_published: true
      })
    }

    res.send({ posts: postsToSend, total: posts.total })
  })

  //recuperer post from id
  app.get("/posts/:postId", async (req, res) => {
    const {
      params: { postId }
    } = req

    const post = await PostModel.query().findById(postId).where("posts.is_published", true)

    if (!post) {
      res.status(404).send({ error: "post not found, or not published" })

      return
    }

    const comments = await post.$relatedQuery("comments").orderBy("id", "DESC")
    let postComments = []
    for (let i in comments) {
      const comment = comments[i]
      const commentAuthor = await comment.$relatedQuery("author")
      const commentdate = new Date(comment.created_at)
      postComments.push({id: comment.id, content: comment.content, created_at: commentdate.toLocaleDateString(), author: commentAuthor.displayName, user_id: commentAuthor.id})
    }
    const author = await post.$relatedQuery("author")
    const date = new Date(post.publication_date)
    res.send({
      id: post.id, title: post.title, content: post.content, publication_date: date.toLocaleDateString(), user_id: post.user_id,
      author: author.displayName, comments: postComments
    })
  })

  //recuper all post comments by postid
  app.get("/posts/:postId/comments", async (req, res) => {
    const {
      params: { postId }
    } = req

    const post = await PostModel.query().findById(postId)

    if (!post) {
      res.status(404).send({ error: "post not found" })

      return
    }

    const comments = await post.$relatedQuery("comments")

    res.send(comments)
  })

  //update post
  app.put("/posts/:postId", auth, async (req, res) => {
    const {
      body: { title, content, is_published },
      params: { postId },
      session: { userId: sessionUserId }
    } = req

    const post = await PostModel.query()
      .findById(postId)
      .patch({
        title: title, content: content, is_published: is_published, user_id: sessionUserId
      })

    if (!post) {
      res.status(404).send({ error: "post not found" })
    } else {
      res.send({ id: post.id, title: post.title, content: post.content, is_published: post.is_published })
    }
  })

  //delete post by id
  app.delete("/posts/:postId", auth, async (req, res) => {
    const {
      params: { postId: pId },
    } = req

    const post = await PostModel.query().findById(Number(pId))

    if (!post) {
      res.status(404).send({ error: "post not found" })
    } else {
      //delet post from DB
      await post.$query().delete()
      //and delete post comments from DB
      await post.$relatedQuery("comments").delete()
      res.send({ message: "post deleted with success" })
    }
  })

  //delete comments from comment_id
  app.delete("/comments/:commentId", auth, async (req, res) => {
    const {
      params: { commentId: cId },
      session: { userId: sessionUserId }
    } = req

    console.log("delete comments : " + cId)

    const comment = await CommentsModel.query().findById(Number(cId)).where("comments.user_id", sessionUserId)

    if (!comment) {
      res.status(404).send({ error: "comment not found" })
    } else {
      await comment.$query().delete()
      res.send({ message: "comment deleted with success" })
    }
  })
}

export default postsRoute