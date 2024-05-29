import { fastify } from 'fastify'
import cors from '@fastify/cors'

import { index } from './routes'

const app = fastify()

app.register(cors)
app.register(index)

app.listen({port: 3333}).then(() => {
  console.log('🚀 Server Running!')
})
