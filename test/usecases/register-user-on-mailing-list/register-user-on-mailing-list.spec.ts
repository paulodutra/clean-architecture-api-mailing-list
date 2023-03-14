import { UserData } from '@/entities'
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports'
import { InMemoryUserRepository } from '@test/usecases/register-user-on-mailing-list/repository'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'

describe('Register user on mailing list use case', () => {
    test('should add user with complete data to mailing list', async () => {
        const users: UserData[] = []
        const repo: UserRepository = new InMemoryUserRepository(users)
        const useCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
        const name = 'user name'
        const email = 'user@email.com'
        const response = await useCase.perform({ name, email })
        const user = repo.findUserByEmail(`${email}`)
        expect((await user).name).toBe('user name')
        expect(response.value.name).toBe(name)
    })

    test('should not add user with invalid email to mailing list', async () => {
        const users: UserData[] = []
        const repo: UserRepository = new InMemoryUserRepository(users)
        const useCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
        const name = 'user name'
        const invalidEmail = 'useremail.com'
        const response = (await useCase.perform({ name, email: invalidEmail })).value as Error
        const user = repo.findUserByEmail(`${invalidEmail}`)
        expect((await user)).toBeNull()
        expect(response.name).toEqual('InvalidEmailError')
    })

    test('should not add user with invalid name to mailing list', async () => {
        const users: UserData[] = []
        const repo: UserRepository = new InMemoryUserRepository(users)
        const useCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
        const invalidName = ''
        const email = 'user@email.com'
        const response = (await useCase.perform({ name: invalidName, email })).value as Error
        const user = repo.findUserByEmail(`${email}`)
        expect((await user)).toBeNull()
        expect(response.name).toEqual('InvalidNameError')
    })
})