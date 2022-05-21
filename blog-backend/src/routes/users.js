import UserModel from "../db/models/UserModel.js"
import PostModel from "../db/models/PostModel.js"
import auth from "../middlewares/auth.js"
import md5 from "md5"
import jsonwebtoken from "jsonwebtoken"
import config from "../config.js"

const usersRoute = ({ app }) => {
  //get all users
  app.get("/users", auth, async (req, res) => {
    const {
      session: { userId: sessionUserId }
    } = req

    const admin = await UserModel.query().findById(sessionUserId).where("userType", "supper-admin").orWhere("userType", "admin")

    if (!admin) {
      res.status(404).send({ error: "user not found" })

      return
    }

    const users = await UserModel.query().where("id", "<>", admin.id).where("userType", "<>", "supper-admin").orderBy("id", "DESC")

    let usersToSend = []
    for (let i in users) {
      const user = users[i]
      usersToSend.push({
        id: user.id, email: user.email, displayName: user.displayName, userType: user.userType, active: user.is_active
      })
    }

    res.send(usersToSend)
  })

  //add user
  app.post("/users", async (req, res) => {
    const {
      body: { email, password, displayName },
    } = req

    const userWithThisEmail = await UserModel.query().findOne({
      email: email,
    })

    if (userWithThisEmail) {
      res.status(404).send({ error: "email already exists, please choose another email" })
    } else {
      const passwordHash = md5(password)
      const userType = "reader"
      const user = await UserModel.query().insertAndFetch({
        email,
        passwordHash,
        displayName,
        userType
      })

      const jwt = jsonwebtoken.sign(
        {
          payload: {
            userId: user.id
          }
        },
        config.security.session.secret,
        {
          expiresIn: config.security.session.expiresIn
        }
      )
      res.send({ jwt, id: user.id, displayName: user.displayName, userType: user.userType })
    }
  })

  app.get("/users/auto-sign-in", auth, async (req, res) => {
    const {
      session: { userId: sessionUserId }
    } = req

    const user = await UserModel.query().findById(sessionUserId).where("is_active", true)

    if (!user) {
      res.status(404).send({ error: "user not found" })

      return
    }

    res.send({ id: user.id, displayName: user.displayName, userType: user.userType })
  })

  //get user by id
  app.get("/users/:userId", auth, async (req, res) => {
    const {
      params: { userId },
      session: { userId: sessionUserId },
    } = req

    if (Number(userId) !== sessionUserId) {
      console.log(sessionUserId)
      res.status(403).send({ error: "forbidden" })

      return
    }

    const user = await UserModel.query().findById(userId)

    if (!user) {
      res.status(404).send({ error: "user not found" })

      return
    }

    res.send({ id: user.id, email: user.email, displayName: user.displayName, userType: user.userType, active: user.is_active })
  })

  //get connected user posts (include not published posts)
  app.get("/users/:userId/posts", auth, async (req, res) => {
    const {
      params: { userId },
      session: { userId: sessionUserId },
    } = req


    if (Number(userId) !== sessionUserId) {
      console.log(sessionUserId)
      res.status(403).send({ error: "forbidden" })

      return
    }

    let page = Number(req.query.page)
    let nbpost = Number(req.query.nbpost)

    if (isNaN(page)) {
      page = 0
    }

    if (isNaN(nbpost)) {
      nbpost = 0
    }

    console.log(auth)
    let posts = null

    posts = await PostModel.query().alias("p").where("p.user_id", userId).orderBy("id", "DESC").page(page, nbpost)

    let postsToSend = []
    for (let i in posts.results) {
      const post = posts.results[i]
      const comments = await post.$relatedQuery("comments")
      const author = await post.$relatedQuery("author")
      const date = new Date(post.publication_date)
      postsToSend.push({
        id: post.id, title: post.title, content: post.content.substring(0, 250), publication_date: date.toLocaleDateString(), user_id: post.user_id, is_published: post.is_published,
        author: author.displayName, nbComments: comments.length
      })
    }

    res.send({ posts: postsToSend, total: posts.total })
  })

  //get user published posts
  app.get("/users/:userId/published/posts", async (req, res) => {
    const {
      params: { userId }
    } = req

    let page = Number(req.query.page)
    let nbpost = Number(req.query.nbpost)

    if (isNaN(page)) {
      page = 0
    }

    if (isNaN(nbpost)) {
      nbpost = 0
    }

    console.log(auth)
    let posts = null

    posts = await PostModel.query().alias("p").where("p.user_id", userId).where("p.is_published", true).orderBy("id", "DESC").page(page, nbpost)

    let postsToSend = []
    for (let i in posts.results) {
      const post = posts.results[i]
      const comments = await post.$relatedQuery("comments")
      const author = await post.$relatedQuery("author")
      const date = new Date(post.publication_date)
      postsToSend.push({
        id: post.id, title: post.title, content: post.content.substring(0, 250), publication_date: date.toLocaleDateString(), user_id: post.user_id, is_published: post.is_published,
        author: author.displayName, nbComments: comments.length
      })
    }

    res.send({ posts: postsToSend, total: posts.total })
  })

  //update user by id
  app.put("/users/:userId", auth, async (req, res) => {
    const {
      body: { password, displayName },
      params: { userId },
      session: { userId: sessionUserId }
    } = req

    if (Number(userId) !== sessionUserId) {
      res.status(403).send({ error: "forbidden" })

      return
    }

    const user = await UserModel.query()
      .findById(userId)
      .patch({
         passwordHash: md5(password), displayName: displayName
      })

    if (!user) {
      res.status(404).send({ error: "user not found" })
    } else {
      res.send({ id: user.id, email: user.email, displayName: user.displayName, userType: user.userType, active: user.is_active })
    }
  })

  //manage user profil
  app.put("/users/:userId/profil", auth, async (req, res) => {
    const {
      params: { userId },
      body: { profil },
      session: { userId: sessionUserId }
    } = req

    if (Number(userId) !== sessionUserId) {
      const admin = await UserModel.query().findById(sessionUserId).where("userType", "supper-admin").orWhere("userType", "admin")

      if (!admin) {
        res.status(403).send({ error: "forbidden" })

        return
      }
    }

    const user = await UserModel.query()
      .findById(userId)
      .patch({
        userType: profil
      })

    if (!user) {
      res.status(404).send({ error: "user not found" })
    } else {
      res.send("user updated")
    }
  })

  //manage user status
  app.put("/users/:userId/status", auth, async (req, res) => {
    const {
      params: { userId },
      body: { etat },
      session: { userId: sessionUserId }
    } = req

    if (Number(userId) !== sessionUserId) {
      const admin = await UserModel.query().findById(sessionUserId).where("userType", "supper-admin").orWhere("userType", "admin")

      if (!admin) {
        res.status(403).send({ error: "forbidden" })

        return
      }
    }

    const user = await UserModel.query()
      .findById(userId)
      .patch({
        is_active: etat
      })

    if (!user) {
      res.status(404).send({ error: "user not found" })
    } else {
      res.send("user updated")
    }
  })

  //delete user, post and comments
  app.delete("/users/:userId", auth, async (req, res) => {
    const {
      params: { userId: uId },
      session: { userId: sessionUserId }
    } = req

    if (Number(uId) !== sessionUserId) {
      const admin = await UserModel.query().findById(sessionUserId).where("userType", "supper-admin").orWhere("userType", "admin")

      if (!admin) {
        res.status(403).send({ error: "forbidden" })

        return
      }
    }

    const user = await UserModel.query().findById(Number(uId))

    if (!user) {
      res.status(404).send({ error: "user not found" })
    } else {
      //delete user's comments from DB
      await user.$relatedQuery("posts_comments").delete()

      //delete user's posts from DB
      await user.$relatedQuery("posts").delete()

      //delete user from DB
      await user.$query().delete()

      res.send({ message: "user deleted with success" })
    }
  })
}
export default usersRoute
