import { MongoHelper } from '@/external/repositories/mongodb/helper'
import { MongodbUserRepository } from '@/external/repositories/mongodb'

describe('Mongodb user repository', () => {
   
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        await MongoHelper.clearCollection('users')
    })

    test('when user is added, it should exist', async () => {
        const userRepository = new MongodbUserRepository()
        const user = {
            name: 'Any',
            email: 'any@email.com'
        }
        await userRepository.add(user)
        expect(await userRepository.exists(user)).toBeTruthy()
    })

    test('find all users should return all added users', async () => {
        const userRepository = new MongodbUserRepository()
        await userRepository.add({
            name: 'Any name 1',
            email: 'any1@email.com'
        })
        await userRepository.add({
            name: 'Any name 2',
            email: 'any2@email.com'
        })
        const users = await userRepository.findAllUsers()
        expect(users[0].name).toEqual('Any name 1')
        expect(users[1].name).toEqual('Any name 2')
    })
})
