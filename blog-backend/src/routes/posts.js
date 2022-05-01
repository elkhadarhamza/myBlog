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

    const post = await CommentsModel.query().insertAndFetch({
      content,
      post_id: postId,
      user_id: sessionUserId
    })
    res.send(post)
  })

  //recuperer post from id
  app.get("/posts/:postId", async (req, res) => {
    const {
      params: { postId }
    } = req

    const post = await PostModel.query().findById(postId)

    if (!post) {
      res.status(404).send({ error: "post not found" })

      
return
    }

    const comments = await post.$relatedQuery("comments")

    res.send({id: post.id, title: post.title, content: post.content, is_published: post.is_published, comments: comments})
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
      body: { title, content, is_published},
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
      res.send({id: post.id, title: post.title, content: post.content, is_published: post.is_published})
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
      res.send({message : "post deleted with success"})
    }
  })

  //delete comments from comment_id
  app.delete("/comments/:commentId", async (req, res) => {
    const {
      params: { commentId: cId },
    } = req

    const comment = await CommentsModel.query().findById(Number(cId))

    if (!comment) {
      res.status(404).send({ error: "comment not found" })
    } else {
      await comment.$query().delete()
      res.send({message : "comment deleted with success"})
    }
  })
}

export default postsRoute
