import { User } from './user'
import { left } from '../shared/either'
import { InvalidEmailError } from './errors/invalid-email-error'

describe('user domain entity', () => {
    test('should not create user with invalid e-mail address', () => {
        const invalidEmail = 'invalid_email'
        const error = User.create({name: 'any', email: invalidEmail})
        expect(error).toEqual((left(new InvalidEmailError())))
        
    })
})
