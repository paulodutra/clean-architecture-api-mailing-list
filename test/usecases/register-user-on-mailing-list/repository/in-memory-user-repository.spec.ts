import { UserData } from '@/entities'
import { InMemoryUserRepository } from '@/usecases/register-user-on-mailing-list/repository'

describe('In memory User repository', () => {
    test('should return null if user is not found', async () => {
        const users: UserData[] = []
        const sut = new InMemoryUserRepository(users)
        const user = await sut.findUserByEmail('any@email.com')
        expect(user).toBeNull()
    })

    test('should return user if it is found in the repository', async () => {
        const users: UserData[] = []
        const name = 'any'
        const email = 'any@mail.com'
        const sut = new InMemoryUserRepository(users)
        await sut.add({name, email})
        const user = await sut.findUserByEmail('any@mail.com')
        expect(user.name).toBe(name)
    })

    test('should return all users in the repository', async () => {
        const users: UserData[] = [
            {name: 'any', email: 'any@mail.com'}, 
            {name: 'user', email: 'user@mail.com'}
        ]
        const sut = new InMemoryUserRepository(users)
        const returnedUsers = await sut.findAllUsers()
        expect((await returnedUsers).length).toBe(2)
    })
})
