import Prisma from '../prisma'

class CreateUserService {
  async execute() {
    console.log('Create UserService')
    return {ok : true}
  }
}

export { CreateUserService }
