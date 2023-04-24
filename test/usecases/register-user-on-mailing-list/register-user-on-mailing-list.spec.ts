import { User, UserData } from '@/entities'
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports'
import { InMemoryUserRepository } from '@/usecases/register-user-on-mailing-list/repository'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'

describe('Register user on mailing list use case', () => {
    test('should add user with complete data to mailing list', async () => {
        const users: UserData[] = []
        const repo: UserRepository = new InMemoryUserRepository(users)
        const usecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
        const name = 'any_name'
        const email = 'any@email.com'
        const user = User.create({ name, email }).value as User
        const response = await usecase.perform(user)
        const addedUser = repo.findUserByEmail('any@email.com')
        expect((await addedUser).name).toBe('any_name')
        expect(response.name).toBe('any_name')
    })
})
