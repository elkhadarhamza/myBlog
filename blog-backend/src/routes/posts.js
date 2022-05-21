import PostModel from "../db/models/PostModel.js"
import CommentsModel from "../db/models/CommentsModel.js"
import UserModel from "../db/models/UserModel.js"
import auth from "../middlewares/auth.js"

const postsRoute = ({ app }) => {
  //add post
  app.post("/posts", auth, async (req, res) => {
    const {
      body: { title, content, is_published },
      session: { userId: user_id }
    } = req

    const user = await UserModel.query().findById(user_id)

    if (user && (user.userType === "admin" || user.userType === "autheur")) {
      const post = await PostModel.query().insertAndFetch({
        title,
        content,
        is_published,
        user_id
      })
      res.send(post)
    } else {
      res.status(404).send({ error: "you can't update this post" })
    }
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
      postComments.push({ id: comment.id, content: comment.content, created_at: commentdate.toLocaleDateString(), author: commentAuthor.displayName, user_id: commentAuthor.id })
    }
    const author = await post.$relatedQuery("author")
    const date = new Date(post.publication_date)
    res.send({
      id: post.id, title: post.title, content: post.content, publication_date: date.toLocaleDateString(), user_id: post.user_id,
      author: author.displayName, comments: postComments
    })
  })

  //update comments
  app.put("/posts/:postId/comments/:commentId", auth, async (req, res) => {
    const {
      params: { postId, commentId },
      body: { content },
      session: { userId: sessionUserId }
    } = req

    const numberOfAffectedRows = await CommentsModel.query().update({ content: content }).where("id", commentId).where("user_id", sessionUserId).where("post_id", postId)


    const post = await PostModel.query().findById(postId).where("posts.is_published", true)

    if (numberOfAffectedRows == 0 || !post) {
      res.status(404).send({ error: "post not found, or not published" })

      return
    }

    const comments = await post.$relatedQuery("comments").orderBy("id", "DESC")
    let postComments = []
    for (let i in comments) {
      const comment = comments[i]
      const commentAuthor = await comment.$relatedQuery("author")
      const commentdate = new Date(comment.created_at)
      postComments.push({ id: comment.id, content: comment.content, created_at: commentdate.toLocaleDateString(), author: commentAuthor.displayName, user_id: commentAuthor.id })
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

  //get post for editing
  app.get("/posts/edit/:postId", async (req, res) => {
    const {
      params: { postId }
    } = req

    const post = await PostModel.query().findById(postId)

    if (!post) {
      res.status(404).send({ error: "post not found, or not published" })

      return
    }

    res.send({
      id: post.id, title: post.title, content: post.content, is_published: post.is_published
    })
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
      postComments.push({ id: comment.id, content: comment.content, created_at: commentdate.toLocaleDateString(), author: commentAuthor.displayName, user_id: commentAuthor.id })
    }
    const author = await post.$relatedQuery("author")
    const date = new Date(post.publication_date)
    res.send({
      id: post.id, title: post.title, content: post.content, publication_date: date.toLocaleDateString(), user_id: post.user_id,
      author: author.displayName, is_published: post.is_published, comments: postComments
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
      .findById(postId).where("user_id", sessionUserId)
      .patch({
        title: title, content: content, is_published: is_published
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
      session: { userId: sessionUserId }
    } = req

    const post = await PostModel.query().findById(Number(pId))//.where("user_id", sessionUserId)

    if (!post) {
      res.status(404).send({ error: "post not found" })
    } else {
      let deleteDone = false

      if (post.user_id === sessionUserId) {
        await post.$relatedQuery("comments").delete()
        await post.$query().delete()
        deleteDone = true
      } else {
        const author = await UserModel.query().findById(sessionUserId)

        if (author.userType === "admin") {
          await post.$relatedQuery("comments").delete()
          await post.$query().delete()
          deleteDone = true
        }
      }

      if (deleteDone) {
        res.send({ message: "post deleted with success" })
      } else {
        res.status(404).send({ error: "you cannot delete this post" })
      }
    }
  })

  //delete comments from comment_id
  app.delete("/comments/:commentId", auth, async (req, res) => {
    const {
      params: { commentId: cId },
      session: { userId: sessionUserId }
    } = req

    const comment = await CommentsModel.query().findById(Number(cId))

    if (!comment) {
      res.status(404).send({ error: "comment not found" })
    } else {
      let deleteDone = false

      if (comment.user_id === sessionUserId) { //commentaire de la personne connecté
        await comment.$query().delete()
        deleteDone = true
      } else {
        const post = await comment.$relatedQuery("post")

        if (post.user_id === sessionUserId) { //post de la personne connecté
          await comment.$query().delete()
          deleteDone = true
        } else {
          const author = await UserModel.query().findById(sessionUserId)

          if (author.userType === "admin") { // la personne connecté est un admin
            await comment.$query().delete()
            deleteDone = true
          }
        }
      }

      if (deleteDone) {
        res.send({ message: "comment deleted with success" })
      } else {
        res.status(404).send({ error: "you cannot delete this comment" })
      }
    }
  })
}

export default postsRoute