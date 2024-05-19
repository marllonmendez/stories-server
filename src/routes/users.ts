import { FastifyInstance } from "fastify"
import { z, ZodError } from "zod"

import dayjs from "dayjs"

import prisma from "../prisma"

export async function users(app: FastifyInstance) {
  app.post("/singup/user", async (request, reply) => {
    const createUser = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(5),
    })

    try {
      const {name, email, password} = createUser.parse(request.body)
      const today = dayjs().toDate()
      const possibleUser = await prisma.user.findUnique({
        where: {email},
      })

      if (possibleUser) {
        throw new Error("O e-mail informado já está em uso.")
      }

      await prisma.user.create({
        data: {
          name,
          email,
          password,
          created_at: today,
        }
      })

      return reply.status(200).send({message: "Usuário criado com sucesso."})

    } catch (err: any) {
      if (err instanceof ZodError) {
        let issueError = {
          validationError: true,
          message: 'Error de validação',
          fields: [] as Array<string | number>
        }
        err.issues && err.issues.forEach(issue => {
          issue.path.forEach(item => {
            issueError.fields.push(item)
          })
        })
        return reply.status(400).send(issueError)
      }
      return reply.status(500).send({message: err.message})
    }
  })
}

//   app.post("/users/login", async (request, reply) => {
//     const loginUser = z.object({
//       email: z.string().email(),
//       password: z.string().min(5),
//     })
//
//     try {
//       const { email, password } = loginUser.parse(request.body)
//       const possibleUser = await prisma.user.findUnique({
//         where: { email },
//       })
//
//       if (!possibleUser) {
//         throw new Error("Usuário não encontrado.")
//       }
//       if (possibleUser.password !== password) {
//         throw new Error("Senha invalida.")
//       }
//
//       return {
//         name: possibleUser.name,
//         email: possibleUser.email,
//       }
//     } catch (err: any) {
//       if(err instanceof ZodError) {
//         let issueError = {
//           validationError: true,
//           message: 'Error de validação',
//           fields:[] as Array<string|number>
//         }
//         err.issues && err.issues.forEach(issue => {
//           issue.path.forEach(item => {
//             issueError.fields.push(item)
//           })
//         });
//         return reply.status(400).send(issueError)
//       }
//       return reply.status(401).send({message: 'Não foi possível realizar o login.'})
//     }
//
//   })
//
// }

