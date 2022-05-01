import cors from "cors"
import express, { json } from "express"
import knex from "knex"
import { Model } from "objection"
import knexfile from "./knexfile.js"
import config from "./src/config.js"
import postsRoute from "./src/routes/posts.js"
import securityRoute from "./src/routes/security.js"
import usersRoute from "./src/routes/users.js"

const app = express()
const db = knex(knexfile)

Model.knex(db)

app.use(json())
app.use(cors())

usersRoute({ app, db })
postsRoute({ app, db })
securityRoute({ app, db })

app.listen(config.port, () => console.log(`Listening on : ${config.port}`))
