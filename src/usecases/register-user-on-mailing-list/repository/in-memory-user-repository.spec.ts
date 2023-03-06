import { UserData } from '../user-data'
import { InMemoryUserRepository } from './in-memory-user-repository'

describe('In memory User repository', () => {
    test('should return null if user is not found', async () => {
        const users: UserData[] = []
        const userRepo = new InMemoryUserRepository(users)
        const user = await userRepo.findUserByEmail('any@email.com')
        expect(user).toBeNull()
    })

    test('should return user if it is found in the repository', async () => {
        const users: UserData[] = []
        const name = 'any'
        const email = 'any@mail.com'
        const userRepo = new InMemoryUserRepository(users)
        await userRepo.add({name, email})
        const user = await userRepo.findUserByEmail('any@mail.com')
        expect(user.name).toBe(name)
    })

    test('should return all users in the repository', async () => {
        const users: UserData[] = [
            {name: 'any', email: 'any@mail.com'}, 
            {name: 'user', email: 'user@mail.com'}
        ]
        const userRepo = new InMemoryUserRepository(users)
        const returnedUsers = await userRepo.findAllUsers()
        expect((await returnedUsers).length).toBe(2)
    })
})
