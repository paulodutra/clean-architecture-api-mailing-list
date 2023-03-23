import { MongoHelper } from '@/external/repositories/mongodb/helper'
import { MongodbUserRepository } from '@/external/repositories/mongodb'

describe('Mongodb user repository', () => {
    process.on('unhandledRejection', (error) => {
        console.log('error', error)
    })

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
        console.log(process.env.MONGO_URL)
        const userRepository = new MongodbUserRepository()
        const user = {
            name: 'Any',
            email: 'any@email.com'
        }
        await userRepository.add(user)
        expect(await userRepository.exists(user)).toBeTruthy()
    })
})
