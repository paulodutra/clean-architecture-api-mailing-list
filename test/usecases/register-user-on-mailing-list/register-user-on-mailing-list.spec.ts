import { User, UserData } from '@/entities'
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports'
import { InMemoryUserRepository } from '@/usecases/register-user-on-mailing-list/repository'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'

describe('Register user on mailing list use case', () => {
    test('should add user with complete data to mailing list', async () => {
        const users: UserData[] = []
        const repo: UserRepository = new InMemoryUserRepository(users)
        const useCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
        const name = 'user name'
        const email = 'user@email.com'
        const user = User.create({name, email}).value as User
        const response = await useCase.perform(user)
        const addedUser = repo.findUserByEmail(`${email}`)
        expect((await addedUser).name).toBe('user name')
        expect(response.name).toBe(name)
    })
})
