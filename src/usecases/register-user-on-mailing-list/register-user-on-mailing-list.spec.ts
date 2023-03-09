import { UserData } from '../../entities/user-data'
import { UserRepository } from './ports/user-repository'
import { InMemoryUserRepository } from './repository/in-memory-user-repository'
import { RegisterUserOnMailingList } from './register-user-on-mailing-list'
import { left } from '../../shared/either'
import { InvalidEmailError } from '../../entities/errors/invalid-email-error'
import { InvalidNameError } from '../../entities/errors/invalid-name-error'

describe('Register user on mailing list use case', () => {
    test('should add user with complete data to mailing list', async () => {
        const users: UserData[] = []
        const repo: UserRepository = new InMemoryUserRepository(users)
        const useCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
        const name = 'user name'
        const email = 'user@email.com'
        const response = await useCase.registerUserOnMailingList({ name, email })
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
        const response = await useCase.registerUserOnMailingList({ name, email: invalidEmail })
        const user = repo.findUserByEmail(`${invalidEmail}`)
        expect((await user)).toBeNull()
        expect(response).toEqual((left(new InvalidEmailError())))
    })

    test('should not add user with invalid name to mailing list', async () => {
        const users: UserData[] = []
        const repo: UserRepository = new InMemoryUserRepository(users)
        const useCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
        const invalidName = ''
        const email = 'user@email.com'
        const response = await useCase.registerUserOnMailingList({ name: invalidName, email })
        const user = repo.findUserByEmail(`${email}`)
        expect((await user)).toBeNull()
        expect(response).toEqual((left(new InvalidNameError())))
    })
})