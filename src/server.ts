import { fastify } from "fastify"
import cors from "@fastify/cors"

import { users } from './routes/users'

const app = fastify()

app.register(cors)
app.register(users)

app.listen({port: 3333}).then(() => {
  console.log("🚀 Server Running!")
})
