import { FastifyInstance } from 'fastify'
import { z, ZodError } from 'zod'

import dayjs from 'dayjs'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import prisma from '../lib/prisma'

type JwtPayload = {
  id: string
}

export async function index(app: FastifyInstance) {
  app.post('/signup/user', async (request, reply) => {
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
        throw new Error('O e-mail informado já está em uso')
      }

      const hashPassword = await bcrypt.hash(password, 10)

      await prisma.user.create({
        data: {
          name,
          email,
          password: hashPassword,
          created_at: today
        }
      })

      return reply.status(200).send({message: 'Usuário criado com sucesso'})

    } catch (err: any) {
      if (err instanceof ZodError) {
        const issueError = {
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

  app.post('/signin/user', async (request, reply) => {
    const createUserBody = z.object({
      email: z.string().email(),
      password: z.string().min(5),
    })

    try {
      const {email, password} = createUserBody.parse(request.body)

      const possibleUser = await prisma.user.findUnique({
        where: {
          email,
        }
      })

      if (!possibleUser) {
        throw new Error('Usuário não encontrado')
      }

      const verifyPassword = await bcrypt.compare(password, possibleUser.password)

      if (!verifyPassword) {
        throw new Error('Dados inválidos')
      }

      const token = jwt.sign({id: possibleUser.id}, process.env.JWT_SECRET ?? '', {
        expiresIn: '24h'
      })

      const {password: _, ...userSignin} = possibleUser

      return reply.status(200).send({
        possibleUser: userSignin,
        token: token,
      })

    } catch (err: any) {
      if (err instanceof ZodError) {
        const issueError = {
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
      return reply.status(401).send({message: 'Não foi possível realizar o login.'})
    }

  })

  app.get('/profile', async (request, reply) => {
    const {authorization} = request.headers

    if (!authorization) {
      return reply.status(401).send({message: 'Não autorizado.'})
    }

    const token = authorization.split(' ')[1]

    const {id} = jwt.verify(token, process.env.JWT_SECRET ?? '') as JwtPayload
    const userId = await prisma.user.findUnique({
      where: {id},
    })

    if (!userId) {
      return reply.status(401).send({message: 'Não autorizado.'})
    }

    const {password, ...userData} = userId
    return reply.status(200).send(userData)
  })

  app.put('/user/update/:id', async (request, reply) => {
    const {authorization} = request.headers

    if (!authorization) {
      return reply.status(401).send({message: 'Não autorizado.'})
    }
    try {
      const { id } = request.params as { id: string }
      const { name, email} = request.body as { name: string, email: string }


      const updatedUser = await prisma.user.update({
        where: { id },
        data: { name, email },
      })

      const {password, ...userData} = updatedUser


      return reply.status(200).send(userData)
    } catch (err: any) {
      return reply.status(500).send({ message: err.message })
    }
  })

  app.put('/profile/user/updated', async (request, reply) => {
    const {authorization} = request.headers

    if (!authorization) {
      return reply.status(401).send({message: 'Não autorizado.'})
    }

    const token = authorization.split(' ')[1]
    const {id} = jwt.verify(token, process.env.JWT_SECRET ?? '') as JwtPayload

    const updateUser = z.object({
      name: z.string(),
      email: z.string().email(),
    })

    try {
      const {name, email} = updateUser.parse(request.body)

      const updatedUser = await prisma.user.update({
        where: {id},
        data: {name, email},
      })

      const {password, ...userData} = updatedUser

      return reply.status(200).send(userData)
    } catch (err: any) {
      if (err instanceof ZodError) {
        const issueError = {
          validationError: true,
          message: 'Error de validação',
          fields: [] as Array<string | number>,
        }
        err.issues.forEach((issue) => {
          issue.path.forEach((item) => {
            issueError.fields.push(item)
          })
        })
        return reply.status(400).send(issueError)
      }
      return reply.status(500).send({message: err.message})
    }
  })

  app.get('/users', async (request, reply) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
        }
      })
      return reply.status(200).send(users)
    } catch (err: any) {
      return reply.status(500).send({message: err.message})
    }
  })

  app.get('/user/:id', async (request, reply) => {
    try {
      const {id} = request.params as { id: string }
      const user = await prisma.user.findUnique({
        where: {id}
      })
      if (!user) {
        return reply.status(404).send({message: 'Usuário não encontrado'})
      }
      return reply.status(200).send(user)
    } catch (err: any) {
      return reply.status(500).send({message: err.message})
    }
  })

  app.delete('/user/delete/:id', async (request, reply) => {
    try {
      const {id} = request.params as { id: string }
      const user = await prisma.user.findUnique({
        where: {id}
      })
      if (!user) {
        return reply.status(404).send({message: 'Usuário não encontrado'})
      }

      const userDelete = await prisma.user.delete({
        where: { id }
      })

      return reply.status(200).send(userDelete)
    } catch (err: any) {
      return reply.status(500).send({message: err.message})
    }
  })
}
