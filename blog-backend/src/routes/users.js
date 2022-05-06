import UserModel from "../db/models/UserModel.js"
import auth from "../middlewares/auth.js"
import md5 from "md5"

const usersRoute = ({ app }) => {
  //add user
  app.post("/users", async (req, res) => {
    const {
      body: { email, password, displayName },
    } = req

    const userWithThisEmail = await UserModel.query().findOne({
      email: email,
    })

    if (userWithThisEmail) {
      res.status(404).send({ error: "user already exists, please choose another email" })
    } else {
      const passwordHash = md5(password)
      const userType = "reader"
      const user = await UserModel.query().insertAndFetch({
        email,
        passwordHash,
        displayName,
        userType
      })
      res.send({ id: user.id, email: user.email, displayName: user.displayName, userType: user.userType, active: user.is_active })
    }
  })

  app.get("/users/auto-sign-in", auth, async (req, res) => {
    const {
      session: { userId: sessionUserId }
    } = req

    const user = await UserModel.query().findById(sessionUserId)

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

  //update user by id
  app.put("/users/:userId", auth, async (req, res) => {
    const {
      body: { email, password, displayName, userType },
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
        email: email, passwordHash: md5(password), displayName: displayName, userType: userType
      })

    if (!user) {
      res.status(404).send({ error: "user not found" })
    } else {
      res.send({ id: user.id, email: user.email, displayName: user.displayName, userType: user.userType, active: user.is_active })
    }
  })

  //delete user, post and comments
  app.delete("/users/:userId", auth, async (req, res) => {
    const {
      params: { userId: uId },
      session: { userId: sessionUserId }
    } = req

    if (Number(uId) !== sessionUserId) {
      res.status(403).send({ error: "forbidden" })

      return
    }

    const user = await UserModel.query().findById(Number(uId))

    if (!user) {
      res.status(404).send({ error: "user not found" })
    } else {
      //delete user from DB
      await user.$query().delete()

      //delete user's comments from DB
      await user.$relatedQuery("posts_comments").delete()

      //delete user's posts from DB
      await user.$relatedQuery("posts").delete()

      res.send({ message: "user deleted with success" })
    }
  })
}
export default usersRoute
