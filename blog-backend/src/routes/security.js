import jsonwebtoken from "jsonwebtoken"
import config from "../config.js"
import UserModel from "../db/models/UserModel.js"
import md5 from "md5"

const securityRoute = ({ app }) => {
  app.post("/sign-in", async (req, res) => {
    const {
      body: { email, password },
    } = req

    const user = await UserModel.query().findOne({ email })

    if (!user) {
      res.status(401).send({ error: "invalid email or password" })

      return
    }

    const passwordHash = md5(password)

    if (passwordHash !== user.passwordHash) {
      res.status(401).send({ error: "invalid email or password" })

      return
    }

    const jwt = jsonwebtoken.sign(
      { payload: { userId: user.id } },
      config.security.session.secret,
      { expiresIn: config.security.session.expiresIn }
    )
    res.send({ jwt, id: user.id, displayName: user.displayName, userType: user.userType })
  })
}
export default securityRoute
